import { test } from "node:test";
import assert from "node:assert/strict";
import { Game, ENTRIES } from "../src/engine.js";
test("one wave preserves multiple entry routes when spawning attackers", () => {
  const game = new Game("attack");
  game.buildings = [];
  game.command({ type: "recruit", kind: "basic", entry: 0 });
  game.command({ type: "recruit", kind: "basic", entry: 2 });
  game.command({ type: "recruit", kind: "basic", entry: 7 });
  game.command({ type: "ready" });
  assert.deepEqual(
    game.pending.map((unit) => unit.entry),
    [0, 2, 7],
  );
  for (let i = 0; i < 40; i++) game.tick(0.05);
  assert.equal(game.units.length, 3);
  assert.deepEqual(
    game.units.map((unit) => unit.route),
    [ENTRIES[0].route, ENTRIES[2].route, ENTRIES[7].route],
  );
});
test("free placement accepts arbitrary positions and rejects overlaps, monuments and invalid coordinates without spending", () => {
  const game = new Game();
  assert.ok(game.command({ type: "build", kind: "tent", x: 440.5, y: 280.3 }));
  assert.equal(game.buildings[0].x, 440.5);
  assert.equal(game.buildings[0].y, 280.3);
  const budget = game.money;
  for (const [x, y] of [
    [443, 284],
    [500, 340],
    [20, 20],
    [585, (416 - 120) / 0.66],
    [NaN, 200],
    [400, Infinity],
  ]) {
    assert.equal(game.command({ type: "build", kind: "tent", x, y }), false);
    assert.equal(game.money, budget);
  }
});
test("tents fit closer together while overlapping placements still preserve the budget", () => {
  const game = new Game();
  game.money = 300;
  assert.ok(game.command({ type: "build", kind: "tent", x: 400, y: 280 }));
  assert.ok(game.command({ type: "build", kind: "tent", x: 434, y: 280 }));
  const budget = game.money;
  assert.equal(
    game.command({ type: "build", kind: "tent", x: 420, y: 280 }),
    false,
  );
  assert.equal(game.money, budget);
});
test("building checks budget, occupancy and upgrades", () => {
  const g = new Game();
  assert.ok(g.command({ type: "build", kind: "tent", x: 400, y: 280 }));
  assert.equal(g.money, 65);
  assert.equal(
    g.command({ type: "build", kind: "tent", x: 400, y: 280 }),
    false,
  );
  assert.ok(g.command({ type: "upgrade", id: 1 }));
  assert.equal(g.buildings[0].level, 2);
  assert.equal(g.command({ type: "upgrade", id: 1 }), false);
});
test("local duel passes control and preserves defender budget", () => {
  const g = new Game("local");
  g.command({ type: "build", kind: "tent", x: 400, y: 280 });
  g.command({ type: "ready" });
  assert.equal(g.phase, "attack");
  assert.equal(g.defenseMoney, 65);
  assert.equal(g.command({ type: "ready" }), false);
  g.command({ type: "recruit", kind: "basic", entry: 0 });
  g.command({ type: "ready" });
  assert.equal(g.phase, "combat");
  assert.equal(
    g.command({ type: "build", kind: "tent", x: 500, y: 190 }),
    false,
  );
});
test("recruitment undo refunds and invalid entries are rejected", () => {
  const g = new Game("attack");
  assert.equal(
    g.command({ type: "recruit", kind: "basic", entry: ENTRIES.length }),
    false,
  );
  g.command({ type: "recruit", kind: "heavy", entry: 2 });
  assert.equal(g.money, 87);
  g.command({ type: "undo" });
  assert.equal(g.money, 125);
});
test("full programmed defense simulation terminates", () => {
  const g = new Game();
  for (let i = 0; i < 8 && !g.result; i++) {
    g.command({ type: "ready" });
    for (let t = 0; t < 20000 && g.phase === "combat" && !g.result; t++)
      g.tick(0.05);
  }
  assert.ok(g.result);
  assert.ok(g.base.hp >= 0);
});
