import { test } from "node:test";
import assert from "node:assert/strict";
import { renderStory } from "../src/ui/story.js";
import { Game } from "../src/engine.js";

function fixture() {
  const element = (tagName) => ({
    tagName,
    children: [],
    setAttribute() {},
    append(...items) {
      this.children.push(...items);
    },
    replaceChildren() {
      this.children = [];
    },
  });
  const root = element("section");
  return { root, doc: { getElementById: () => root, createElement: element } };
}

test("diary shows the current round without a chapter picker and preserves manual minimizing", () => {
  const { root, doc } = fixture(),
    game = new Game();
  renderStory(game, doc);
  const diary = root.children[0];
  assert.equal(diary.open, true);
  assert.deepEqual(
    diary.children.map((node) => node.tagName),
    ["summary", "div"],
  );
  assert.ok(diary.children[1].children[0].textContent.startsWith("1."));
  diary.open = false;
  renderStory(game, doc);
  assert.equal(root.children[0], diary);
  assert.equal(diary.open, false);
  game.command({ type: "ready" });
  renderStory(game, doc);
  assert.equal(root.children[0].open, true);
  assert.ok(root.children[0].children[0].textContent.endsWith("Ronda 1"));
  game.units = [];
  game.pending = [];
  game.tick(0.01);
  renderStory(game, doc);
  assert.ok(root.children[0].children[0].textContent.endsWith("Ronda 2"));
  assert.ok(
    root.children[0].children[1].children[0].textContent.startsWith("2."),
  );
  renderStory(new Game(), doc);
  assert.ok(
    root.children[0].children[1].children[0].textContent.startsWith("1."),
  );
  renderStory(new Game("attack"), doc);
  assert.equal(root.hidden, true);
  game.sandbox = true;
  renderStory(game, doc);
  assert.equal(root.hidden, true);
});

test("event chapters stay aligned in preparation, combat and after advancing", () => {
  const { root, doc } = fixture();
  for (const round of [9, 17]) {
    const game = new Game();
    game.round = round;
    game.defendedWaves = round - 1;
    renderStory(game, doc);
    assert.ok(
      root.children[0].children[1].children[0].textContent.startsWith(
        `${round}.`,
      ),
    );
    assert.ok(game.command({ type: "ready" }));
    renderStory(game, doc);
    const diary = root.children[0],
      card = diary.children[1];
    assert.ok(diary.children[0].textContent.endsWith(`Ronda ${round}`));
    assert.ok(
      card.children.some((node) => node.textContent?.startsWith("Evento:")),
    );
    game.units = [];
    game.pending = [];
    game.tick(0.01);
    renderStory(game, doc);
    assert.ok(
      root.children[0].children[0].textContent.endsWith(`Ronda ${round + 1}`),
    );
    assert.equal(root.children[0].open, true);
  }
});

test("diary refreshes a report for its displayed round without adding archive controls", () => {
  const { root, doc } = fixture(),
    game = new Game();
  renderStory(game, doc);
  game.reports.push({
    round: 1,
    kills: 5,
    earned: 15,
    lostHealth: 0,
    star: "Caseta",
  });
  renderStory(game, doc);
  assert.ok(
    root.children[0].children[1].children.some(
      (node) => node.className === "round-recap",
    ),
  );
  assert.equal(root.children[0].children.length, 2);
});
