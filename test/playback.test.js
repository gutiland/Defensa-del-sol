import { test } from "node:test";
import assert from "node:assert/strict";
import { Playback } from "../src/playback.js";
import { Game } from "../src/engine.js";

function battle() {
  const game = new Game("attack");
  game.command({ type: "recruit", kind: "heavy", entry: 0 });
  game.command({ type: "ready" });
  return game;
}
test("pause freezes combat and resume does not accumulate paused time", () => {
  const playback = new Playback(),
    game = battle();
  playback.advance(0.05, game);
  const time = game.time,
    position = game.units[0].y;
  playback.toggle();
  for (let i = 0; i < 30; i++) playback.advance(0.1, game);
  assert.equal(game.time, time);
  assert.equal(game.units[0].y, position);
  playback.toggle();
  playback.advance(0.05, game);
  assert.ok(Math.abs(game.time - time - 0.05) < 1e-9);
});
test("speed changes playback duration but preserves identical fixed combat steps", () => {
  const normal = new Playback(),
    fast = new Playback(),
    a = battle(),
    b = battle();
  fast.cycleSpeed();
  fast.cycleSpeed();
  for (let i = 0; i < 180; i++) normal.advance(0.05, a);
  for (let i = 0; i < 60; i++) fast.advance(0.05, b);
  assert.deepEqual(a, b);
  assert.equal(fast.cycleSpeed(), 1);
});
test("new phases and reset cannot carry over accumulated combat time", () => {
  const playback = new Playback(),
    game = new Game();
  playback.advance(100, game);
  assert.equal(game.time, 0);
  playback.toggle();
  playback.cycleSpeed();
  playback.reset();
  assert.equal(playback.paused, false);
  assert.equal(playback.speed, 1);
  assert.equal(playback.accumulator, 0);
});
