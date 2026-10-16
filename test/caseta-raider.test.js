import { test } from "node:test";
import assert from "node:assert/strict";
import { Game, building, UNITS } from "../src/engine.js";
import { normalWave } from "../src/data/waves.js";

function encounter(kind = "saboteur") {
  const game = new Game();
  game.phase = "combat";
  game.pending = [{ kind: "basic", entry: 0, at: 1000 }];
  game.base.cooldown = 1000;
  const tent = building("tent", 200, 340, 1);
  tent.cooldown = 1000;
  game.buildings = [tent];
  const unit = {
    ...UNITS[kind],
    id: 1,
    kind,
    character: kind === "saboteur" ? kind : "polo",
    x: 200,
    y: 300,
    hp: 1000,
    maxHp: 1000,
    cooldown: 0,
    slow: 0,
    route: [{ x: 600, y: 300 }],
    routeIndex: 0,
  };
  game.units = [unit];
  return { game, tent, unit };
}

test("saboteur starts alone in round seven and grows by one every four rounds", () => {
  for (let round = 1; round <= 20; round++) {
    const raiders = normalWave(round, 11).filter((u) => u.kind === "saboteur");
    assert.equal(
      raiders.length,
      round < 7 ? 0 : 1 + Math.floor((round - 7) / 4),
    );
  }
});

test("saboteur telegraphs hits, stays on the road and resumes movement after the target is destroyed", () => {
  const { game, tent, unit } = encounter();
  const hp = tent.hp;
  game.tick(0.4);
  assert.equal(unit.raidingId, tent.id);
  assert.equal(unit.x, 200);
  assert.equal(unit.y, 300);
  assert.equal(tent.hp, hp);
  game.tick(0.5);
  assert.equal(tent.hp, hp - unit.damage);
  game.tick(1);
  assert.equal(tent.hp, hp - unit.damage);
  game.tick(1.9);
  assert.equal(tent.hp, hp - unit.damage * 2);
  tent.hp = 0;
  game.tick(0.05);
  assert.ok(unit.x > 200);
  assert.equal(unit.raidingId, null);
});

test("other attackers ignore side tents and saboteurs cannot attack outside their range", () => {
  for (const kind of ["basic", "saboteur"]) {
    const { game, tent, unit } = encounter(kind);
    if (kind === "saboteur") tent.y = 500;
    const hp = tent.hp;
    game.tick(1);
    assert.ok(unit.x > 200);
    assert.equal(tent.hp, hp);
  }
});

test("barricades take priority over sabotage and assembly prevents attacks while frozen", () => {
  const { game, tent, unit } = encounter();
  const barrier = building("barrier", 220, 300, 2);
  game.buildings.push(barrier);
  const hp = tent.hp;
  game.tick(1);
  assert.equal(unit.blockedBy, barrier.id);
  assert.equal(tent.hp, hp);
  assert.equal(barrier.hp, barrier.maxHp - unit.damage);
  barrier.hp = 0;
  game.freezeUntil = game.time + 2;
  game.tick(1);
  assert.equal(tent.hp, hp);
  assert.equal(unit.x, 200);
  game.tick(1.1);
  assert.equal(tent.hp, hp - unit.damage);
});
