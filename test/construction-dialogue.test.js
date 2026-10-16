import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { CHARACTERS, buildingDefender } from "../src/data/characters.js";
import { createSpeechLifetime } from "../src/render/speech-lifetime.js";

test("a successful occupied shelter greets immediately regardless of combat dialogue cooldown", () => {
  const game = new Game();
  game.nextSpeechAt = 999;
  assert.ok(game.command({ type: "build", kind: "tent", x: 440.5, y: 280.3 }));
  const building = game.buildings[0],
    speech = game.speeches[0];
  assert.equal(speech.character, buildingDefender(building));
  const actor = CHARACTERS[speech.character];
  assert.ok(
    speech.text === actor.entrance || actor.lines.includes(speech.text),
  );
  assert.equal(speech.buildingId, building.id);
  assert.equal(speech.construction, true);
  assert.equal(game.money, 95);
  assert.equal(
    game.command({ type: "build", kind: "tent", x: building.x, y: building.y }),
    false,
  );
  assert.equal(game.speeches[0], speech, "failed placement must not speak");
});

test("empty shelters do not speak; a later resident replaces the previous greeting", () => {
  const game = new Game();
  game.money = 1000;
  for (const [x, y] of [
    [440.5, 280.3],
    [680, 320],
    [340, 280],
  ]) {
    const before = game.speeches[0];
    if (!game.command({ type: "build", kind: "tent", x, y })) continue;
    const building = game.buildings.at(-1);
    if (building.id % 2 === 0) assert.equal(game.speeches[0], before);
    else assert.equal(game.speeches[0].buildingId, building.id);
  }
  assert.equal(game.buildings.length, 3);
  assert.equal(game.speeches.length, 1);
  assert.equal(game.speeches[0].buildingId, 3);
});

test("construction greetings expire during preparation, stop on removal and clear at combat start", () => {
  const game = new Game(),
    visible = createSpeechLifetime();
  game.command({ type: "build", kind: "tent", x: 440.5, y: 280.3 });
  assert.equal(visible(game, 10).length, 1);
  assert.equal(visible(game, 13.9).length, 1);
  assert.equal(visible(game, 14).length, 0);
  assert.equal(game.time, 0);
  const anotherView = createSpeechLifetime();
  assert.equal(anotherView(game, 0).length, 1);
  game.command({ type: "remove", id: 1 });
  assert.equal(anotherView(game, 1).length, 0);
  game.command({ type: "ready" });
  assert.equal(game.speeches.length, 0);
});
