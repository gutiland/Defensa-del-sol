import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { Playback } from "../src/playback.js";
import { createStoryScenes } from "../src/ui/story-scenes.js";
import { STORY_REFERENCES } from "../src/data/story-references.js";
import { EVENT_PREVIEWS } from "../src/event-preview.js";

function setup() {
  const element = () => ({
    children: [],
    setAttribute() {},
    showModal() {},
    close() {},
    replaceChildren() {
      this.children = [];
    },
    append(...items) {
      this.children.push(...items);
    },
  });
  const nodes = new Map();
  const document = {
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, element());
      return nodes.get(id);
    },
    createElement: element,
  };
  const playback = new Playback();
  let game = new Game();
  const scenes = createStoryScenes(
    document,
    playback,
    () => game,
    () => {},
  );
  return {
    nodes,
    playback,
    scenes,
    get game() {
      return game;
    },
    setGame(value) {
      game = value;
    },
  };
}
test("every preview exposes its news link throughout the scene without adding decision buttons", () => {
  const s = setup();
  for (const { round } of EVENT_PREVIEWS) {
    const game = new Game();
    game.round = round;
    s.setGame(game);
    assert.equal(
      s.scenes.beforeReady(game, () => {}),
      true,
    );
    const root = s.nodes.get("scene-reference");
    assert.equal(root.hidden, false);
    assert.equal(root.children.length, 1);
    const link = root.children[0];
    assert.equal(link.href, STORY_REFERENCES[round].source);
    assert.equal(new URL(link.href).protocol, "https:");
    assert.equal(link.rel, "noopener noreferrer");
    s.nodes.get("scene-next").onclick();
    assert.equal(root.children[0].href, link.href);
    s.scenes.cancel();
  }
});
test("boss scene pauses before combat, exchanges dialogue and starts the wave exactly once", () => {
  const s = setup();
  s.game.round = 5;
  let resumed = 0;
  const start = () => {
    resumed++;
    s.game.command({ type: "ready" });
  };
  assert.equal(s.scenes.beforeReady(s.game, start), true);
  assert.equal(s.playback.paused, true);
  assert.equal(s.game.phase, "build");
  assert.ok(s.nodes.get("scene-line").textContent.includes("desocupación"));
  s.nodes.get("scene-next").onclick();
  assert.ok(s.nodes.get("scene-line").textContent.includes("asamblea"));
  assert.equal(resumed, 0);
  s.nodes.get("scene-next").onclick();
  assert.equal(resumed, 1);
  assert.equal(s.game.phase, "combat");
  assert.equal(s.playback.paused, false);
  s.nodes.get("scene-skip").onclick();
  assert.equal(resumed, 1);
});
test("story event choices explain their price and apply once before the wave begins", () => {
  const s = setup();
  s.game.round = 9;
  let resumed = 0;
  s.scenes.beforeReady(s.game, () => {
    resumed++;
    s.game.command({ type: "ready" });
  });
  s.nodes.get("scene-next").onclick();
  assert.equal(s.nodes.get("scene-next").hidden, true);
  const choices = s.nodes.get("scene-choices");
  assert.equal(choices.children.length, 2);
  const before = s.game.money;
  choices.children[1].children[0].onclick();
  assert.equal(resumed, 1);
  assert.equal(s.game.money, before - 20);
  assert.equal(s.game.phase, "combat");
  assert.equal(s.game.storyEvent.id, "rain");
  assert.equal(s.game.storyEvent.intervalMultiplier, 1);
});
test("skip and Escape restore pause; reset cancels callbacks and scenes exclude other modes and sandbox", () => {
  const s = setup();
  s.game.round = 20;
  s.playback.paused = true;
  let resumed = 0;
  s.scenes.beforeReady(s.game, () => resumed++);
  s.nodes.get("story-scene").oncancel({ preventDefault() {} });
  assert.equal(resumed, 1);
  assert.equal(s.playback.paused, true);
  assert.equal(
    s.scenes.beforeReady(s.game, () => resumed++),
    false,
  );
  const next = new Game();
  next.round = 12;
  s.setGame(next);
  s.scenes.beforeReady(next, () => resumed++);
  s.scenes.cancel();
  assert.equal(resumed, 1);
  assert.equal(s.scenes.isOpen, false);
  for (const game of [
    new Game("attack"),
    Object.assign(new Game(), { sandbox: true }),
    new Game(),
  ]) {
    s.setGame(game);
    assert.equal(
      s.scenes.beforeReady(game, () => resumed++),
      false,
    );
  }
});

test("a restored paid story choice is not presented or charged again", () => {
  const s = setup();
  s.game.round = 4;
  s.game.storyChoices[4] = "mediate";
  assert.equal(
    s.scenes.beforeReady(s.game, () => {}),
    false,
  );
  const money = s.game.money;
  s.game.command({ type: "ready" });
  assert.equal(s.game.money, money);
});
