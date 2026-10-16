import { test } from "node:test";
import assert from "node:assert/strict";
import {
  TENT_DEFENDERS,
  buildingDefender,
  defenderCharacter,
  CHARACTERS,
} from "../src/data/characters.js";
import { building, Game } from "../src/engine.js";
test("proletariat residents exclude specialists and remain assigned through upgrades and level transitions", () => {
  const specialists = new Set();
  for (const type of ["base", "area", "odor", "speaker", "kitchen", "barrier"])
    for (let i = 0; i < 10; i++) specialists.add(defenderCharacter(type, i));
  for (const id of TENT_DEFENDERS) {
    assert.equal(CHARACTERS[id].side, "defense");
    assert.equal(specialists.has(id), false);
  }
  const g = new Game(),
    tent = building("tent", 400, 280, 1),
    resident = buildingDefender(tent);
  assert.ok(TENT_DEFENDERS.includes(resident));
  g.buildings = [tent];
  g.money = 300;
  assert.ok(g.command({ type: "upgrade", id: 1 }));
  assert.equal(buildingDefender(tent), resident);
  g.round = 5;
  g.phase = "combat";
  g.pending = [];
  g.units = [];
  g.tick(0.01);
  assert.equal(g.round, 6);
  assert.equal(buildingDefender(tent), resident);
});
