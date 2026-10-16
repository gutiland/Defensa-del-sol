import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { EnemyDiscovery } from "../src/enemy-discovery.js";
import {
  saveCampaign,
  loadCampaign,
  rememberEnemyIntroduction,
} from "../src/campaign-save.js";

function storage(run) {
  const previous = globalThis.localStorage;
  const values = new Map();
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  try {
    run(values);
  } finally {
    if (previous === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = previous;
  }
}

test("presentations persist during combat without overwriting the preparation checkpoint", () =>
  storage((values) => {
    const game = new Game();
    saveCampaign(game);
    const original = JSON.parse(values.get("sol-campaign-v1")).state;
    game.command({ type: "ready" });
    game.money = 1;
    game.base.hp = 0;
    rememberEnemyIntroduction(game, "basic");
    const saved = JSON.parse(values.get("sol-campaign-v1")).state;
    assert.equal(saved.money, original.money);
    assert.equal(saved.base.hp, original.base.hp);
    const loaded = loadCampaign();
    assert.ok(loaded);
    loaded.units = [{ kind: "basic" }, { kind: "fast" }];
    const discovery = new EnemyDiscovery();
    discovery.observe(loaded);
    assert.equal(discovery.next(), "fast");
    assert.equal(discovery.next(), undefined);
    const fresh = new Game();
    fresh.units = [{ kind: "basic" }];
    discovery.observe(fresh);
    assert.equal(discovery.next(), "basic");
  }));

test("legacy saves infer earlier encounters while corrupt discovery histories are rejected", () =>
  storage((values) => {
    const game = new Game();
    game.round = 6;
    game.defendedWaves = 5;
    saveCampaign(game);
    const checkpoint = JSON.parse(values.get("sol-campaign-v1"));
    delete checkpoint.state.discoveredEnemies;
    values.set("sol-campaign-v1", JSON.stringify(checkpoint));
    const loaded = loadCampaign();
    assert.ok(loaded.discoveredEnemies.includes("bossDani"));
    loaded.units = [{ kind: "basic" }, { kind: "heavy" }, { kind: "armored" }];
    const discovery = new EnemyDiscovery();
    discovery.observe(loaded);
    assert.equal(discovery.next(), "armored");
    assert.equal(discovery.next(), undefined);
    for (const history of ["basic", ["__proto__"], ["basic", "basic"], [123]]) {
      checkpoint.state.discoveredEnemies = history;
      values.set("sol-campaign-v1", JSON.stringify(checkpoint));
      assert.equal(loadCampaign(), null);
    }
  }));
