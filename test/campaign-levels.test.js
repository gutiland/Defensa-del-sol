import { test } from "node:test";
import assert from "node:assert/strict";
import { Game, building } from "../src/engine.js";
import { LEVELS, campaignLevel, levelRound } from "../src/data/campaign.js";
test("three levels retain the same camp, upgrades, specialization and treasury at transitions", () => {
  for (const [round, nextLevel] of [
    [5, 2],
    [12, 3],
  ]) {
    const g = new Game();
    g.round = round;
    g.phase = "combat";
    g.pending = [];
    g.units = [];
    g.money = 123;
    const tent = building("tent", 400, 280, 10);
    tent.level = 3;
    tent.branch = "power";
    tent.hp = 70;
    tent.maxHp = 230;
    g.buildings = [tent];
    const base = g.base;
    g.base.hp = 321;
    g.tick(0.01);
    assert.equal(g.result, null);
    assert.equal(g.phase, "build");
    assert.equal(campaignLevel(g.round).number, nextLevel);
    assert.equal(levelRound(g.round), 1);
    assert.equal(g.buildings[0], tent);
    assert.equal(tent.level, 3);
    assert.equal(tent.branch, "power");
    assert.equal(tent.hp, 95);
    assert.equal(g.base, base);
    assert.equal(g.base.hp, 321);
    assert.equal(g.money, 168);
  }
});
test("each level ends with its own boss and later bosses have increasing endurance", () => {
  const health = [];
  for (const level of LEVELS) {
    const g = new Game();
    g.round = level.last;
    g.command({ type: "ready" });
    assert.deepEqual(
      g.pending.filter((u) => u.kind.startsWith("boss")).map((u) => u.kind),
      [level.boss],
    );
    g.tick(0.01);
    const boss = g.units.find((u) => u.kind === level.boss);
    health.push(boss.maxHp);
  }
  assert.ok(health[0] < health[1] && health[1] < health[2]);
});
