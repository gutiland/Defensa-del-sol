import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { createCelebration } from "../src/render/celebration.js";

test("defending a wave triggers a bounded celebration and the next combat cancels it", () => {
  const game = new Game(),
    celebration = createCelebration();
  assert.equal(celebration(game, 0), 0);
  game.command({ type: "ready" });
  game.pending = [];
  game.units = [];
  game.tick(0.01);
  assert.equal(game.defendedWaves, 1);
  assert.ok(celebration(game, 0.01) > 0);
  assert.ok(celebration(game, 1) > 0);
  game.command({ type: "ready" });
  assert.equal(celebration(game, 0.01), 0);
});
test("final defense celebrates but defeat never does, without changing match rules", () => {
  for (const won of [true, false]) {
    const game = new Game(),
      celebration = createCelebration();
    celebration(game, 0);
    game.round = 20;
    game.command({ type: "ready" });
    game.pending = [];
    if (!won) game.base.hp = 0;
    game.tick(0.01);
    assert.equal(game.result, won ? "defense" : "loss");
    assert.equal(game.defendedWaves, won ? 1 : 0);
    assert.equal(celebration(game, 0.01) > 0, won);
    assert.equal(celebration(game, 3), 0);
  }
});
