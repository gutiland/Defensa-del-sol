import { test } from "node:test";
import assert from "node:assert/strict";
import { Game, ENTRIES, building } from "../src/engine.js";
import { ROUTES, FINAL_PATH, onPath } from "../src/data/routes.js";
import { unprojectY } from "../src/data/map.js";
import { placementError } from "../src/placement.js";

test("barricades require a path while ordinary buildings must stay off it", () => {
  const game = new Game();
  const x = 350,
    y = unprojectY(460);
  assert.equal(game.command({ type: "build", kind: "tent", x, y }), false);
  assert.equal(
    game.command({
      type: "build",
      kind: "barrier",
      x: 550,
      y: unprojectY(540),
    }),
    false,
  );
  assert.ok(game.command({ type: "build", kind: "barrier", x, y }));
  assert.equal(game.command({ type: "build", kind: "barrier", x, y }), false);
  assert.equal(game.money, 115);
});

test("all entrances share one winding final corridor and have substantial travel distance", () => {
  const suffix = ENTRIES[0].route.slice(-FINAL_PATH.length);
  for (let i = 0; i < ENTRIES.length; i++) {
    assert.deepEqual(ROUTES[i].slice(-FINAL_PATH.length), FINAL_PATH);
    assert.deepEqual(ENTRIES[i].route.slice(-FINAL_PATH.length), suffix);
    let previous = ENTRIES[i],
      length = 0;
    for (const point of ENTRIES[i].route) {
      length += Math.hypot(point.x - previous.x, point.y - previous.y);
      previous = point;
    }
    assert.ok(length >= 1100, ENTRIES[i].name + " has a long approach");
  }
});

test("construction cannot obstruct any section of any approach or trunk", () => {
  const game = new Game();
  for (const route of ROUTES)
    for (let i = 1; i < route.length; i++) {
      const x = (route[i - 1][0] + route[i][0]) / 2,
        y = unprojectY((route[i - 1][1] + route[i][1]) / 2);
      assert.ok(placementError(game, x, y));
      assert.equal(game.command({ type: "build", kind: "tent", x, y }), false);
    }
});
test("new roadside slots can be used without placing construction on the path itself", () => {
  const game = new Game();
  let found = false;
  for (let x = 100; x <= 900 && !found; x += 10)
    for (let py = 180; py <= 550; py += 10) {
      const y = unprojectY(py);
      if (!placementError(game, x, y) && onPath(x, py, 24)) {
        assert.equal(onPath(x, py), false);
        assert.ok(game.command({ type: "build", kind: "tent", x, y }));
        found = true;
        break;
      }
    }
  assert.ok(
    found,
    "there must be usable slots in the former roadside exclusion strip",
  );
});

test("expanded plaza permits construction in the new southern area while preserving limits", () => {
  const game = new Game();
  assert.ok(
    game.command({ type: "build", kind: "tent", x: 550, y: unprojectY(540) }),
  );
  assert.equal(
    game.command({ type: "build", kind: "tent", x: 550, y: unprojectY(640) }),
    false,
  );
});

test("every entrance reaches and attacks the central base without attacking nearby defenses", () => {
  for (let entry = 0; entry < ENTRIES.length; entry++) {
    const game = new Game("attack");
    game.buildings = [];
    game.command({ type: "recruit", kind: "basic", entry });
    game.command({ type: "ready" });
    game.tick(0.01);
    game.units[0].hp = 1e6;
    const decoy = building(
      "kitchen",
      ENTRIES[entry].x + 20,
      ENTRIES[entry].y,
      99,
    );
    game.buildings.push(decoy);
    for (let i = 0; i < 4000 && game.base.hp === game.base.maxHp; i++)
      game.tick(0.05);
    assert.ok(
      game.base.hp < game.base.maxHp,
      ENTRIES[entry].name + " reaches the base",
    );
    assert.equal(decoy.hp, decoy.maxHp);
  }
});

test("predefined attacking-mode camp does not occupy a reserved path", () => {
  const game = new Game("attack");
  for (const b of game.buildings) {
    const others = game.buildings.filter((other) => other !== b);
    assert.equal(
      placementError({ ...game, buildings: others }, b.x, b.y, b.type),
      null,
    );
  }
});

test("barricades stop attackers until destroyed and never deal damage", () => {
  const game = new Game("attack");
  game.buildings = [];
  game.base.cooldown = 10000;
  game.command({ type: "recruit", kind: "basic", entry: 0 });
  game.command({ type: "ready" });
  game.tick(0.01);
  const unit = game.units[0],
    point = unit.route[0],
    dx = point.x - unit.x,
    dy = point.y - unit.y,
    length = Math.hypot(dx, dy);
  const barrier = building(
    "barrier",
    unit.x + (dx / length) * 45,
    unit.y + (dy / length) * 45,
    99,
  );
  barrier.hp = 18;
  game.buildings.push(barrier);
  const hp = unit.hp;
  for (let i = 0; i < 20 && !unit.blockedBy; i++) game.tick(0.05);
  assert.equal(unit.blockedBy, 99);
  const x = unit.x,
    y = unit.y;
  game.tick(0.05);
  assert.equal(unit.x, x);
  assert.equal(unit.y, y);
  assert.equal(unit.hp, hp);
  for (let i = 0; i < 30 && game.buildings.length; i++) game.tick(0.05);
  assert.equal(game.buildings.length, 0);
  game.tick(0.05);
  assert.ok(Math.hypot(unit.x - x, unit.y - y) > 0);
  assert.equal(unit.hp, hp);
});
