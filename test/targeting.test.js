import { test } from "node:test";
import assert from "node:assert/strict";
import { remainingPathDistance, priorityTarget } from "../src/targeting.js";
import { Game } from "../src/engine.js";
test("targeting compares remaining path rather than straight-line proximity or spawn order", () => {
  const base = { x: 0, y: 0 };
  const loop = {
    id: 1,
    hp: 100,
    x: 5,
    y: 0,
    route: [
      { x: 500, y: 0 },
      { x: 32, y: 0 },
    ],
    routeIndex: 0,
  };
  const ahead = {
    id: 2,
    hp: 100,
    x: 50,
    y: 0,
    route: [{ x: 32, y: 0 }],
    routeIndex: 0,
  };
  const outside = { ...ahead, id: 3, x: 400, route: [], routeIndex: 0 };
  const dead = { ...ahead, id: 4, hp: 0, x: 32 };
  const units = [loop, ahead, outside, dead];
  const distances = new Map(
    units.map((u) => [u, remainingPathDistance(u, base)]),
  );
  assert.ok(distances.get(loop) > distances.get(ahead));
  assert.equal(priorityTarget(base, units, 185, distances), ahead);
  assert.equal(
    priorityTarget(base, [...units].reverse(), 185, distances),
    ahead,
  );
  ahead.hp = 0;
  assert.equal(priorityTarget(base, units, 185, distances), loop);
});
test("real defensive fire selects the attacker furthest along the route", () => {
  const game = new Game();
  game.phase = "combat";
  game.pending = [{ kind: "basic", entry: 0, at: 100 }];
  const unit = (id, offset, route) => ({
    id,
    kind: "basic",
    character: "polo",
    hp: 100,
    maxHp: 100,
    x: 500 + offset,
    y: 340,
    route,
    routeIndex: 0,
    speed: 0,
    damage: 1,
    cooldown: 0,
    slow: 0,
  });
  game.units = [
    unit(1, 5, [
      { x: 950, y: 340 },
      { x: 528, y: 340 },
    ]),
    unit(2, 50, [{ x: 528, y: 340 }]),
  ];
  game.tick(0.01);
  assert.equal(game.projectiles.length, 1);
  assert.equal(game.projectiles[0].targetId, 2);
  const finished = { x: 528, y: 340, route: [], routeIndex: 0 };
  assert.equal(remainingPathDistance(finished, game.base), 0);
});
