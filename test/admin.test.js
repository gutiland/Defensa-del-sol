import { test } from "node:test";
import assert from "node:assert/strict";
import { AdminGame } from "../src/admin-game.js";
import { Game } from "../src/engine.js";
import { strikeTarget } from "../src/combat.js";
import { mountAdmin } from "../src/ui/admin.js";

test("defense refunds a new construction and its upgrades only until combat begins", () => {
  const g = new Game();
  assert.ok(g.command({ type: "build", kind: "tent", x: 400, y: 280 }));
  assert.ok(g.command({ type: "upgrade", id: 1 }));
  assert.equal(g.money, 65);
  assert.ok(g.command({ type: "remove", id: 1 }));
  assert.equal(g.money, 140);
  assert.equal(g.buildings.length, 0);
  assert.equal(g.command({ type: "remove", id: 1 }), false);
  assert.equal(g.command({ type: "remove", id: "base" }), false);
  g.command({ type: "build", kind: "tent", x: 400, y: 280 });
  g.command({ type: "ready" });
  assert.equal(g.command({ type: "remove", id: 2 }), false);
  g.pending = [];
  g.units = [];
  g.tick(0.05);
  assert.equal(g.phase, "build");
  assert.equal(
    g.command({ type: "remove", id: 2 }),
    false,
    "old defenses cannot be refunded next round",
  );
  const budget = g.money;
  g.command({ type: "build", kind: "tent", x: 680, y: 320 });
  g.command({ type: "specialize", id: 3, branch: "rapid" });
  assert.ok(g.command({ type: "remove", id: 3 }));
  assert.equal(g.money, budget);
});

test("sandbox has unlimited resources and controls attackers and defenders simultaneously", () => {
  const g = new AdminGame();
  assert.equal(g.money, Infinity);
  g.command({ type: "build", kind: "tent", x: 400, y: 280 });
  g.command({ type: "upgrade", id: 1 });
  assert.ok(
    g.command({ type: "admin-spawn", kind: "bossDani", entry: 10, count: 3 }),
  );
  assert.equal(g.phase, "combat");
  assert.equal(g.pending.length, 3);
  g.tick(0.05);
  assert.equal(g.units[0].kind, "bossDani");
  assert.ok(g.command({ type: "build", kind: "area", x: 680, y: 320 }));
  assert.ok(g.command({ type: "remove", id: 1 }));
  assert.equal(g.money, Infinity);
  for (const command of [
    { kind: "constructor", entry: 0, count: 1 },
    { kind: "basic", entry: 11, count: 1 },
    { kind: "basic", entry: 0, count: 101 },
    { kind: "basic", entry: 0, count: 0 },
    { kind: "basic", entry: 0, count: 1.5 },
  ])
    assert.equal(g.command({ type: "admin-spawn", ...command }), false);
  g.command({ type: "admin-clear" });
  g.tick(0.05);
  assert.equal(g.units.length, 0);
  assert.equal(g.phase, "combat");
  assert.equal(g.round, 1, "empty sandbox does not advance or finish");
});

