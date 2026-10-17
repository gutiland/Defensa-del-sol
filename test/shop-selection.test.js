import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { renderShop } from "../src/ui/shop.js";
import { renderLiveStats } from "../src/ui/panel.js";

test("unaffordable defense cards remain readable while engine construction stays protected", () => {
  const ctx = new Proxy(
    {},
    {
      get: (_, key) =>
        key === "measureText"
          ? (text) => ({ width: String(text).length * 5 })
          : key === "createLinearGradient" || key === "createRadialGradient"
            ? () => ({ addColorStop() {} })
            : () => {},
      set: () => true,
    },
  );
  const element = () => ({
    children: [],
    dataset: {},
    attributes: {},
    classList: { toggle() {} },
    setAttribute(key, value) {
      this.attributes[key] = value;
    },
    replaceChildren() {
      this.children = [];
    },
    append(...items) {
      this.children.push(...items);
    },
    getContext: () => ctx,
  });
  const nodes = new Map(),
    previous = globalThis.document;
  globalThis.document = {
    createElement: element,
    querySelectorAll: () => nodes.get("shop")?.children || [],
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, element());
      return nodes.get(id);
    },
  };
  try {
    const game = new Game();
    game.money = 0;
    let selected;
    const actions = {
      command: (command) => game.command(command),
      selectKind: (kind) => {
        selected = kind;
      },
    };
    renderShop({ game, kind: null, selectedEntries: [0] }, actions);
    const area = nodes
      .get("shop")
      .children.find((button) => Number(button.dataset.cost) === 75);
    assert.equal(area.disabled, false);
    assert.equal(area.dataset.affordable, "false");
    renderLiveStats(game);
    assert.equal(
      area.disabled,
      false,
      "live counters must not disable card inspection",
    );
    area.onclick();
    assert.equal(selected, "area");
    assert.equal(
      game.command({
        type: "build",
        kind: "area",
        x: 550,
        y: (540 - 120) / 0.66,
      }),
      false,
    );
    assert.equal(game.money, 0);
    assert.equal(game.buildings.length, 0);
    game.money = 100;
    renderShop({ game, kind: "area", selectedEntries: [0] }, actions);
    assert.equal(
      nodes
        .get("shop")
        .children.find((button) => Number(button.dataset.cost) === 75),
      area,
    );
    assert.equal(area.dataset.affordable, "true");
    assert.equal(area.attributes["aria-pressed"], "true");
    game.result = "loss";
    renderShop({ game, kind: "area", selectedEntries: [0] }, actions);
    assert.equal(area.disabled, true);
  } finally {
    if (previous === undefined) delete globalThis.document;
    else globalThis.document = previous;
  }
});
