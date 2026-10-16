import { test } from "node:test";
import assert from "node:assert/strict";
import { Game, UNITS } from "../src/engine.js";
import {
  advanceAttackerAbility,
  attackerSpeedMultiplier,
} from "../src/attacker-abilities.js";
import { strikeTarget } from "../src/combat.js";
import { totalRounds } from "../src/data/progression.js";
import { WAVES } from "../src/data/waves.js";

test("regeneration caps at maximum health and never revives defeated attackers", () => {
  const u = { kind: "medic", hp: 90, maxHp: 105 };
  advanceAttackerAbility(u, 2);
  assert.equal(u.hp, 100);
  advanceAttackerAbility(u, 2);
  assert.equal(u.hp, 105);
  u.hp = 0;
  advanceAttackerAbility(u, 10);
  assert.equal(u.hp, 0);
});
test("enraged attackers gain speed and melee damage only below half health", () => {
  const g = new Game(),
    u = {
      kind: "berserker",
      hp: 83,
      maxHp: 165,
      damage: 16,
      cooldown: 0,
      x: 0,
      y: 0,
    };
  const target = { hp: 100, x: 0, y: 0 };
  assert.equal(attackerSpeedMultiplier(u), 1);
  strikeTarget(g, u, target);
  assert.equal(target.hp, 84);
  u.hp = 82;
  u.cooldown = 0;
  assert.equal(attackerSpeedMultiplier(u), 1.6);
  strikeTarget(g, u, target);
  assert.equal(target.hp, 60);
  assert.ok(
    UNITS.sprinter.speed > UNITS.fast.speed &&
      UNITS.fast.speed > UNITS.basic.speed * 2,
  );
});
test("story advances through twenty chapters, with bosses only at requested milestones", () => {
  const g = new Game();
  assert.equal(totalRounds(g), 20);
  assert.equal(totalRounds(new Game("attack")), 8);
  assert.equal(WAVES.length, 20);
  assert.deepEqual(
    WAVES.flatMap((w, i) => (w.boss ? [i + 1] : [])),
    [5, 12, 20],
  );
  for (let round = 1; round <= 20; round++) {
    assert.equal(g.round, round);
    assert.ok(WAVES[round - 1].story.length > 20);
    assert.ok(g.command({ type: "ready" }));
    g.pending = [];
    g.units = [];
    g.tick(0.01);
    assert.equal(g.result, round === 20 ? "defense" : null);
  }
});
