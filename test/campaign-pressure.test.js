import { test } from "node:test";
import assert from "node:assert/strict";
import { Game, UNITS } from "../src/engine.js";
import { AdminGame } from "../src/admin-game.js";
import { campaignPressure, LEVELS } from "../src/data/campaign.js";
import { bountyFor } from "../src/data/progression.js";

function spawn(game, round, kind = "basic") {
  game.round = round;
  game.phase = "combat";
  game.base.cooldown = 1000;
  game.pending = [{ kind, entry: 0, at: 0 }];
  game.tick(0.001);
  return game.units[0];
}

test("level one keeps original ordinary stats and later rounds progressively increase pressure", () => {
  for (let round = 1; round <= 5; round++) {
    const unit = spawn(new Game(), round);
    assert.equal(unit.maxHp, UNITS.basic.hp);
    assert.equal(unit.speed, UNITS.basic.speed);
    assert.equal(unit.damage, UNITS.basic.damage);
    assert.equal(campaignPressure(round).groupSpacing, 3.2);
  }
  let previous = spawn(new Game(), 5);
  for (let round = 6; round <= 20; round++) {
    const unit = spawn(new Game(), round);
    assert.ok(unit.maxHp > previous.maxHp);
    assert.ok(unit.speed > previous.speed);
    assert.ok(unit.damage >= previous.damage);
    assert.equal(bountyFor(unit), bountyFor({ kind: "basic" }));
    previous = unit;
  }
});

test("campaign scaling does not change attack, local duel, sandbox or shared unit definitions", () => {
  const before = structuredClone(UNITS);
  for (const game of [new Game("attack"), new Game("local"), new AdminGame()]) {
    for (const kind of ["basic", "fast", "heavy", "medic", "bossPedro"]) {
      game.units = [];
      const unit = spawn(game, 20, kind);
      assert.equal(unit.maxHp, UNITS[kind].hp);
      assert.equal(unit.speed, UNITS[kind].speed);
      assert.equal(unit.damage, UNITS[kind].damage);
    }
  }
  assert.deepEqual(UNITS, before);
});

test("boss health uses its level multiplier once without ordinary-unit scaling", () => {
  for (const level of LEVELS) {
    const unit = spawn(new Game(), level.last, level.boss);
    assert.equal(
      unit.maxHp,
      Math.round(UNITS[level.boss].hp * level.bossHealth),
    );
    assert.equal(unit.speed, UNITS[level.boss].speed);
    assert.equal(unit.damage, UNITS[level.boss].damage);
  }
});
