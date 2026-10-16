import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";

test("area radio counters basic crowds while resistant ordinary armies can beat the camp", () => {
  for (const kind of ["basic", "heavy"]) {
    const game = new Game("attack");
    let steps = 0;
    while (!game.result && steps < 90000) {
      if (game.phase === "attack") {
        while (game.command({ type: "recruit", kind, entry: 0 })) {}
        assert.ok(game.command({ type: "ready" }));
      }
      game.tick(1 / 60);
      steps++;
    }
    assert.equal(
      game.result,
      kind === "heavy" ? "attack" : "loss",
      `${kind} should retain its expected role against the growing camp`,
    );
    if (kind === "heavy") assert.equal(game.base.hp, 0);
    else assert.ok(game.base.hp > 0);
    assert.ok(game.round <= 8);
  }
});
test("upgrading the central tent alone cannot complete the defense story", () => {
  const game = new Game();
  game.money = 300;
  while (game.command({ type: "upgrade", id: "base" })) {}
  assert.equal(game.base.level, 4);
  for (let i = 0; i < 30000 && !game.result; i++) {
    if (game.phase === "build") game.command({ type: "ready" });
    game.tick(0.05);
  }
  assert.equal(game.result, "loss");
  assert.ok(game.round < 20);
});
