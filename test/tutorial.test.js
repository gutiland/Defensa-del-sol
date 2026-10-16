import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { Playback } from "../src/playback.js";
import { tutorialStep } from "../src/data/tutorial.js";
import { createTutorial } from "../src/ui/tutorial.js";

test("modal lessons follow actions once per topic without modifying game rules", () => {
  const game = new Game(),
    seen = new Set();
  assert.equal(tutorialStep(game).id, "defenses");
  seen.add("defenses");
  assert.equal(tutorialStep(game, {}, seen), null);
  for (const kind of [
    "tent",
    "area",
    "speaker",
    "odor",
    "kitchen",
    "barrier",
  ]) {
    const lesson = tutorialStep(game, { placing: true, kind }, seen);
    assert.equal(lesson.id, `place-${kind}`);
    assert.equal(lesson.target, "#board");
  }
  assert.ok(game.command({ type: "build", kind: "tent", x: 400, y: 280 }));
  assert.equal(tutorialStep(game, {}, seen).id, "start");
  assert.equal(tutorialStep(game, { selected: 1 }, seen).id, "upgrade");
  for (const [round, id] of [
    [2, "resources"],
    [3, "roles"],
    [4, "diary"],
    [5, "boss"],
  ]) {
    game.round = round;
    assert.equal(tutorialStep(game, {}, seen).id, id);
  }
  game.phase = "combat";
  game.units = [{}, {}, {}];
  assert.equal(tutorialStep(game, {}, seen).id, "ability");
  seen.add("ability");
  assert.equal(tutorialStep(game, {}, seen).id, "combat");
  assert.equal(game.money, 95);
  game.round = 6;
  assert.equal(tutorialStep(game), null);
  game.round = 1;
  game.sandbox = true;
  assert.equal(tutorialStep(game), null);
  assert.equal(tutorialStep(new Game("local")), null);
});

test("closing a tutorial restores pause, avoids repeats and waits for other modals", () => {
  const element = () => ({
    children: [],
    style: {},
    append(...items) {
      this.children.push(...items);
    },
    setAttribute() {},
    getBoundingClientRect: () => ({
      left: 10,
      top: 20,
      width: 120,
      height: 80,
    }),
    showModal() {
      this.open = true;
    },
    close() {
      this.open = false;
    },
  });
  const host = element(),
    target = element(),
    playback = new Playback();
  const document = {
    getElementById: () => host,
    createElement: element,
    querySelector: () => target,
  };
  let blocked = true;
  const tutorial = createTutorial(document, playback, () => blocked),
    game = new Game();
  tutorial.render(game);
  assert.equal(tutorial.isOpen, false);
  blocked = false;
  tutorial.render(game);
  const dialog = host.children[0],
    card = dialog.children[2];
  assert.equal(tutorial.isOpen, true);
  assert.equal(playback.paused, true);
  assert.equal(dialog.open, true);
  assert.equal(dialog.children[0].hidden, false);
  card.children[2].onclick();
  assert.equal(playback.paused, false);
  assert.equal(dialog.open, false);
  tutorial.render(game);
  assert.equal(tutorial.isOpen, false);
  playback.paused = true;
  tutorial.render(game, { placing: true, kind: "tent" });
  assert.equal(tutorial.isOpen, true);
  card.children[2].onclick();
  assert.equal(playback.paused, true);
  tutorial.render(game, { placing: true, kind: "area" });
  card.children[3].onclick();
  tutorial.render(game, { placing: true, kind: "odor" });
  assert.equal(tutorial.isOpen, false);
  tutorial.render(new Game());
  assert.equal(tutorial.isOpen, true);
  tutorial.cancel();
  assert.equal(tutorial.isOpen, false);
});
