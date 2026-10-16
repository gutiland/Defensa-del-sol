import { test } from "node:test";
import assert from "node:assert/strict";
import { renderStory } from "../src/ui/story.js";
import { Game } from "../src/engine.js";
function element() {
  return {
    children: [],
    setAttribute() {},
    append(...items) {
      this.children.push(...items);
    },
    replaceChildren() {
      this.children = [];
    },
  };
}
test("story archive unlocks chapters through progress, preserves controls and resets with a new match", () => {
  const root = element(),
    doc = { getElementById: () => root, createElement: element },
    game = new Game();
  renderStory(game, doc);
  const archive = root.children[0],
    select = archive.children[1];
  assert.equal(select.children.length, 1);
  assert.equal(archive.open, true);
  archive.open = true;
  renderStory(game, doc);
  assert.equal(root.children[0], archive);
  assert.equal(archive.open, true);
  game.round = 6;
  game.defendedWaves = 5;
  renderStory(game, doc);
  const unlocked = root.children[0].children[1];
  assert.equal(unlocked.children.length, 6);
  assert.equal(root.children[0].open, true);
  root.children[0].open = false;
  renderStory(game, doc);
  assert.equal(root.children[0].open, false);
  game.phase = "combat";
  root.children[0].open = true;
  renderStory(game, doc);
  assert.equal(root.children[0].open, true);
  assert.equal(root.children[0].children[1].children.length, 6);
  assert.equal(root.children[0].children[1].value, "5");
  const activeTitle = root.children[0].children[2].children[0].textContent;
  const activeSelect = root.children[0].children[1];
  activeSelect.value = "0";
  activeSelect.onchange();
  assert.notEqual(
    root.children[0].children[2].children[0].textContent,
    activeTitle,
  );
  renderStory(new Game(), doc);
  assert.equal(root.children[0].children[1].children.length, 1);
  renderStory(new Game("attack"), doc);
  assert.equal(root.hidden, true);
  game.sandbox = true;
  renderStory(game, doc);
  assert.equal(root.hidden, true);
});

test("event chapter is selected in preparation and combat, while finished reports remain available in the archive", () => {
  const root = element(),
    doc = { getElementById: () => root, createElement: element };
  for (const round of [9, 17]) {
    const game = new Game();
    game.round = round;
    game.defendedWaves = round - 1;
    renderStory(game, doc);
    assert.equal(root.children[0].children[1].children.length, round);
    assert.equal(root.children[0].open, true);
    assert.ok(game.command({ type: "ready" }));
    renderStory(game, doc);
    const archive = root.children[0],
      card = archive.children[2];
    assert.equal(archive.children[1].value, String(round - 1));
    assert.equal(archive.children[1].children.length, round);
    assert.ok(archive.children[0].textContent.endsWith(`Ronda ${round}`));
    assert.ok(
      card.children.some((node) => node.textContent?.startsWith("Evento:")),
    );
    game.units = [];
    game.pending = [];
    game.tick(0.01);
    renderStory(game, doc);
    const finished = root.children[0];
    assert.equal(finished.children[1].children.length, round + 1);
    assert.equal(finished.children[1].value, String(round));
    finished.children[1].value = String(round - 1);
    finished.children[1].onchange();
    assert.ok(
      finished.children[2].children.some(
        (node) => node.className === "round-recap",
      ),
    );
    assert.equal(finished.open, true);
  }
});

test("a fresh match immediately opens diary one, and entering combat keeps the correct day", () => {
  const root = element(),
    doc = { getElementById: () => root, createElement: element },
    game = new Game();
  renderStory(game, doc);
  const first = root.children[0];
  assert.equal(first.open, true);
  assert.equal(first.children[1].value, "0");
  assert.ok(first.children[0].textContent.endsWith("Ronda 1"));
  first.open = false;
  renderStory(game, doc);
  assert.equal(root.children[0].open, false);
  game.command({ type: "ready" });
  renderStory(game, doc);
  assert.equal(root.children[0].open, true);
  assert.ok(
    root.children[0].children[2].children[0].textContent.startsWith("1."),
  );
  game.pending = [];
  game.units = [];
  game.tick(0.01);
  renderStory(game, doc);
  assert.equal(root.children[0].open, true);
  assert.equal(root.children[0].children[1].value, "1");
  assert.ok(root.children[0].children[0].textContent.endsWith("Ronda 2"));
});
