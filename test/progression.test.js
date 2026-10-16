import { test } from "node:test";
import assert from "node:assert/strict";
import { Game, building, BUILDINGS } from "../src/engine.js";
import { weaponFor } from "../src/data/weapons.js";
import { WAVES, normalWave } from "../src/data/waves.js";
import { bossState, dealDamage } from "../src/boss-mechanics.js";
import { odorStats } from "../src/stereotypes.js";

function battle(mode = "defense") {
  const g = new Game(mode);
  g.phase = "combat";
  g.money = 500;
  g.pending = [{ kind: "basic", entry: 0, at: 100 }];
  return g;
}
function enemy(overrides = {}) {
  return {
    id: 100,
    kind: "basic",
    hp: 100,
    maxHp: 100,
    x: 800,
    y: 500,
    speed: 40,
    damage: 1,
    cooldown: 0,
    slow: 0,
    route: [{ x: 900, y: 500 }],
    routeIndex: 0,
    ...overrides,
  };
}
test("defense allows combat building, upgrades and irreversible specialization with validated cost", () => {
  const g = battle();
  assert.ok(g.command({ type: "build", kind: "tent", x: 400, y: 280 }));
  assert.ok(g.command({ type: "upgrade", id: 1 }));
  assert.ok(g.command({ type: "specialize", id: 1, branch: "rapid" }));
  const budget = g.money;
  assert.equal(
    g.command({ type: "specialize", id: 1, branch: "power" }),
    false,
  );
  assert.equal(
    g.command({ type: "specialize", id: "base", branch: "invalid" }),
    false,
  );
  assert.equal(
    g.command({ type: "specialize", id: "base", branch: "constructor" }),
    false,
  );
  assert.equal(g.command({ type: "ready" }), false);
  assert.equal(g.money, budget);
  assert.equal(g.buildings[0].level, 2);
  assert.ok(weaponFor(g.buildings[0], BUILDINGS.tent).rate < 0.9);
  for (const mode of ["attack", "local"]) {
    const other = battle(mode);
    assert.equal(
      other.command({ type: "build", kind: "tent", x: 400, y: 280 }),
      false,
    );
    assert.equal(other.command({ type: "ability" }), false);
  }
  g.money = 0;
  assert.equal(
    g.command({ type: "specialize", id: "base", branch: "power" }),
    false,
  );
});
test("each defeat pays once, and local rewards belong to defender", () => {
  for (const mode of ["defense", "local", "attack"]) {
    const g = battle(mode);
    g.defenseMoney = 20;
    g.units = [enemy({ hp: 0 })];
    g.tick(0.05);
    g.tick(0.05);
    assert.equal(g.kills, 1);
    assert.equal(g.earned, 3);
    assert.equal(g.money, mode === "defense" ? 503 : 500);
    assert.equal(g.defenseMoney, mode === "local" ? 23 : 20);
  }
});
test("assembly freezes movement and attacks, expires and respects its cooldown", () => {
  const g = battle();
  g.units = [enemy()];
  assert.ok(g.command({ type: "ability" }));
  assert.equal(g.command({ type: "ability" }), false);
  for (let i = 0; i < 40; i++) g.tick(0.05);
  assert.equal(g.units[0].x, 800);
  for (let i = 0; i < 40; i++) g.tick(0.05);
  assert.ok(g.units[0].x > 800);
  assert.equal(g.command({ type: "ability" }), false);
  g.time = 25;
  assert.ok(g.command({ type: "ability" }));
});
test("boss protection cycles, escort aura ends on death and armor has counters", () => {
  const g = battle();
  const pedro = enemy({ kind: "bossPedro" });
  assert.equal(dealDamage(g, pedro, 20), 7);
  g.time = 5;
  assert.equal(dealDamage(g, pedro, 20), 20);
  assert.equal(bossState(g, pedro).speed, 1.65);
  const dani = enemy({ kind: "bossDani", id: 200 });
  const escort = enemy();
  g.units = [dani, escort];
  assert.equal(bossState(g, escort).speed, 1.3);
  dani.hp = 0;
  assert.equal(bossState(g, escort).speed, 1);
  const santi = enemy({ kind: "bossSanti" });
  assert.equal(dealDamage(g, santi, 14), 6);
  assert.equal(dealDamage(g, santi, 14, { piercing: true }), 14);
  assert.equal(dealDamage(g, santi, 14, { splash: 65 }), 14);
});
test("support branches change aura, regeneration, income and multi-target sound", () => {
  const g = battle();
  const odor = building("odor", 400, 280, 1);
  const initial = odorStats(odor);
  odor.branch = "rapid";
  assert.equal(odorStats(odor).radius, initial.radius + 45);
  odor.branch = "power";
  assert.equal(odorStats(odor).dps, initial.dps + 2);
  const barrier = building("barrier", 400, 280, 2);
  barrier.hp = 100;
  barrier.branch = "power";
  const kitchen = building("kitchen", 400, 280, 3);
  kitchen.branch = "power";
  g.buildings = [barrier, kitchen];
  for (let i = 0; i < 101; i++) g.tick(0.05);
  assert.equal(g.money, 502);
  assert.ok(barrier.hp > 150);
  const speaker = building("speaker", 800, 500, 4);
  speaker.branch = "rapid";
  g.buildings = [speaker];
  g.units = [enemy(), enemy({ id: 101, x: 820 })];
  g.tick(0.05);
  assert.ok(g.units.every((u) => u.hp === 98 && u.slow > 1));
});
test("authored campaign uses every entry, sorted spawns, combinations and a twenty-round finale", () => {
  const entries = new Set();
  for (let round = 1; round <= 20; round++) {
    const wave = normalWave(round, 11);
    wave.forEach((u) => entries.add(u.entry));
    assert.ok(wave.every((u, i) => i === 0 || u.at >= wave[i - 1].at));
  }
  assert.equal(entries.size, 11);
  assert.ok(WAVES[19].boss);
  const g = battle();
  g.round = 20;
  g.pending = [];
  g.tick(0.05);
  assert.equal(g.result, "defense");
});

