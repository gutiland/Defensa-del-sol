import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { tutorialStep } from "../src/data/tutorial.js";
import { createTutorial } from "../src/ui/tutorial.js";

test("first level guidance follows construction, upgrades, combat and later lessons without changing the game", () => {
  const game = new Game("defense");
  const money = game.money;
  assert.equal(tutorialStep(game).target, "#shop");
  assert.equal(tutorialStep(game, { placing: true }).target, "#board");
  assert.equal(
    game.command({ type: "build", kind: "tent", x: 400, y: 280 }),
    true,
  );
  assert.equal(tutorialStep(game).target, "#action");
  game.round = 2;
  assert.equal(
    tutorialStep(game, { selected: game.buildings[0].id }).target,
    "#selection",
  );
  game.buildings[0].level = 2;
  assert.equal(tutorialStep(game).target, "#action");
  game.round = 3;
  assert.equal(tutorialStep(game).target, "#shop");
  game.round = 4;
  assert.equal(tutorialStep(game).target, "#story-chapter");
  game.round = 5;
  assert.equal(tutorialStep(game).round, 5);
  game.phase = "combat";
  assert.equal(tutorialStep(game).target, "#ability");
  game.round = 1;
  game.units = [{}, {}, {}];
  assert.equal(tutorialStep(game).target, "#ability");
  assert.equal(tutorialStep(game, { usedAbility: true }).target, "#pause");
  assert.equal(game.money, money - 45);
  game.round = 6;
  assert.equal(tutorialStep(game), null);
  game.round = 1;
  game.sandbox = true;
  assert.equal(tutorialStep(game), null);
  assert.equal(tutorialStep(new Game("local")), null);
});

test("omitting guidance clears its highlight, keeps controls stable and resets for a new game", () => {
  const element = () => ({
    children: [],
    attributes: {},
    append(...items) {
      this.children.push(...items);
    },
    setAttribute(key, value) {
      this.attributes[key] = value;
    },
    removeAttribute(key) {
      delete this.attributes[key];
    },
  });
  const host = element(),
    target = element();
  const document = {
    getElementById: () => host,
    createElement: element,
    querySelector: () => target,
  };
  const guide = createTutorial(document),
    game = new Game("defense");
  guide.render(game);
  const root = host.children[0],
    nodes = [...root.children];
  guide.render(game);
  assert.deepEqual(root.children, nodes);
  assert.equal(target.attributes["data-tutorial-target"], "true");
  root.children[2].onclick();
  guide.render(game);
  assert.equal(root.hidden, true);
  assert.equal(target.attributes["data-tutorial-target"], undefined);
  guide.render(new Game("defense"));
  assert.equal(root.hidden, false);
});
