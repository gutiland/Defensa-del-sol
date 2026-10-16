import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { handleShortcut } from "../src/ui/shortcuts.js";
import {
  showFeedback,
  currentFeedback,
  clearFeedback,
} from "../src/ui/feedback.js";

test("shortcuts select tools and act on phases without interfering with forms or browser shortcuts", () => {
  const game = new Game();
  let selected = null,
    cancelled = 0,
    prevented = 0;
  const actions = {
    game,
    selectKind: (kind) => {
      selected = kind;
    },
    cancel: () => cancelled++,
    command: (c) => game.command(c),
  };
  const key = (code, extra = {}) =>
    handleShortcut(
      {
        code,
        preventDefault() {
          prevented++;
        },
        ...extra,
      },
      actions,
    );
  assert.ok(key("Digit6"));
  assert.equal(selected, "barrier");
  assert.ok(key("Escape"));
  assert.equal(cancelled, 1);
  assert.equal(key("Digit1", { target: { tagName: "INPUT" } }), false);
  assert.equal(key("Enter", { target: { tagName: "SELECT" } }), false);
  assert.equal(key("Digit1", { ctrlKey: true }), false);
  assert.equal(key("Escape", { repeat: true }), false);
  assert.equal(selected, "barrier");
  assert.ok(key("Enter"));
  assert.equal(game.phase, "combat");
  assert.ok(key("KeyQ"));
  assert.equal(game.freezeUntil, 3);
  assert.equal(prevented, 4);
});

test("placement feedback survives live updates, expires and belongs to its match", () => {
  const game = new Game(),
    other = new Game();
  showFeedback(game, "Camino reservado", 100);
  assert.equal(currentFeedback(game, 1000), "Camino reservado");
  assert.equal(currentFeedback(other, 1000), null);
  assert.equal(currentFeedback(game, 3700), null);
  showFeedback(game, "Sin presupuesto", 4000);
  clearFeedback(other);
  assert.equal(currentFeedback(game, 4100), "Sin presupuesto");
  clearFeedback(game);
  assert.equal(currentFeedback(game, 4100), null);
});
