import { test } from "node:test";
import assert from "node:assert/strict";
import { Game, building } from "../src/engine.js";
import { TENT_WEAPONS, weaponFor } from "../src/data/weapons.js";
import { resolveProjectiles, burnGround } from "../src/combat.js";

test("tents and the central base upgrade through exactly four weapons", () => {
  for (const base of [false, true]) {
    const game = new Game();
    game.money = 1000;
    if (!base) game.buildings.push(building("tent", 350, 210, 1));
    const target = base ? game.base : game.buildings[0];
    const types = [];
    for (let i = 0; i < 4; i++) {
      types.push(weaponFor(target, {}).type);
      if (i < 3) assert.ok(game.command({ type: "upgrade", id: target.id }));
    }
    assert.deepEqual(types, ["stone", "big-stone", "bottle", "molotov"]);
    const money = game.money;
    assert.equal(game.command({ type: "upgrade", id: target.id }), false);
    assert.equal(game.money, money);
  }
});
test("a molotov deals damage and creates fire only upon landing, even if its target disappeared", () => {
  const game = new Game();
  game.units = [{ id: 1, x: 0, y: 0, hp: 100 }];
  const projectile = {
    targetId: 1,
    tx: 0,
    ty: 0,
    weapon: TENT_WEAPONS[3],
    life: 0.4,
  };
  game.projectiles = [projectile];
  resolveProjectiles(game, 0.2);
  assert.equal(game.units[0].hp, 100);
  assert.equal(game.fires.length, 0);
  resolveProjectiles(game, 0.2);
  assert.equal(game.units[0].hp, 77);
  assert.equal(game.fires.length, 1);
  game.units = [];
  game.projectiles = [{ ...projectile, life: 0.1 }];
  resolveProjectiles(game, 0.1);
  assert.equal(game.fires.length, 2);
});
test("fire respects radius and duration, and overlapping pools do not multiply damage", () => {
  const game = new Game();
  game.units = [
    { x: 0, y: 0, hp: 100 },
    { x: 46, y: 0, hp: 100 },
  ];
  game.fires = [
    { x: 0, y: 0, radius: 45, dps: 8, life: 0.5 },
    { x: 0, y: 0, radius: 45, dps: 8, life: 0.5 },
  ];
  burnGround(game, 1);
  assert.equal(game.units[0].hp, 96);
  assert.equal(game.units[1].hp, 100);
  assert.equal(game.fires.length, 0);
});
