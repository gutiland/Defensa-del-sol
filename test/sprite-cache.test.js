import { test } from "node:test";
import assert from "node:assert/strict";
import { createSprites } from "../src/render/sprites.js";

test("shelters share cached artwork but upgrades and base use distinct images", () => {
  const old = globalThis.document;
  const images = [];
  const context = new Proxy(
    {},
    {
      get: (_, key) =>
        key === "measureText"
          ? () => ({ width: 20 })
          : key === "createLinearGradient" || key === "createRadialGradient"
            ? () => ({ addColorStop() {} })
            : () => {},
      set: () => true,
    },
  );
  globalThis.document = {
    createElement() {
      const image = { getContext: () => context };
      images.push(image);
      return image;
    },
  };
  try {
    const { tent } = createSprites(context);
    const building = {
      id: 2,
      type: "tent",
      level: 1,
      x: 200,
      y: 200,
      hp: 100,
      maxHp: 100,
    };
    tent(building);
    tent({ ...building, id: 4, hp: 25 });
    assert.equal(
      images.length,
      1,
      "position and damage must not duplicate artwork",
    );
    tent({ ...building, level: 2 });
    assert.equal(images.length, 2, "upgrade must refresh the shelter design");
    tent(building, true);
    assert.equal(images.length, 3, "central tent has its own artwork");
    tent(building);
    assert.equal(images.length, 3);
  } finally {
    if (old === undefined) delete globalThis.document;
    else globalThis.document = old;
  }
});
