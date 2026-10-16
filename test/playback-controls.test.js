import { test } from "node:test";
import assert from "node:assert/strict";
import { createPlaybackControls } from "../src/ui/playback.js";
import { Playback } from "../src/playback.js";

test("icon controls retain nodes and expose pause, speed and route states", () => {
  const nodes = Object.fromEntries(
    ["pause", "speed", "paths"].map((id) => [
      id,
      {
        attributes: {},
        setAttribute(key, value) {
          this.attributes[key] = value;
        },
      },
    ]),
  );
  const document = { getElementById: (id) => nodes[id] };
  const game = { phase: "combat" };
  const playback = new Playback();
  const controls = createPlaybackControls(document, playback, () => game);
  controls.render();
  const pause = nodes.pause;
  pause.onclick();
  assert.equal(playback.paused, true);
  assert.equal(pause.attributes["aria-pressed"], "true");
  assert.ok(pause.attributes["aria-label"]);
  nodes.speed.onclick();
  assert.equal(playback.speed, 2);
  assert.match(nodes.speed.attributes["aria-label"], /2/);
  nodes.paths.onclick();
  assert.equal(controls.showPaths, true);
  assert.equal(nodes.paths.attributes["aria-pressed"], "true");
  game.phase = "build";
  controls.render();
  assert.equal(nodes.pause, pause);
  assert.equal(pause.disabled, true);
  assert.equal(nodes.speed.disabled, true);
});
