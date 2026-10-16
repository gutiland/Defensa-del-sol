import { test } from "node:test";
import assert from "node:assert/strict";
import { projectY, unprojectY } from "../src/data/map.js";
import { SLOTS, ENTRIES } from "../src/data/catalog.js";

test("projected building positions map back to the same clickable parcel", () => {
  for (const slot of SLOTS)
    assert.ok(Math.abs(unprojectY(projectY(slot.y)) - slot.y) < 1e-9);
});

test("controller connects modes, construction, recruitment and the frame renderer", async () => {
  const ctx = new Proxy(
    {},
    {
      get: (_, key) =>
        key === "measureText"
          ? (text) => ({ width: text.length * 6 })
          : key === "createLinearGradient" || key === "createRadialGradient"
            ? () => ({ addColorStop() {} })
            : () => {},
      set: () => true,
    },
  );
  const element = () => ({
    textContent: "",
    children: [],
    dataset: {},
    style: {},
    classList: { toggle() {} },
    replaceChildren() {
      this.children = [];
    },
    append(...items) {
      this.children.push(...items);
    },
    getContext: () => ctx,
    getBoundingClientRect: () => ({
      left: 0,
      top: 0,
      width: 1000,
      height: 680,
    }),
    setAttribute() {},
    close() {},
    showModal() {},
  });
  const ids = new Map();
  const modes = ["defense", "attack", "local"].map((mode) => ({
    ...element(),
    dataset: { mode },
  }));
  globalThis.document = {
    getElementById: (id) => {
      if (!ids.has(id)) ids.set(id, element());
      return ids.get(id);
    },
    createElement: element,
    querySelector: () => null,
    querySelectorAll: (selector) => (selector === "[data-mode]" ? modes : []),
  };
  let frame;
  globalThis.requestAnimationFrame = (callback) => {
    frame = callback;
  };
  try {
    await import("../src/main.js");
    modes[0].onclick();
    // Dismiss the real modal tutorial before exercising the ordinary controls.
    ids
      .get("game")
      .children.find((node) => node.className === "tutorial-modal")
      .children[2].children[3].onclick();
    ids
      .get("board")
      .onclick({ clientX: SLOTS[0].x, clientY: projectY(SLOTS[0].y) });
    assert.equal(
      ids.get("money").textContent,
      140,
      "starting with no selected tool must not place a tent",
    );
    assert.equal(ids.get("cancel-build").disabled, true);
    const idleButton = ids.get("shop").children[0];
    let now = performance.now();
    for (let i = 0; i < 12; i++) frame((now += 50));
    assert.equal(
      ids.get("shop").children[0],
      idleButton,
      "idle frames preserve hovered buttons",
    );
    ids
      .get("shop")
      .children.find((button) => Number(button.dataset.cost) === 45)
      .onclick();
    assert.equal(
      ids.get("shop").children[0],
      idleButton,
      "selection keeps card nodes alive for the flip transition",
    );
    ids
      .get("board")
      .onclick({ clientX: SLOTS[0].x, clientY: projectY(SLOTS[0].y) });
    assert.equal(ids.get("money").textContent, 95);
    ids.get("selection").children[0].onclick();
    assert.equal(ids.get("selection").hidden, true);
    assert.equal(
      ids.get("cancel-build").disabled,
      true,
      "closing upgrades clears the construction selection",
    );
    for (let i = 0; i < 6; i++) frame((now += 50));
    assert.equal(
      ids.get("selection").hidden,
      true,
      "live refresh does not reopen closed upgrades",
    );
    ids.get("board").onclick({ clientX: 680, clientY: projectY(320) });
    assert.equal(
      ids.get("money").textContent,
      95,
      "inspecting after placement must not accidentally buy another tent",
    );
    ids.get("board").oncontextmenu({ preventDefault() {} });
    assert.equal(ids.get("money").textContent, 95);
    ids.get("action").onclick();
    frame(performance.now() + 20);
    assert.equal(ids.get("action").disabled, true);
    const combatButton = ids.get("shop").children[0];
    for (let i = 0; i < 12; i++) frame((now += 50));
    assert.equal(
      ids.get("shop").children[0],
      combatButton,
      "combat counters preserve button nodes",
    );
    ids.get("restart").onclick();
    modes[1].onclick();
    ids.get("shop").children[0].onclick();
    assert.equal(ids.get("money").textContent, 135);
    assert.equal(ids.get("action").disabled, false);
    ids.get("routes").children[2].onclick();
    assert.equal(ids.get("routes").children.length, ENTRIES.length);
    ids.get("shop").children[0].onclick();
    const summary = ids.get("queue").children[0].textContent;
    assert.ok(summary.includes(ENTRIES[0].name + ": 1"));
    assert.ok(summary.includes(ENTRIES[2].name + ": 1"));
    ids.get("routes").children[0].onclick();
    ids.get("routes").children[2].onclick();
    assert.equal(
      ids.get("shop").children[0].disabled,
      true,
      "no recruitment without a selected street",
    );
    assert.equal(
      ids.get("action").disabled,
      false,
      "already queued mixed attack remains launchable",
    );
    document.body = { dataset: { page: "admin" } };
    await import("../src/main.js?admin-test");
    assert.equal(ids.get("intro").hidden, true);
    assert.equal(ids.get("game").hidden, false);
    assert.equal(ids.get("money").textContent, "∞");
    document.getElementById("admin-kind").value = "fast";
    document.getElementById("admin-entry").value = "2";
    document.getElementById("admin-count").value = "3";
    ids.get("admin-spawn").onclick();
    for (let i = 0; i < 12; i++) frame((now += 50));
    assert.equal(ids.get("money").textContent, "∞");
    assert.equal(ids.get("admin-panel").hidden, false);
    ids.get("admin-stop").onclick();
    assert.equal(ids.get("action").disabled, false);
  } finally {
    delete globalThis.document;
    delete globalThis.requestAnimationFrame;
  }
});
