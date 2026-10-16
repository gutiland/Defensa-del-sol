import { test } from "node:test";
import assert from "node:assert/strict";

test("performance page runs crowd, pause and scenario reset through its real renderer", async () => {
  const oldDocument = globalThis.document,
    oldFrame = globalThis.requestAnimationFrame;
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
    value: "",
    children: [],
    getContext: () => ctx,
    append(...items) {
      this.children.push(...items);
    },
    setAttribute() {},
  });
  const nodes = new Map();
  globalThis.document = {
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, element());
      return nodes.get(id);
    },
    createElement: element,
    querySelector: () => null,
  };
  document.getElementById("stress-count").value = "100";
  document.getElementById("stress-scenario").value = "deaths";
  let frame;
  globalThis.requestAnimationFrame = (fn) => {
    frame = fn;
  };
  try {
    await import("../src/performance-main.js");
    let now = performance.now();
    for (let i = 0; i < 35; i++) frame((now += 20));
    assert.ok(nodes.get("stress-stats").textContent.includes("FPS"));
    nodes.get("stress-pause").onclick();
    assert.equal(nodes.get("stress-pause").textContent, "Reanudar");
    for (const scenario of ["rain", "fire", "march"]) {
      nodes.get("stress-scenario").value = scenario;
      nodes.get("stress-scenario").onchange();
      frame((now += 20));
      assert.equal(nodes.get("stress-pause").textContent, "Pausa");
    }
  } finally {
    if (oldDocument === undefined) delete globalThis.document;
    else globalThis.document = oldDocument;
    if (oldFrame === undefined) delete globalThis.requestAnimationFrame;
    else globalThis.requestAnimationFrame = oldFrame;
  }
});
