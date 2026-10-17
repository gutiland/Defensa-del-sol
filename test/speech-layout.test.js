import { test } from "node:test";
import assert from "node:assert/strict";
import { drawSpeech } from "../src/render/characters.js";
import { measureSpeechViewport } from "../src/render/speech-layout.js";

function canvasRecorder() {
  const boxes = [],
    fonts = [],
    words = [];
  const ctx = new Proxy(
    {},
    {
      get: (_, key) => {
        if (key === "measureText")
          return (text) => ({ width: text.length * 6 });
        if (key === "roundRect") return (...args) => boxes.push(args);
        if (key === "fillText") return (...args) => words.push(args);
        return () => {};
      },
      set: (_, key, value) => {
        if (key === "font") fonts.push(value);
        return true;
      },
    },
  );
  return { ctx, boxes, fonts, words };
}

test("citizen dialogue remains readable and inside a narrow or wide viewport", () => {
  const speech = Object.freeze({
    character: "hummus",
    x: 990,
    y: 820,
    text: "A comer, que las provisiones no se reparten solas. El portavoz repite.",
  });
  for (const [width, height] of [
    [320, 230],
    [1440, 850],
  ]) {
    const { ctx, boxes, fonts, words } = canvasRecorder();
    drawSpeech(ctx, speech, {
      width,
      height,
      scaleX: width / 1000,
      scaleY: height / 680,
    });
    assert.equal(boxes.length, 1);
    const [x, y, w, h] = boxes[0];
    assert.ok(x >= 8 && y >= 8);
    assert.ok(x + w <= width - 8);
    assert.ok(y + h <= height - 14);
    assert.ok(fonts.includes("12px sans-serif"));
    assert.ok(words.every((entry) => entry[3] === w - 24));
  }
});

test("a dialogue near the top-left corner stays inside the board", () => {
  const { ctx, boxes } = canvasRecorder();
  drawSpeech(ctx, { character: "hummus", x: -30, y: -300, text: "A comer." });
  assert.equal(boxes[0][0], 8);
  assert.equal(boxes[0][1], 8);
});

test("long dialogue fits a short board and ends with an ellipsis", () => {
  const { ctx, boxes, words } = canvasRecorder();
  drawSpeech(
    ctx,
    {
      character: "hummus",
      x: 500,
      y: 500,
      text: "La asamblea sigue debatiendo el menú. ".repeat(20),
    },
    { width: 320, height: 160, scaleX: 0.32, scaleY: 160 / 680 },
  );
  const [x, y, width, height] = boxes[0];
  assert.ok(y + height <= 146);
  assert.ok(words.at(-1)[0].endsWith("…"));
  assert.ok(x + width <= 312);
});

test("dialogue buffers stay bounded across mobile, desktop and very large displays", () => {
  for (const [width, height, requestedDensity] of [
    [320, 230, 3],
    [390, 400, 2],
    [1366, 650, 1.25],
    [1920, 900, 2],
    [5000, 4000, 4],
  ]) {
    const viewport = measureSpeechViewport(width, height, requestedDensity);
    assert.equal(viewport.scaleX, width / 1000);
    assert.equal(viewport.scaleY, height / 680);
    assert.ok(viewport.density <= 2);
    assert.ok(viewport.pixelWidth <= 2600 && viewport.pixelHeight <= 1800);
    assert.ok(viewport.pixelWidth > 0 && viewport.pixelHeight > 0);
  }
});
