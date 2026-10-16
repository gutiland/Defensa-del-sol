import { test } from "node:test";
import assert from "node:assert/strict";
import { Game, UNITS } from "../src/engine.js";
import { attackerCharacter } from "../src/data/characters.js";
import { EnemyDiscovery } from "../src/enemy-discovery.js";
import { createEnemyIntroductions } from "../src/ui/enemy-intro.js";
import { Playback } from "../src/playback.js";

test("rounds introduce one normal type at a time and retain previous lessons", () => {
  const seen = new Set();
  const expected = {
    1: "basic",
    2: "fast",
    3: "heavy",
    4: "perfume",
    6: "armored",
    7: "sprinter",
    8: "medic",
    12: "berserker",
  };
  const bosses = { 5: "bossDani", 12: "bossSanti", 20: "bossPedro" };
  for (let round = 1; round <= 20; round++) {
    const game = new Game();
    game.round = round;
    game.command({ type: "ready" });
    const kinds = new Set(game.pending.map((u) => u.kind));
    for (const prior of seen) assert.ok(kinds.has(prior));
    const normal = [...kinds].filter((k) => !k.startsWith("boss"));
    assert.deepEqual(
      normal.filter((k) => !seen.has(k)),
      expected[round] ? [expected[round]] : [],
    );
    assert.deepEqual(
      [...kinds].filter((k) => k.startsWith("boss")),
      bosses[round] ? [bosses[round]] : [],
    );
    for (const kind of normal) {
      assert.ok(UNITS[kind]);
      seen.add(kind);
    }
  }
});
test("attacker types keep one distinct identity regardless of spawn variant", () => {
  const normal = [
    "basic",
    "fast",
    "heavy",
    "perfume",
    "armored",
    "sprinter",
    "medic",
    "berserker",
  ];
  assert.equal(
    new Set(normal.map((kind) => attackerCharacter(kind))).size,
    normal.length,
  );
  for (const kind of normal)
    for (let variant = 0; variant < 20; variant++)
      assert.equal(attackerCharacter(kind, variant), attackerCharacter(kind));
});
test("discovery queues each type once, resets by match and excludes sandbox", () => {
  const discovery = new EnemyDiscovery(),
    game = new Game();
  game.units = [{ kind: "basic" }, { kind: "basic" }, { kind: "fast" }];
  discovery.observe(game);
  assert.equal(discovery.next(), "basic");
  assert.equal(discovery.next(), "fast");
  discovery.observe(game);
  assert.equal(discovery.next(), undefined);
  const other = new Game();
  other.units = [{ kind: "basic" }];
  discovery.observe(other);
  assert.equal(discovery.next(), "basic");
  other.sandbox = true;
  other.units = [{ kind: "heavy" }];
  discovery.observe(other);
  assert.equal(discovery.next(), undefined);
});
test("new enemy tabs pause combat and restore the prior pause choice on dismissal", () => {
  const nodes = new Map();
  const ctx = new Proxy(
    {},
    {
      get: (_, key) =>
        key === "measureText"
          ? (text) => ({ width: text.length * 5 })
          : key === "createLinearGradient" || key === "createRadialGradient"
            ? () => ({ addColorStop() {} })
            : () => {},
      set: () => true,
    },
  );
  const doc = {
    getElementById(id) {
      if (!nodes.has(id))
        nodes.set(id, {
          open: false,
          getContext: () => ctx,
          showModal() {
            this.open = true;
          },
          close() {
            this.open = false;
          },
        });
      return nodes.get(id);
    },
  };
  const game = new Game(),
    playback = new Playback();
  game.units = [{ kind: "basic" }, { kind: "fast" }];
  const ui = createEnemyIntroductions(
    doc,
    playback,
    () => game,
    () => {},
  );
  assert.ok(ui.update(game));
  assert.equal(playback.paused, true);
  nodes.get("enemy-intro-close").onclick();
  assert.ok(ui.isOpen, "second new type must have its own tab");
  nodes.get("enemy-intro-close").onclick();
  assert.equal(playback.paused, false);
  assert.equal(ui.isOpen, false);
  playback.paused = true;
  game.units.push({ kind: "heavy" });
  ui.update(game);
  nodes.get("enemy-intro-close").onclick();
  assert.equal(playback.paused, true);
});
