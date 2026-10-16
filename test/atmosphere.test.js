import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import {
  createBattleAtmosphere,
  roundIntensity,
} from "../src/render/battle-atmosphere.js";

test("round intensity increases with progress and stays bounded", () => {
  assert.equal(roundIntensity(1), 0);
  assert.equal(roundIntensity(20), 1);
  assert.equal(roundIntensity(100), 1);
  assert.equal(roundIntensity(-1), 0);
  for (let round = 2; round <= 20; round++)
    assert.ok(roundIntensity(round) > roundIntensity(round - 1));
});
test("visual chaos deduplicates events, respects pause, caps particles and clears with admin reset", () => {
  const game = new Game(),
    fx = createBattleAtmosphere();
  game.round = 8;
  const event = { type: "impact", x: 100, y: 100, tx: 100, ty: 100 };
  game.effects = [event];
  const snapshot = JSON.stringify({
    money: game.money,
    base: game.base,
    units: game.units,
  });
  fx.advance(game, 0.01);
  const initial = fx.count;
  assert.ok(initial > 0);
  fx.advance(game, 0);
  assert.equal(fx.count, initial);
  assert.equal(
    JSON.stringify({ money: game.money, base: game.base, units: game.units }),
    snapshot,
  );
  game.effects = Array.from({ length: 1000 }, () => ({ ...event }));
  fx.advance(game, 0.01);
  assert.equal(fx.count, 160);
  game.effects = [];
  fx.advance(game, 5);
  assert.equal(fx.count, 0);
  game.effects = [{ ...event }];
  fx.advance(game, 0.01);
  assert.ok(fx.count > 0);
  game.effects = [];
  game.visualRevision++;
  fx.advance(game, 0);
  assert.equal(fx.count, 0);
});
