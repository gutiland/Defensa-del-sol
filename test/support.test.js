import { test } from "node:test";
import assert from "node:assert/strict";
import { mountSupport, supportUrl } from "../src/ui/support.js";
import { showResult } from "../src/ui/result.js";
import { SUPPORT } from "../src/data/support.js";
import { Game } from "../src/engine.js";

test("support stays disabled without a destination and activates only for HTTPS payment links", () => {
  const element = () => ({
    children: [],
    attributes: {},
    setAttribute(k, v) {
      this.attributes[k] = v;
    },
    replaceChildren() {
      this.children = [];
    },
    append(...items) {
      this.children.push(...items);
    },
  });
  const nodes = new Map(
    ["intro-support", "result-support"].map((id) => [id, element()]),
  );
  const document = {
    getElementById: (id) => nodes.get(id),
    createElement: element,
  };
  mountSupport(document, { url: "", label: "Soutien" });
  for (const root of nodes.values()) {
    assert.equal(root.children[0].disabled, true);
    assert.equal(root.children[0].href, undefined);
  }
  const url = "https://buy.stripe.com/example";
  mountSupport(document, { url, label: "Apoyar" });
  for (const root of nodes.values()) {
    assert.equal(root.children.length, 2);
    assert.equal(root.children[0].href, url);
    assert.equal(root.children[0].target, "_blank");
    assert.equal(root.children[0].rel, "noopener noreferrer");
  }
  mountSupport(document, { url: "javascript:alert(1)", label: "Apoyar" });
  for (const root of nodes.values())
    assert.equal(root.children[0].disabled, true);
  for (const invalid of [
    "",
    "/checkout",
    "http://example.com",
    "https://secret@example.com",
    "data:text/html,test",
    "https://buy.stripe.com.evil.example/pay",
    "https://example.com/pay",
    "https://buy.stripe.com:8443/pay",
    "https://buy.stripe.com/pay?redirect=https://example.com",
  ])
    assert.equal(supportUrl(invalid), null);
});

test("losing and finishing the campaign both mount an active support link when results open", () => {
  const previousDocument = globalThis.document;
  let opened = 0;
  const element = () => ({
    children: [],
    setAttribute() {},
    showModal() {
      opened++;
    },
    replaceChildren() {
      this.children = [];
    },
    append(...items) {
      this.children.push(...items);
    },
  });
  const nodes = new Map();
  globalThis.document = {
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, element());
      return nodes.get(id);
    },
    createElement: element,
  };
  try {
    for (const [mode, result, round] of [
      ["defense", "loss", 3],
      ["defense", "defense", 20],
      ["attack", "loss", 8],
    ]) {
      const game = new Game(mode);
      game.result = result;
      game.round = round;
      document.getElementById("result-support").replaceChildren();
      showResult(game);
      const link = nodes.get("result-support").children[0];
      assert.equal(link.href, SUPPORT.url);
      assert.equal(link.textContent, SUPPORT.label);
      assert.notEqual(link.disabled, true);
      assert.equal(link.target, "_blank");
    }
    assert.equal(opened, 3);
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});
