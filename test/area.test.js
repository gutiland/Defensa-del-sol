import { test } from "node:test";
import assert from "node:assert/strict";
import { Game, BUILDINGS } from "../src/engine.js";
import { resolveProjectiles } from "../src/combat.js";
import { weaponFor, maxLevel } from "../src/data/weapons.js";
import { defenderPose } from "../src/render/poses.js";
test("area paint damage hits each living enemy in radius once, including when original target has died", () => {
  const game = new Game();
  const weapon = weaponFor({ type: "area", level: 1 }, BUILDINGS.area);
  game.units = [
    { id: 1, x: 0, y: 0, hp: 0 },
    { id: 2, x: 0, y: 0, hp: 100 },
    { id: 3, x: 65, y: 0, hp: 100 },
    { id: 4, x: 66, y: 0, hp: 100 },
  ];
  game.projectiles = [{ targetId: 1, tx: 0, ty: 0, life: 0.1, weapon }];
  resolveProjectiles(game, 0.1);
  assert.deepEqual(
    game.units.map((u) => u.hp),
    [0, 94, 94, 100],
  );
  assert.equal(game.projectiles.length, 0);
  assert.equal(game.effects[0].type, "splash");
});
test("area store can be built and upgraded with increased splash damage", () => {
  const game = new Game();
  game.money = 200;
  assert.ok(
    game.command({
      type: "build",
      kind: "area",
      x: 550,
      y: (540 - 120) / 0.66,
    }),
  );
  assert.ok(game.command({ type: "upgrade", id: 1 }));
  assert.equal(weaponFor(game.buildings[0], BUILDINGS.area).damage, 10);
});

test("area upgrades use four distinct weapons with matching poses and bounded splash damage", () => {
  const game = new Game();
  game.money = 1000;
  assert.ok(
    game.command({
      type: "build",
      kind: "area",
      x: 550,
      y: (540 - 120) / 0.66,
    }),
  );
  const building = game.buildings[0],
    types = [],
    damage = [];
  for (let level = 1; level <= maxLevel("area"); level++) {
    const weapon = weaponFor(building, BUILDINGS.area);
    types.push(weapon.type);
    damage.push(weapon.damage);
    assert.equal(defenderPose(building, 0).weapon, weapon.type);
    assert.equal(weapon.splash, 65);
    game.units = [
      { id: 1, x: 0, y: 0, hp: 100 },
      { id: 2, x: 66, y: 0, hp: 100 },
    ];
    game.projectiles = [{ targetId: 1, tx: 0, ty: 0, life: 0.4, weapon }];
    resolveProjectiles(game, 0.4);
    assert.equal(game.units[0].hp, 100 - weapon.damage);
    assert.equal(game.units[1].hp, 100);
    assert.equal(game.fires.length, 0);
    if (level < maxLevel("area"))
      assert.ok(game.command({ type: "upgrade", id: building.id }));
  }
  assert.deepEqual(types, ["paintbomb", "paintcan", "firecracker", "grenade"]);
  assert.deepEqual(damage, [6, 10, 14, 16]);
  const remaining = game.money;
  assert.equal(game.command({ type: "upgrade", id: building.id }), false);
  assert.equal(game.money, remaining);
});
