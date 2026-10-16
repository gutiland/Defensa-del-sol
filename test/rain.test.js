import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { normalWave } from "../src/data/waves.js";
import { advanceRainSlip } from "../src/rain.js";
test("rain adds exactly two basic attackers with or without covered tents", () => {
  for (const covered of [false, true]) {
    const g = new Game();
    g.round = 9;
    if (covered) g.command({ type: "story-choice", option: "cover" });
    g.command({ type: "ready" });
    assert.equal(g.pending.length, normalWave(9, 11).length + 2);
    assert.equal(
      g.pending.filter((u) => u.kind === "basic").length,
      normalWave(9, 11).filter((u) => u.kind === "basic").length + 2,
    );
    g.time = 40;
    assert.equal(
      g.storyEvent.id,
      "rain",
      "weather outlasts the initial cadence penalty",
    );
  }
});
test("slipping interrupts movement and melee, costs six health once, and recovers", () => {
  const g = new Game();
  g.round = 9;
  g.command({ type: "ready" });
  g.base.cooldown = 1000;
  g.pending = [{ kind: "basic", entry: 0, at: 100 }];
  const u = {
    id: 3,
    kind: "basic",
    character: "polo",
    x: 500,
    y: 340,
    hp: 100,
    maxHp: 100,
    damage: 10,
    speed: 30,
    cooldown: 0,
    slow: 0,
    route: [{ x: 528, y: 340 }],
    routeIndex: 0,
    slipAt: 0,
  };
  g.units = [u];
  const hp = g.base.hp;
  g.tick(0.05);
  assert.equal(u.hp, 94);
  assert.equal(u.x, 500);
  assert.equal(g.base.hp, hp);
  for (let i = 0; i < 20; i++) g.tick(0.05);
  assert.equal(u.x, 500);
  assert.equal(u.hp, 94);
  assert.equal(g.base.hp, hp);
  g.freezeUntil = g.time + 1;
  const remaining = u.slipRemaining;
  g.tick(0.1);
  assert.equal(u.slipRemaining, remaining);
  g.freezeUntil = 0;
  for (let i = 0; i < 40; i++) g.tick(0.05);
  assert.equal(u.slipRemaining, 0);
  assert.ok(u.x > 500);
  assert.equal(u.hp, 94);
});
test("slips affect only a subset and cannot trigger outside rain or revive a defeated attacker", () => {
  const g = new Game();
  g.time = 10;
  g.storyEvent = { id: "rain" };
  const u = {
    id: 1,
    hp: 100,
    route: [{ x: 10, y: 0 }],
    routeIndex: 0,
    slipAt: 0,
  };
  assert.equal(advanceRainSlip(g, u, 0.05), false);
  u.id = 3;
  g.storyEvent = null;
  assert.equal(advanceRainSlip(g, u, 0.05), false);
  g.storyEvent = { id: "rain" };
  u.hp = 4;
  assert.equal(advanceRainSlip(g, u, 0.05), true);
  assert.equal(u.hp, 0);
});
