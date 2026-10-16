import { test } from "node:test";
import assert from "node:assert/strict";
import { damageMarkLevel } from "../src/render/damage-look.js";
import { drawStereotypes } from "../src/render/stereotypes.js";
import { odorStats } from "../src/stereotypes.js";

test("damage cosmetics affect half a crowd consistently, recover with healing and never mutate units", () => {
  const crowd = Array.from({ length: 100 }, (_, id) =>
    Object.freeze({ id, hp: 80, maxHp: 100 }),
  );
  assert.equal(crowd.filter((u) => damageMarkLevel(u)).length, 50);
  assert.deepEqual(crowd.map(damageMarkLevel), crowd.map(damageMarkLevel));
  const unit = { id: 2, maxHp: 100, hp: 20 };
  const severe = damageMarkLevel(unit);
  unit.hp = 50;
  assert.ok(damageMarkLevel(unit) < severe);
  unit.hp = 100;
  assert.equal(damageMarkLevel(unit), 0);
  unit.hp = 0;
  assert.equal(damageMarkLevel(unit), 0);
});

test("odor coverage follows actual upgraded radius and disappears when its source is blocked", () => {
  const ellipses = [];
  const ctx = new Proxy(
    {},
    {
      get: (_, key) =>
        key === "ellipse" ? (...args) => ellipses.push(args) : () => {},
      set: () => true,
    },
  );
  const building = {
    id: 1,
    type: "odor",
    x: 300,
    y: 250,
    level: 3,
    branch: "rapid",
    hp: 100,
  };
  const game = { buildings: [building], units: [], time: 10 };
  drawStereotypes(ctx, game, 10);
  const radius = odorStats(building, game).radius;
  assert.equal(ellipses[0][2], radius);
  assert.equal(ellipses[0][3], radius * 0.66);
  assert.ok(
    ellipses.length < 16,
    "each source has a fixed small effect budget",
  );
  ellipses.length = 0;
  game.storyEvent = { buildingId: 1, wholeRound: true };
  drawStereotypes(ctx, game, 10);
  assert.equal(ellipses.length, 0);
  game.storyEvent = null;
  building.hp = 0;
  drawStereotypes(ctx, game, 10);
  assert.equal(ellipses.length, 0);
});
