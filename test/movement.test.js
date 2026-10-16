import { test } from "node:test";
import assert from "node:assert/strict";
import { Game, ENTRIES } from "../src/engine.js";
import { STREETS, projectY } from "../src/data/map.js";
import { followRoute } from "../src/movement.js";

test("all map streets can recruit attackers and programmed waves use every entrance", () => {
  assert.equal(ENTRIES.length, STREETS.length);
  for (let entry = 0; entry < ENTRIES.length; entry++) {
    const game = new Game("attack");
    assert.ok(game.command({ type: "recruit", kind: "basic", entry }));
    assert.equal(game.queue[0].entry, entry);
  }
  const entrances = new Set();
  for (let round = 1; round <= 20; round++) {
    const game = new Game();
    game.round = round;
    game.command({ type: "ready" });
    game.pending.forEach((unit) => entrances.add(unit.entry));
  }
  assert.equal(entrances.size, STREETS.length);
});

test("each approach stays on its drawn street instead of chasing nearby buildings", () => {
  for (let entry = 0; entry < ENTRIES.length; entry++) {
    const g = new Game("attack");
    g.buildings = [];
    g.command({ type: "recruit", kind: "heavy", entry });
    g.command({ type: "ready" });
    const e = ENTRIES[entry];
    // A tempting nearby target must not divert an attacker before the plaza.
    const decoy = {
      id: 99,
      type: "kitchen",
      x: e.x + 20,
      y: e.y,
      hp: 1000,
      maxHp: 1000,
      cooldown: 0,
    };
    g.buildings.push(decoy);
    const street = STREETS.find(
      (s) => s.name === e.name.toLocaleUpperCase("es"),
    );
    for (let i = 0; i < 100; i++) {
      g.tick(0.05);
      const u = g.units[0];
      assert.ok(u);
      const x = u.x - street.from[0],
        y = projectY(u.y) - street.from[1];
      const end = street.via?.[0] || street.to;
      const dx = end[0] - street.from[0],
        dy = end[1] - street.from[1];
      assert.ok(
        Math.abs(x * dy - y * dx) < 1e-7,
        "unit stays on the street centerline",
      );
      assert.equal(decoy.hp, 1000, "no attack before finishing approach");
    }
  }
});

test("waypoints turn correctly and clamp at the plaza entrance without overshooting", () => {
  const u = {
    x: 0,
    y: 0,
    route: [
      { x: 10, y: 0 },
      { x: 10, y: 10 },
    ],
    routeIndex: 0,
  };
  assert.equal(followRoute(u, 15), false);
  assert.equal(u.x, 10);
  assert.equal(u.y, 5);
  assert.equal(followRoute(u, 100), true);
  assert.equal(u.x, 10);
  assert.equal(u.y, 10);
});
