import { test } from "node:test";
import assert from "node:assert/strict";
import { Game, building } from "../src/engine.js";
import { beginStoryEvent, eventShotInterval } from "../src/story-events.js";
import { normalWave } from "../src/data/waves.js";
test("disputed tent remains disabled for the whole round and recovers in the next one", () => {
  const g = new Game();
  g.round = 4;
  const tent = building("tent", 400, 280, 1);
  tent.level = 2;
  g.buildings = [tent];
  g.command({ type: "ready" });
  g.base.cooldown = 1000;
  g.pending = [{ kind: "basic", entry: 0, at: 100 }];
  g.units = [
    {
      id: 1,
      kind: "basic",
      character: "polo",
      x: 410,
      y: 280,
      hp: 1e6,
      maxHp: 1e6,
      speed: 0,
      damage: 1,
      slow: 0,
      cooldown: 0,
      route: [{ x: 1000, y: 280 }],
      routeIndex: 0,
    },
  ];
  g.tick(0.05);
  assert.equal(tent.lastShot, undefined);
  for (let i = 0; i < 201; i++) g.tick(0.05);
  assert.equal(tent.lastShot, undefined);
  g.units = [];
  g.pending = [];
  g.tick(0.05);
  assert.equal(g.round, 5);
  assert.equal(g.storyEvent, null);
  g.command({ type: "ready" });
  g.base.cooldown = 1000;
  g.pending = [{ kind: "basic", entry: 0, at: 100 }];
  g.units = [
    {
      id: 99,
      kind: "basic",
      character: "polo",
      x: 410,
      y: 280,
      hp: 1000,
      maxHp: 1000,
      speed: 0,
      damage: 1,
      slow: 0,
      cooldown: 0,
      route: [{ x: 1000, y: 280 }],
      routeIndex: 0,
    },
  ];
  g.tick(0.05);
  assert.equal(tent.lastShot, 0.05);
  assert.equal(tent.level, 2);
  assert.equal(tent.hp, tent.maxHp);
});
test("choices validate costs and phase, cannot charge twice, and mediation avoids disabling the tent", () => {
  const g = new Game();
  g.round = 4;
  g.buildings = [building("tent", 400, 280, 1)];
  g.money = 39;
  assert.equal(g.command({ type: "story-choice", option: "mediate" }), false);
  assert.equal(g.money, 39);
  g.money = 55;
  assert.equal(g.command({ type: "story-choice", option: "mediate" }), true);
  assert.equal(g.money, 15);
  assert.equal(g.command({ type: "story-choice", option: "mediate" }), false);
  assert.equal(g.money, 15);
  g.command({ type: "ready" });
  assert.equal(g.storyEvent, null);
  assert.equal(g.command({ type: "story-choice", option: "debate" }), false);
  const empty = new Game();
  empty.round = 4;
  empty.money = 0;
  assert.ok(empty.command({ type: "story-choice", option: "mediate" }));
  assert.equal(empty.money, 0);
});
test("rain cadence penalty expires and covering tents avoids it", () => {
  const g = new Game();
  g.round = 9;
  g.command({ type: "ready" });
  assert.equal(eventShotInterval(g), 1.25);
  g.time = 20;
  assert.equal(eventShotInterval(g), 1);
  const covered = new Game();
  covered.round = 9;
  covered.command({ type: "story-choice", option: "cover" });
  covered.command({ type: "ready" });
  assert.equal(eventShotInterval(covered), 1);
});
test("12 October adds distributed reinforcements and organizing delays those extras by ten seconds", () => {
  const create = () => {
    const g = new Game();
    g.round = 15;
    g.pending = normalWave(15, 11);
    return g;
  };
  const held = create(),
    organized = create(),
    before = held.pending.length;
  organized.command({ type: "story-choice", option: "organize" });
  beginStoryEvent(held);
  beginStoryEvent(organized);
  assert.equal(held.pending.length, before + Math.ceil(before * 0.25));
  assert.ok(new Set(held.pending.slice(before).map((u) => u.entry)).size > 3);
  held.pending
    .slice(before)
    .forEach((u, i) =>
      assert.equal(organized.pending[before + i].at, u.at + 10),
    );
  for (const g of [
    new Game("attack"),
    Object.assign(new Game(), { sandbox: true }),
  ]) {
    g.round = 15;
    assert.equal(
      g.command({ type: "story-choice", option: "organize" }),
      false,
    );
    beginStoryEvent(g);
    assert.equal(g.storyEvent, null);
  }
});
