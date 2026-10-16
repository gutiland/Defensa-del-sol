import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { tryDialogue } from "../src/dialogue.js";
import { CHARACTERS } from "../src/data/characters.js";
test("boss speech uses fictional dialogue without attributing it to a real speaker", () => {
  for (const id of ["bossDani", "bossPedro", "bossSanti"]) {
    const game = new Game();
    assert.ok(tryDialogue(game, id, { x: 500, y: 340 }));
    const speech = game.speeches[0];
    assert.equal(speech.quote, undefined);
    assert.ok(CHARACTERS[id].lines.includes(speech.text));
  }
});

test("battle dialogue is occasional, rate limited and alternates sides", () => {
  const game = new Game();
  const source = { x: 500, y: 340 };
  assert.ok(tryDialogue(game, "micro", source));
  const first = game.speeches[0];
  assert.ok(CHARACTERS.micro.lines.includes(first.text));
  assert.equal(tryDialogue(game, "assembly", source), false);
  assert.equal(game.speeches[0], first);
  game.time = 6;
  for (let i = 0; i < 8; i++)
    assert.equal(tryDialogue(game, "viral", source), false);
  let replied = false;
  for (let i = 0; i < 3; i++)
    replied = tryDialogue(game, "assembly", source) || replied;
  assert.ok(replied);
  assert.equal(game.speeches.length, 1);
  assert.equal(game.lastSpeechSide, "defense");
});

test("speech expires and a new round clears old dialogue", () => {
  const game = new Game("attack");
  game.command({ type: "recruit", kind: "basic", entry: 0 });
  game.command({ type: "ready" });
  tryDialogue(game, "micro", { x: 300, y: 300 });
  game.time = 5;
  game.tick(0.01);
  assert.equal(game.speeches.length, 0);
  game.phase = "attack";
  game.command({ type: "recruit", kind: "basic", entry: 0 });
  game.speeches = [{ until: 100 }];
  game.command({ type: "ready" });
  assert.equal(game.speeches.length, 0);
  assert.equal(game.nextSpeechAt, 0);
});

test("round completion and defeat immediately close dialogue even before its timer expires", () => {
  for (const mode of ["defense", "attack", "local"]) {
    for (const ending of ["next-round", "victory", "defeat"]) {
      const game = new Game(mode);
      game.phase = "combat";
      game.defenseMoney = 110;
      game.round = ending === "victory" ? (mode === "defense" ? 20 : 8) : 1;
      if (ending === "defeat") game.base.hp = 0;
      game.speeches = [
        {
          text: "Todavía hablando",
          until: 100,
          quote: { source: "https://example.com" },
        },
      ];
      game.tick(0.01);
      assert.equal(game.speeches.length, 0, `${mode}: ${ending}`);
      game.tick(0.01);
      assert.equal(game.speeches.length, 0);
    }
  }
});
