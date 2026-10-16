import { test } from "node:test";
import assert from "node:assert/strict";
import { createAttackerSprites } from "../src/render/attacker-sprites.js";
import { drawUnitBars } from "../src/render/unit.js";

function context() {
  const calls = { images: 0, paths: 0 };
  const ctx = new Proxy(
    {},
    {
      get: (_, key) =>
        key === "drawImage"
          ? () => calls.images++
          : key === "beginPath"
            ? () => calls.paths++
            : key === "createLinearGradient" || key === "createRadialGradient"
              ? () => ({ addColorStop() {} })
              : () => {},
      set: () => true,
    },
  );
  return { ctx, calls };
}

test("a crowd shares walking frames while hits and bosses keep live drawing", () => {
  const main = context(),
    artwork = context();
  let created = 0;
  const sprites = createAttackerSprites(() => {
    created++;
    return { getContext: () => artwork.ctx };
  });
  const pose = { moving: true, talking: true, seed: 1 };
  sprites.beginFrame();
  for (let i = 0; i < 600; i++)
    sprites.draw(main.ctx, "polo", i, 100, 1, 0, "basic", pose);
  assert.equal(created, 1);
  assert.equal(main.calls.images, 600);
  assert.equal(main.calls.paths, 0);
  sprites.draw(main.ctx, "polo", 0, 0, 1, 0, "basic", { ...pose, hit: true });
  assert.ok(main.calls.paths > 0);
  const before = main.calls.paths;
  sprites.draw(main.ctx, "bossDani", 0, 0, 1.5, 0, "heavy", pose);
  assert.ok(main.calls.paths > before);
  assert.equal(created, 1);
});

test("cache creation is limited per frame and banner variants remain distinct", () => {
  const main = context(),
    artwork = context();
  let created = 0;
  const sprites = createAttackerSprites(() => {
    created++;
    return { getContext: () => artwork.ctx };
  });
  sprites.beginFrame();
  for (let seed = 0; seed < 5; seed++)
    sprites.draw(main.ctx, "gilet", 0, 0, 1, -seed * 0.63, "heavy", {
      moving: true,
      talking: true,
      seed,
    });
  assert.equal(created, 4);
  assert.ok(main.calls.paths > 0, "cache misses must still draw the attacker");
  sprites.beginFrame();
  sprites.draw(main.ctx, "gilet", 0, 0, 1, -4 * 0.63, "heavy", {
    moving: true,
    talking: true,
    seed: 4,
  });
  assert.equal(created, 5);
});

test("warming frames reuse the same character without further vector work", () => {
  const main = context(),
    artwork = context();
  let created = 0;
  const sprites = createAttackerSprites(() => {
    created++;
    return { getContext: () => artwork.ctx };
  });
  sprites.beginFrame();
  for (let i = 0; i < 600; i++)
    sprites.draw(main.ctx, "polo", 0, 0, 1, i * 0.02, "basic", {
      moving: true,
      talking: true,
      seed: i,
    });
  assert.equal(created, 4);
  assert.equal(main.calls.paths, 0);
  assert.equal(main.calls.images, 600);
});

test("crowd health bars use three fill batches regardless of unit count", () => {
  let fills = 0,
    rectangles = 0;
  const ctx = {
    save() {},
    restore() {},
    beginPath() {},
    fill() {
      fills++;
    },
    rect(x, y, width, height) {
      assert.ok(Number.isFinite(x) && Number.isFinite(y));
      assert.ok(width >= 0);
      assert.equal(height, 5);
      rectangles++;
    },
  };
  drawUnitBars(
    ctx,
    Array.from({ length: 600 }, (_, i) => ({
      x: i,
      y: 300,
      hp: i % 2 ? 10 : 100,
      maxHp: 100,
    })),
  );
  assert.equal(fills, 3);
  assert.equal(rectangles, 1200);
});
