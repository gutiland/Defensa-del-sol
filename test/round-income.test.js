import { test } from "node:test";
import assert from "node:assert/strict";
import { Game, building } from "../src/engine.js";
import { createIncomeState } from "../src/render/round-income.js";

test("meal celebration announces actual round and kitchen income once and expires during preparation", () => {
  const game = new Game(),
    animate = createIncomeState();
  const kitchen = building("kitchen", 400, 300, 1);
  kitchen.level = 2;
  kitchen.branch = "rapid";
  game.buildings.push(kitchen);
  game.phase = "combat";
  animate(game, 0);
  const before = game.money;
  game.tick(0.01);
  const event = game.effects.find((effect) => effect.type === "round-income");
  assert.equal(game.money - before, 90);
  assert.equal(event.amount, game.money - before);
  assert.equal(event.kitchenAmount, 45);
  assert.equal(event.buildingId, kitchen.id);
  const state = animate(game, 0);
  assert.equal(state.speech.character, "hummus");
  const money = game.money;
  assert.equal(animate(game, 2).event, event);
  assert.equal(animate(game, 2), null);
  assert.equal(animate(game, 1), null);
  assert.equal(game.money, money);
  const restored = createIncomeState();
  assert.equal(restored(game, 0), null);
});

test("income animation cancels on combat and defeat or final victory never award extra provisions", () => {
  const game = new Game(),
    animate = createIncomeState();
  animate(game, 0);
  game.phase = "combat";
  game.tick(0.01);
  assert.ok(animate(game, 0));
  game.command({ type: "ready" });
  assert.equal(animate(game, 0), null);
  for (const hp of [0, 660]) {
    const end = new Game();
    end.round = 20;
    end.phase = "combat";
    end.base.hp = hp;
    const money = end.money;
    end.tick(0.01);
    assert.equal(end.money, money);
    assert.equal(
      end.effects.some((effect) => effect.type === "round-income"),
      false,
    );
  }
});
