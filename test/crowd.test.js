import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { followRoute } from "../src/movement.js";
test("attackers can overlap without waiting for another attacker", () => {
  const a = {
    x: 0,
    y: 0,
    kind: "basic",
    route: [{ x: 200, y: 0 }],
    routeIndex: 0,
  };
  const b = {
    x: 0,
    y: 0,
    kind: "heavy",
    route: [{ x: 200, y: 0 }],
    routeIndex: 0,
  };
  followRoute(a, 20);
  followRoute(b, 20);
  assert.equal(a.x, b.x);
  assert.equal(a.waiting, false);
});
test("overlapping attackers strike the central base together", () => {
  const game = new Game();
  game.phase = "combat";
  game.pending = [{ kind: "basic", entry: 0, at: 1000 }];
  game.units = Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    character: "viral",
    kind: "basic",
    x: 500,
    y: 340,
    hp: 1000,
    maxHp: 1000,
    damage: 9,
    speed: 44,
    cooldown: 0,
    slow: 0,
    route: [],
    routeIndex: 0,
  }));
  game.tick(0.01);
  assert.equal(game.base.hp, 523);
  assert.ok(game.units.every((unit) => unit.cooldown === 1));
});
