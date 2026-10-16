import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { AdminGame } from "../src/admin-game.js";
import {
  beginRoundReport,
  recordDefeat,
  finishRoundReport,
} from "../src/experience.js";
import { dealDamage, bossState } from "../src/boss-mechanics.js";
import { saveCampaign, loadCampaign } from "../src/campaign-save.js";
import { PerformanceSamples } from "../src/performance-samples.js";
import { createDeathAnimations } from "../src/render/deaths.js";
import { resultSummary } from "../src/ui/share-result.js";
import { createBattleCamera } from "../src/render/battle-camera.js";
import { readStorage } from "../src/preferences.js";

test("chains reset after two seconds and do not modify money or kill rewards", () => {
  const g = new Game(),
    money = g.money;
  beginRoundReport(g);
  for (let i = 0; i < 10; i++) {
    g.time = i * 0.2;
    recordDefeat(g, { kind: "basic" }, 5);
  }
  assert.equal(g.bestChain, 10);
  assert.equal(g.chain.reward, 50);
  assert.equal(g.money, money);
  g.time += 2.01;
  recordDefeat(g, { kind: "basic" }, 5);
  assert.equal(g.chain.count, 1);
  assert.equal(g.chain.reward, 5);
  finishRoundReport(g);
  assert.ok(g.awards.includes("Coro de diez"));
});

test("reports track actual damage, round rewards and three distinct bosses", () => {
  const g = new Game();
  beginRoundReport(g);
  const unit = { kind: "basic", hp: 3, x: 200 };
  assert.equal(
    dealDamage(g, unit, 100, { sourceId: "base", type: "bottle", fromX: 300 }),
    3,
  );
  assert.equal(g.roundDamage.base, 3);
  assert.equal(unit.hitDirection, -1);
  assert.equal(unit.hitWeapon, "bottle");
  g.kills = 2;
  g.earned = 10;
  for (let i = 0; i < 3; i++) recordDefeat(g, { kind: "bossDani" }, 55);
  assert.equal(g.bossesDefeated, 1);
  recordDefeat(g, { kind: "bossSanti" }, 55);
  recordDefeat(g, { kind: "bossPedro" }, 55);
  const report = finishRoundReport(g);
  assert.equal(report.earned, 10);
  assert.equal(report.kills, 2);
  assert.equal(report.lostHealth, 0);
  assert.ok(g.awards.includes("La plaza resiste"));
});

test("each completed wave creates one report and starts the next with a fresh chain", () => {
  const g = new Game();
  g.command({ type: "ready" });
  g.pending = [];
  g.units = [];
  g.tick(1 / 60);
  assert.equal(g.reports.length, 1);
  assert.equal(g.reports[0].round, 1);
  g.tick(1 / 60);
  assert.equal(g.reports.length, 1);
  g.command({ type: "ready" });
  assert.equal(g.chain.count, 0);
});

test("Eau causes nonstacking continuous damage, leaves speed unchanged and perfume is immune", () => {
  for (const kind of ["basic", "perfume"]) {
    const g = new AdminGame();
    g.command({ type: "admin-spawn", kind, entry: 0, count: 1 });
    g.tick(1 / 60);
    const u = g.units[0],
      hp = u.hp;
    g.base.cooldown = 100;
    g.buildings = [1, 2].map((id) => ({
      id,
      type: "odor",
      level: 1,
      hp: 90,
      maxHp: 90,
      x: u.x,
      y: u.y,
      cooldown: 0,
    }));
    for (let i = 0; i < 60; i++) g.tick(1 / 60);
    assert.ok(Math.abs(u.hp - (kind === "basic" ? hp - 2 : hp)) < 1e-7);
    assert.equal(u.slow, 0);
  }
});

test("boss desperation and Pedro's cycle expose different combat phases", () => {
  const dani = { id: 1, kind: "bossDani", hp: 40, maxHp: 100, x: 0, y: 0 };
  const escort = { id: 2, kind: "basic", hp: 40, x: 10, y: 0 };
  const g = { time: 1, units: [dani, escort] };
  assert.equal(bossState(g, escort).speed, 1.45);
  assert.equal(
    bossState(g, { kind: "bossSanti", hp: 40, maxHp: 100 }).speed,
    1.2,
  );
  const pedro = { kind: "bossPedro", hp: 100, maxHp: 100 };
  assert.equal(bossState(g, pedro).shield, true);
  g.time = 5;
  assert.equal(bossState(g, pedro).shield, false);
  assert.equal(bossState(g, pedro).speed, 1.65);
});

