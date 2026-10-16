import { test } from "node:test";
import assert from "node:assert/strict";
import { AdminGame } from "../src/admin-game.js";
import { labBudget } from "../src/lab-budget.js";
import { UNITS } from "../src/engine.js";
import { campaignPressure } from "../src/data/campaign.js";

test("lab budget includes initial resources and only completed rounds", () => {
  assert.equal(labBudget(1), 140);
  assert.equal(labBudget(2), 212);
  assert.equal(labBudget(3), 299);
  for (let round = 2; round <= 20; round++)
    assert.ok(labBudget(round) > labBudget(round - 1));
  for (const value of [0, 21, 1.2, NaN, "7"])
    assert.throws(() => labBudget(value), RangeError);
});

test("preparing a budgeted round clears the board and lets the player build before combat", () => {
  const game = new AdminGame();
  game.command({ type: "build", kind: "tent", x: 400, y: 280 });
  game.command({ type: "admin-spawn", kind: "basic", entry: 0, count: 3 });
  const pending = game.pending;
  assert.equal(game.command({ type: "admin-prepare", round: 21 }), false);
  assert.equal(game.pending, pending);
  assert.ok(game.command({ type: "admin-prepare", round: 1 }));
  assert.equal(game.money, 140);
  assert.equal(game.phase, "build");
  assert.equal(game.buildings.length, 0);
  assert.equal(game.pending.length, 0);
  assert.equal(game.base.invulnerable, false);
  assert.ok(game.command({ type: "build", kind: "tent", x: 400, y: 280 }));
  assert.equal(game.money, 95);
  const id = game.buildings[0].id;
  game.command({ type: "upgrade", id });
  game.command({ type: "remove", id });
  assert.equal(game.money, 140);
  game.money = 44;
  assert.equal(
    game.command({ type: "build", kind: "tent", x: 400, y: 280 }),
    false,
  );
  game.command({ type: "admin-reset" });
  assert.equal(game.money, Infinity);
  assert.equal(game.campaignTest, false);
});

test("budgeted laboratory uses campaign strength and events while unlimited mode keeps base stats", () => {
  const game = new AdminGame();
  game.command({ type: "admin-prepare", round: 9 });
  const money = game.money;
  assert.ok(game.command({ type: "ready" }));
  assert.equal(game.money, money);
  assert.equal(game.storyEvent.id, "rain");
  game.tick(0.001);
  const unit = game.units[0];
  assert.equal(
    unit.maxHp,
    Math.round(UNITS[unit.kind].hp * campaignPressure(9).health),
  );
  assert.ok(game.command({ type: "admin-prepare", round: 7 }));
  assert.equal(game.money, labBudget(7));
  assert.equal(game.base.level, 1);
  assert.equal(game.result, null);
});
