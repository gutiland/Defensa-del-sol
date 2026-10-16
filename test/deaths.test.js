import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
test("defeated units leave one visual death event and stop participating immediately", () => {
  const game = new Game("attack");
  game.command({ type: "recruit", kind: "basic", entry: 0 });
  game.command({ type: "ready" });
  game.tick(0.01);
  const unit = game.units[0];
  unit.hp = 0;
  const health = game.base.hp;
  game.tick(0.05);
  assert.equal(game.units.length, 0);
  assert.equal(game.deaths.length, 1);
  assert.equal(game.deaths[0].character, unit.character);
  game.tick(0.05);
  assert.equal(game.deaths.length, 1);
  assert.equal(game.base.hp, health);
});