test("radio slows all nearby living enemies from level one, respecting range and longer chorus duration", () => {
  const g = battle(),
    radio = building("speaker", 800, 500, 10);
  g.buildings = [radio];
  g.units = [
    enemy({ x: 800, speed: 0 }),
    enemy({ id: 101, x: 940, speed: 0, kind: "perfume" }),
    enemy({ id: 102, x: 960, speed: 0 }),
  ];
  g.tick(0.05);
  assert.ok(g.units.slice(0, 2).every((u) => u.hp === 98 && u.slow > 1));
  assert.equal(g.units[2].hp, 100);
  assert.equal(g.units[2].slow, 0);
  radio.branch = "rapid";
  radio.cooldown = 0;
  g.tick(0.05);
  assert.ok(g.units.slice(0, 2).every((u) => u.slow > 2.9));
  assert.equal(g.effects.find((e) => e.type === "sound").radius, 150);
});
test("speaker specialization reaches its advertised range and chorus keeps its stated cadence", () => {
  const g = battle();
  const speaker = building("speaker", 800, 500, 10);
  g.buildings = [speaker];
  g.units = [enemy({ x: 965, speed: 0 })];
  g.tick(0.05);
  assert.equal(g.units[0].hp, 100, "normal speaker cannot reach 165 units");
  speaker.branch = "power";
  g.tick(0.05);
  assert.ok(Math.abs(g.units[0].hp - 96.2) < 1e-9);
  speaker.branch = "rapid";
  speaker.cooldown = 0;
  g.units = [enemy({ x: 800, speed: 0 }), enemy({ id: 101, x: 820, speed: 0 })];
  g.tick(0.05);
  g.tick(0.7);
  assert.ok(
    g.units.every((unit) => unit.hp === 98),
    "chorus affects the group but does not silently acquire a cadence bonus",
  );
});

test("kitchen levels and dining specialization pay reduced income in defense and local modes", () => {
  for (const mode of ["defense", "local"]) {
    const g = battle(mode);
    const kitchen = building("kitchen", 400, 280, 1);
    kitchen.level = 2;
    kitchen.branch = "rapid";
    g.buildings = [kitchen];
    g.pending = [];
    g.defenseMoney = 20;
    g.tick(0.05);
    assert.equal(g.money, mode === "defense" ? 590 : 110);
    assert.equal(g.defenseMoney, 20);
  }
});
