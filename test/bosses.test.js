import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { BOSS_IDS, BOSSES, BOSS_ROUNDS } from "../src/data/bosses.js";
import { CHARACTERS } from "../src/data/characters.js";

test("ordinary round one stays normal and a boss test affects only its current wave", () => {
  const normal = new Game();
  normal.command({ type: "ready" });
  assert.equal(normal.waveIsBoss, false);
  assert.ok(normal.pending.every((unit) => !BOSSES[unit.kind]));
  const game = new Game();
  const money = game.money;
  assert.ok(game.command({ type: "test-boss" }));
  assert.equal(game.money, money);
  assert.equal(game.command({ type: "test-boss" }), false);
  game.pending = [];
  game.units = [];
  game.tick(0.05);
  assert.equal(game.round, 2);
  assert.equal(game.phase, "build");
  game.command({ type: "ready" });
  assert.equal(game.waveIsBoss, false);
  assert.equal(new Game("attack").command({ type: "test-boss" }), false);
  assert.equal(new Game("local").command({ type: "test-boss" }), false);
});
test("test round one schedules all bosses and spawns the correct scaled character", () => {
  assert.equal(BOSS_ROUNDS.includes(1), false);
  const game = new Game();
  game.command({ type: "test-boss" });
  assert.deepEqual(
    game.pending.map((unit) => unit.kind),
    BOSS_IDS,
  );
  game.tick(0.01);
  const boss = game.units[0];
  assert.equal(boss.character, "bossDani");
  assert.equal(boss.hp, BOSSES.bossDani.hp);
  assert.ok(boss.scale > 1);
  for (const id of BOSS_IDS) assert.ok(CHARACTERS[id]);
});
test("boss recruitment respects budgets and death preserves its visual role and scale", () => {
  const game = new Game("attack");
  assert.equal(
    game.command({ type: "recruit", kind: "bossDani", entry: 0 }),
    false,
  );
  game.money = BOSSES.bossDani.cost;
  assert.ok(game.command({ type: "recruit", kind: "bossDani", entry: 0 }));
  assert.equal(game.money, 0);
  assert.ok(game.command({ type: "undo" }));
  assert.equal(game.money, BOSSES.bossDani.cost);
  assert.ok(game.command({ type: "recruit", kind: "bossDani", entry: 0 }));
  assert.equal(
    game.command({ type: "recruit", kind: "bossDani", entry: 0 }),
    false,
  );
  game.command({ type: "ready" });
  game.tick(0.01);
  const boss = game.units[0];
  boss.hp = 0;
  game.tick(0.05);
  assert.equal(game.deaths[0].scale, BOSSES.bossDani.scale);
  assert.equal(game.deaths[0].role, "heavy");
});