test("checkpoint restores upgrades, identities and progress; rejects corrupt state and never saves combat/admin", () => {
  const old = globalThis.localStorage;
  let raw = null;
  globalThis.localStorage = {
    getItem: () => raw,
    setItem: (_, value) => {
      raw = value;
    },
  };
  try {
    const g = new Game();
    assert.ok(g.command({ type: "build", kind: "tent", x: 440.5, y: 280.3 }));
    assert.ok(g.command({ type: "upgrade", id: g.buildings[0].id }));
    assert.equal(saveCampaign(g), true);
    const loaded = loadCampaign();
    assert.ok(loaded instanceof Game);
    assert.equal(loaded.buildings[0].level, 2);
    assert.equal(loaded.buildings[0].id, g.buildings[0].id);
    assert.equal(loaded.money, g.money);
    assert.equal(loaded.command({ type: "ready" }), true);
    const checkpoint = raw;
    assert.equal(saveCampaign(loaded), false);
    assert.equal(raw, checkpoint);
    assert.equal(saveCampaign(new AdminGame()), false);
    const corrupt = JSON.parse(raw);
    corrupt.state.buildings[0].production = "Infinity";
    raw = JSON.stringify(corrupt);
    assert.equal(loadCampaign(), null);
    raw = "bad json";
    assert.equal(loadCampaign(), null);
    globalThis.localStorage = {
      getItem() {
        throw Error("disabled");
      },
      setItem() {
        throw Error("quota");
      },
    };
    assert.equal(loadCampaign(), null);
    assert.equal(saveCampaign(g), false);
  } finally {
    if (old === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = old;
  }
});

test("death portraits are shared, simultaneous detail is bounded and reset clears them", () => {
  let created = 0,
    images = 0;
  const ctx = new Proxy(
    {},
    {
      get: (_, key) =>
        key === "drawImage"
          ? () => images++
          : key === "createLinearGradient"
            ? () => ({ addColorStop() {} })
            : () => {},
      set: () => true,
    },
  );
  const draw = createDeathAnimations(() => {
    created++;
    return { getContext: () => ctx };
  });
  const g = {
    visualRevision: 0,
    deaths: Array.from({ length: 64 }, (_, id) => ({
      id,
      kind: "basic",
      character: "polo",
      x: 100,
      y: 100,
    })),
  };
  draw(ctx, g, 0.05);
  assert.equal(created, 1);
  assert.equal(images, 24);
  images = 0;
  g.visualRevision++;
  g.deaths = [];
  draw(ctx, g, 0);
  assert.equal(images, 0);
});

test("performance samples stay bounded and result summaries include earned achievements", () => {
  const samples = new PerformanceSamples(3);
  for (const n of [100, 10, 20, 30]) samples.add(n, n / 2, n / 2);
  assert.equal(samples.summary().samples, 3);
  assert.equal(samples.summary().renderP50, 10);
  const g = new Game();
  g.awards = ["Coro de diez"];
  assert.ok(resultSummary(g).includes("Coro de diez"));
});

test("boss camera motion is brief, respects pause and reduced motion, and resets", () => {
  const camera = createBattleCamera(),
    game = { deaths: [{ kind: "bossDani" }], visualRevision: 0 };
  const moving = camera.advance(game, 0.02, false);
  assert.notEqual(moving, 0);
  assert.equal(camera.advance(game, 0, false), moving);
  assert.equal(camera.advance(game, 0.01, true), 0);
  assert.equal(camera.advance(game, 0.3, false), 0);
  game.visualRevision++;
  game.deaths = [];
  assert.equal(camera.advance(game, 0, false), 0);
});

test("mass defeats pay all rewards once while creating a single grouped reward effect", () => {
  const g = new AdminGame();
  g.command({ type: "admin-spawn", kind: "basic", entry: 0, count: 100 });
  for (const p of g.pending) p.at = 0;
  g.tick(1 / 60);
  for (const u of g.units) u.hp = 0;
  g.tick(1 / 60);
  assert.equal(g.kills, 100);
  assert.equal(g.earned, 300);
  const rewards = g.effects.filter((e) => e.type === "reward");
  assert.equal(rewards.length, 1);
  assert.equal(rewards[0].amount, 300);
  g.tick(1 / 60);
  assert.equal(g.earned, 300);
});

test("hostile saved data cannot inject inherited story options, oversized JSON or overlapping shelters", () => {
  const old = globalThis.localStorage;
  let raw;
  globalThis.localStorage = {
    getItem: () => raw,
    setItem: (_, value) => {
      raw = value;
    },
  };
  try {
    const game = new Game();
    game.money = 1000;
    game.command({ type: "build", kind: "tent", x: 440.5, y: 280.3 });
    saveCampaign(game);
    const valid = raw;
    assert.ok(loadCampaign());
    for (const change of [
      (s) => {
        s.storyChoices = JSON.parse('{"__proto__":"debate"}');
      },
      (s) => {
        s.storyChoices = { 4: "not-a-real-option" };
      },
      (s) => {
        s.buildings[0].refundable = "yes";
      },
      (s) => {
        s.buildings[0].x = s.base.x;
        s.buildings[0].y = s.base.y;
      },
      (s) => {
        s.awards = Array(5).fill("Coro de diez");
      },
    ]) {
      const data = JSON.parse(valid);
      change(data.state);
      raw = JSON.stringify(data);
      assert.equal(loadCampaign(), null);
    }
    raw = '"' + "x".repeat(512001) + '"';
    assert.equal(readStorage("anything"), null);
  } finally {
    if (old === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = old;
  }
});
