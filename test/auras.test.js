import { test } from "node:test";
import assert from "node:assert/strict";
import { auraSources } from "../src/aura-sources.js";
import { bossState } from "../src/boss-mechanics.js";
import { stereotypeState } from "../src/stereotypes.js";

test("filtered aura sources preserve buffs, movement, deaths, overlaps and counters", () => {
  const units = [
    "basic",
    "fast",
    "fast",
    "heavy",
    "perfume",
    "bossDani",
    "bossDani",
    "bossPedro",
    "bossSanti",
  ].map((kind, id) => ({ kind, id, x: 100 + id * 3, y: 100, hp: 100 }));
  const game = {
    time: 0,
    units,
    buildings: [
      { type: "odor", level: 2, hp: 100, x: 100, y: 100 },
      { type: "odor", level: 3, hp: 0, x: 100, y: 100 },
    ],
  };
  for (const time of [0, 4, 7, 8]) {
    game.time = time;
    const sources = auraSources(game);
    for (const unit of units) {
      assert.deepEqual(bossState(game, unit, sources), bossState(game, unit));
      assert.deepEqual(
        stereotypeState(game, unit, sources),
        stereotypeState(game, unit),
      );
    }
    units[5].x += 200;
    units[1].hp = 0;
    for (const unit of units) {
      assert.deepEqual(bossState(game, unit, sources), bossState(game, unit));
      assert.deepEqual(
        stereotypeState(game, unit, sources),
        stereotypeState(game, unit),
      );
    }
  }
});
