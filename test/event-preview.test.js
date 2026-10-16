import { test } from "node:test";
import assert from "node:assert/strict";
import { EventPreviewGame, EVENT_PREVIEWS } from "../src/event-preview.js";
import { placementError } from "../src/placement.js";

test("preview exposes every event and boss with a prepared legal camp and no campaign requirements", () => {
  assert.deepEqual(
    EVENT_PREVIEWS.map((item) => item.round),
    [4, 5, 9, 12, 15, 20],
  );
  for (const item of EVENT_PREVIEWS) {
    const game = new EventPreviewGame(item.round);
    assert.equal(game.money, Infinity);
    assert.equal(game.base.invulnerable, true);
    assert.ok(game.buildings.some((b) => b.type === "tent"));
    assert.ok(game.buildings.some((b) => b.type === "speaker"));
    for (const b of game.buildings)
      assert.equal(
        placementError(
          { ...game, buildings: game.buildings.filter((other) => other !== b) },
          b.x,
          b.y,
          b.type,
        ),
        null,
      );
    assert.ok(game.command({ type: "ready" }));
    assert.equal(game.waveIsBoss, [5, 12, 20].includes(item.round));
    game.units = [];
    game.pending = [];
    game.tick(0.05);
    assert.equal(game.round, item.round);
    assert.equal(game.phase, "combat");
    assert.equal(game.result, null);
  }
  assert.throws(() => new EventPreviewGame(0), RangeError);
});
test("event preview applies real decisions and continuous weather while replay creates a clean test", () => {
  const rain = new EventPreviewGame(9);
  rain.command({ type: "story-choice", option: "cover" });
  rain.command({ type: "ready" });
  assert.equal(rain.storyEvent.id, "rain");
  assert.equal(rain.storyEvent.intervalMultiplier, 1);
  let sawSlip = false;
  for (let i = 0; i < 1200; i++) {
    rain.tick(1 / 60);
    sawSlip ||= rain.units.some((u) => u.slipUsed);
  }
  assert.ok(sawSlip);
  const repeat = new EventPreviewGame(9);
  assert.equal(repeat.time, 0);
  assert.deepEqual(repeat.storyChoices, {});
  repeat.command({ type: "ready" });
  assert.equal(repeat.storyEvent.intervalMultiplier, 1.25);
});
