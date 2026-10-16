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
  assert.equal(archive.open, false);
  archive.open = true;
  renderStory(game, doc);
  assert.equal(root.children[0], archive);
  assert.equal(archive.open, true);
  game.round = 6;
  game.defendedWaves = 5;
  renderStory(game, doc);
  const unlocked = root.children[0].children[1];
  assert.equal(unlocked.children.length, 5);
  assert.equal(root.children[0].open, true);
  root.children[0].open = false;
  renderStory(game, doc);
  assert.equal(root.children[0].open, false);
  game.phase = "combat";
  root.children[0].open = true;
  renderStory(game, doc);
  assert.equal(root.children[0].open, false);
  const activeTitle = root.children[0].children[2].children[0].textContent;
  unlocked.value = "0";
  unlocked.onchange();
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
