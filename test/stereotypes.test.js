import { test } from "node:test";
import assert from "node:assert/strict";
import { stereotypeState, odorStats } from "../src/stereotypes.js";
const cloud = (level = 1) => ({ type: "odor", x: 0, y: 0, hp: 90, level });
test("odor damages nearby attackers without slowing or stacking and disappears outside its radius", () => {
  const unit = { kind: "basic", x: 20, y: 0, hp: 50 };
  const game = { buildings: [cloud(), cloud()], units: [unit] };
  assert.equal(stereotypeState(game, unit).multiplier, 1);
  assert.equal(stereotypeState(game, unit).dps, 2);
  unit.x = 100;
  assert.equal(stereotypeState(game, unit).multiplier, 1);
  assert.equal(stereotypeState(game, unit).dps, 0);
  game.buildings[0].level = 3;
  assert.equal(stereotypeState(game, unit).dps, 4);
  assert.equal(odorStats(game.buildings[0]).radius, 125);
});
test("perfume counters odor, while live streams boost allies only once", () => {
  const unit = { kind: "perfume", x: 0, y: 0, hp: 50 },
    fast = { kind: "fast", x: 0, y: 0, hp: 32 };
  const game = { buildings: [cloud()], units: [unit, fast, { ...fast }] };
  assert.equal(stereotypeState(game, unit).stinky, false);
  assert.equal(stereotypeState(game, unit).dps, 0);
  assert.equal(stereotypeState(game, unit).multiplier, 1.25);
  assert.equal(stereotypeState(game, fast).hyped, false);
  game.units[1].hp = 0;
  game.units[2].hp = 0;
  assert.equal(stereotypeState(game, unit).multiplier, 1);
});
