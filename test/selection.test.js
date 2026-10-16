import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { renderSelection, refreshSelectionStats } from "../src/ui/selection.js";

test("selected construction health updates without recreating controls, and destroyed controls disappear", () => {
  const panel = {
    children: [],
    setAttribute() {},
    replaceChildren() {
      this.children = [];
    },
    append(node) {
      this.children.push(node);
    },
  };
  const previous = globalThis.document;
  globalThis.document = {
    getElementById: () => panel,
    createElement: () => ({
      dataset: {},
      children: [],
      setAttribute() {},
      append(...nodes) {
        this.children.push(...nodes);
      },
    }),
  };
  try {
    const game = new Game();
    game.command({ type: "build", kind: "tent", x: 400, y: 280 });
    renderSelection({ game, selected: 1 }, () => true);
    const nodes = [...panel.children],
      title = nodes[1];
    game.buildings[0].hp = 50;
    refreshSelectionStats(game);
    assert.ok(title.textContent.includes("50/132"));
    assert.deepEqual(panel.children, nodes);
    game.buildings = [];
    refreshSelectionStats(game);
    assert.equal(panel.children.length, 0);
    assert.ok(panel.textContent.includes("destruida"));
  } finally {
    if (previous === undefined) delete globalThis.document;
    else globalThis.document = previous;
  }
});