test("admin can heal, test damage, reset branches and load authored waves", () => {
  const g = new AdminGame();
  const attacker = { hp: 100, damage: 100, cooldown: 0, x: 500, y: 340 };
  strikeTarget(g, attacker, g.base);
  assert.equal(g.base.hp, 660);
  g.command({ type: "admin-invulnerable", value: false });
  attacker.cooldown = 0;
  strikeTarget(g, attacker, g.base);
  assert.equal(g.base.hp, 560);
  g.result = "loss";
  g.base.hp = 0;
  assert.ok(g.command({ type: "admin-heal" }));
  assert.equal(g.result, null);
  assert.equal(g.base.hp, 660);
  g.command({ type: "build", kind: "barrier", x: 350, y: (460 - 120) / 0.66 });
  const b = g.buildings[0],
    original = b.maxHp;
  g.command({ type: "specialize", id: b.id, branch: "rapid" });
  assert.equal(b.maxHp, original + 240);
  assert.ok(g.command({ type: "admin-branch-reset", id: b.id }));
  assert.equal(b.maxHp, original);
  assert.ok(g.command({ type: "specialize", id: b.id, branch: "power" }));
  assert.equal(g.command({ type: "admin-round", round: NaN }), false);
  g.command({ type: "admin-round", round: 20 });
  g.command({ type: "ready" });
  assert.ok(g.waveIsBoss);
  assert.ok(g.pending.some((u) => u.kind === "bossPedro"));
  g.command({ type: "ability" });
  g.command({ type: "admin-recharge" });
  assert.equal(g.abilityReadyAt, 0);
  g.command({ type: "admin-reset" });
  assert.equal(g.phase, "build");
  assert.equal(g.buildings.length, 0);
  assert.equal(g.base.invulnerable, true);
  assert.equal(g.money, Infinity);
  const normal = new Game();
  assert.equal(
    normal.command({ type: "admin-spawn", kind: "basic", entry: 0, count: 1 }),
    false,
  );
  assert.equal(normal.command({ type: "admin-reset" }), false);
  assert.equal(normal.money, 140);
});

test("admin interface sends validated engine commands without advancing turns", () => {
  const elements = new Map();
  const doc = {
    getElementById(id) {
      if (!elements.has(id))
        elements.set(id, {
          children: [],
          append(child) {
            this.children.push(child);
          },
        });
      return elements.get(id);
    },
    createElement() {
      return {};
    },
  };
  const g = new AdminGame();
  mountAdmin(
    doc,
    (c) => g.command(c),
    () => g.command({ type: "admin-reset" }),
  );
  assert.equal(elements.get("admin-kind").children.length, 12);
  assert.equal(elements.get("admin-entry").children.length, 11);
  elements.get("admin-kind").value = "fast";
  elements.get("admin-entry").value = "8";
  doc.getElementById("admin-count").value = "4";
  elements.get("admin-spawn").onclick();
  assert.equal(g.pending.length, 4);
  assert.ok(g.pending.every((p) => p.entry === 8 && p.kind === "fast"));
  elements.get("admin-round").value = "20";
  elements.get("admin-wave").onclick();
  assert.equal(g.round, 20);
  assert.ok(g.waveIsBoss);
  elements.get("admin-stop").onclick();
  assert.equal(g.phase, "build");
  elements.get("admin-round").value = "7";
  elements.get("admin-prepare").onclick();
  assert.equal(g.phase, "build");
  assert.equal(g.round, 7);
  assert.ok(Number.isFinite(g.money));
  assert.equal(elements.get("admin-invulnerable").checked, false);
  assert.ok(elements.get("admin-feedback").textContent.includes(String(g.money)));
});

test("loading sandbox waves is atomic and manual boss indicators clear with the test", () => {
  const game = new AdminGame();
  game.command({ type: "admin-spawn", kind: "bossPedro", entry: 0, count: 1 });
  assert.equal(game.waveIsBoss, true);
  const pending = game.pending;
  for (const round of [0, 21, NaN, 1.5, "2"]) {
    assert.equal(game.command({ type: "admin-wave", round }), false);
    assert.equal(game.pending, pending);
    assert.equal(game.phase, "combat");
  }
  game.command({ type: "admin-clear" });
  assert.equal(game.waveIsBoss, false);
  assert.ok(game.command({ type: "admin-wave", round: 20 }));
  assert.equal(game.round, 20);
  assert.ok(game.waveIsBoss);
  assert.ok(game.pending.some((unit) => unit.kind === "bossPedro"));
  game.command({ type: "admin-stop" });
  game.command({ type: "admin-spawn", kind: "basic", entry: 2, count: 1 });
  assert.equal(game.waveIsBoss, false);
});
