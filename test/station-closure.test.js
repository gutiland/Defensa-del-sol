import { test } from "node:test";
import assert from "node:assert/strict";
import { Game, ENTRIES } from "../src/engine.js";
import { saveCampaign, loadCampaign } from "../src/campaign-save.js";

function start(option) {
  const game = new Game();
  game.round = 17;
  game.money = 300;
  if (option) assert.ok(game.command({ type: "story-choice", option }));
  assert.ok(game.command({ type: "ready" }));
  return game;
}

test("station closure routes the whole army through Preciados; paid access control delays it by twelve seconds", () => {
  const free = start(),
    paid = start("signpost"),
    repeated = start();
  assert.equal(free.money - paid.money, 180);
  assert.equal(free.storyEvent.wholeRound, true);
  assert.deepEqual(free.pending, repeated.pending);
  assert.deepEqual(
    [...new Set(free.pending.map((u) => u.entry))].sort((a, b) => a - b),
    [2],
  );
  assert.equal(ENTRIES[2].name, "Preciados");
  assert.ok(paid.pending.every((u) => u.entry === 2));
  paid.pending.forEach((unit, index) =>
    assert.ok(Math.abs(unit.at - free.pending[index].at - 12) < 1e-8),
  );
  assert.deepEqual(
    free.pending.map((u) => u.kind).sort(),
    paid.pending.map((u) => u.kind).sort(),
  );
  for (const game of [free, paid]) {
    const last = new Map();
    for (const unit of game.pending) {
      assert.ok(unit.entry >= 0 && unit.entry < ENTRIES.length);
      if (last.has(unit.entry))
        assert.ok(unit.at - last.get(unit.entry) >= 0.95 - 1e-8);
      last.set(unit.entry, unit.at);
    }
    game.pending = [];
    game.units = [];
    game.tick(0.05);
    assert.equal(game.round, 18);
    assert.equal(game.storyEvent, null);
  }
});

test("station signage validates budget and cannot be bought twice or during combat", () => {
  const game = new Game();
  game.round = 17;
  game.money = 179;
  assert.equal(
    game.command({ type: "story-choice", option: "signpost" }),
    false,
  );
  assert.equal(game.money, 179);
  game.money = 180;
  assert.ok(game.command({ type: "story-choice", option: "signpost" }));
  assert.equal(game.money, 0);
  assert.equal(
    game.command({ type: "story-choice", option: "signpost" }),
    false,
  );
  game.command({ type: "ready" });
  assert.equal(game.command({ type: "story-choice", option: "detour" }), false);
  for (const mode of ["attack", "local"]) {
    const other = new Game(mode);
    other.round = 17;
    assert.equal(
      other.command({ type: "story-choice", option: "signpost" }),
      false,
    );
  }
});

test("campaign checkpoint retains four event decisions and does not charge restored signage again", () => {
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
    game.round = 17;
    game.defendedWaves = 16;
    game.storyChoices = {
      4: "debate",
      9: "cover",
      15: "organize",
      17: "signpost",
    };
    assert.ok(saveCampaign(game));
    const restored = loadCampaign();
    assert.ok(restored);
    assert.deepEqual(restored.storyChoices, game.storyChoices);
    const money = restored.money;
    restored.command({ type: "ready" });
    assert.equal(restored.money, money);
    assert.equal(restored.storyEvent.signposted, true);
  } finally {
    if (old === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = old;
  }
});
