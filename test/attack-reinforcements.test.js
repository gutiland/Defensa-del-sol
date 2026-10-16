import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { placementError } from "../src/placement.js";

test("each surviving attack round adds exactly one legal permanent reinforcement with unique identity", () => {
  const g = new Game("attack");
  const initial = g.buildings.length,
    ids = new Set(g.buildings.map((b) => b.id));
  g.buildings[0].hp -= 40;
  for (let round = 1; round < 8; round++) {
    g.phase = "combat";
    g.pending = [];
    g.units = [];
    const before = g.buildings.length;
    g.tick(0.01);
    assert.equal(g.round, round + 1);
    assert.equal(g.phase, "attack");
    assert.equal(g.buildings.length, before + 1);
    const b = g.buildings.at(-1);
    assert.equal(b.reinforcement, true);
    assert.equal(ids.has(b.id), false);
    ids.add(b.id);
    assert.equal(
      placementError(
        { ...g, buildings: g.buildings.filter((other) => other !== b) },
        b.x,
        b.y,
        b.type,
      ),
      null,
    );
    if (round === 1) assert.equal(g.buildings[0].hp, g.buildings[0].maxHp - 15);
  }
  assert.equal(g.buildings.length, initial + 7);
  const before = g.buildings.length;
  g.phase = "combat";
  g.tick(0.01);
  assert.equal(g.result, "loss");
  assert.equal(g.buildings.length, before);
});
test("reinforcements do not appear in defense, local play or after base destruction", () => {
  for (const mode of ["defense", "local", "attack"]) {
    const g = new Game(mode),
      before = g.buildings.length;
    g.phase = "combat";
    g.pending = [];
    g.units = [];
    if (mode === "attack") g.base.hp = 0;
    g.tick(0.01);
    assert.equal(g.buildings.length, before);
  }
});
