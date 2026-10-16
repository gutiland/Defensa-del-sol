import { test } from "node:test";
import assert from "node:assert/strict";
import { createAudio } from "../src/ui/audio.js";
import { Game } from "../src/engine.js";
import { soundForEffect } from "../src/audio-events.js";
import { strikeTarget, resolveProjectiles } from "../src/combat.js";

function fixture() {
  const started = [],
    gains = [];
  const parameter = () => ({
    value: 0,
    values: [],
    setValueAtTime(value) {
      this.value = value;
      this.values.push(value);
    },
    exponentialRampToValueAtTime(value) {
      this.value = value;
      this.values.push(value);
    },
  });
  const node = () => ({
    connect() {},
    disconnect() {},
    start() {
      started.push(this);
    },
    stop(at) {
      if (at === undefined) {
        this.cancelled = true;
        this.onended?.();
      }
    },
  });
  const context = {
    state: "suspended",
    currentTime: 1,
    sampleRate: 1000,
    destination: {},
    async resume() {
      this.state = "running";
    },
    createGain() {
      const n = { ...node(), gain: parameter() };
      gains.push(n);
      return n;
    },
    createOscillator() {
      return { ...node(), frequency: parameter() };
    },
    createBuffer(channels, length) {
      return { getChannelData: () => new Float32Array(length) };
    },
    createBufferSource: node,
    createBiquadFilter() {
      return { ...node(), frequency: parameter() };
    },
  };
  const nodes = new Map(),
    document = {
      getElementById(id) {
        if (!nodes.has(id)) nodes.set(id, { setAttribute() {} });
        return nodes.get(id);
      },
    };
  let created = 0;
  const audio = createAudio(document, {
    createContext() {
      created++;
      return context;
    },
  });
  return {
    audio,
    context,
    started,
    gains,
    nodes,
    get created() {
      return created;
    },
  };
}

test("audio starts only after unlock and respects volume and immediate mute", async () => {
  const f = fixture();
  f.audio.play("build");
  assert.equal(f.created, 0);
  assert.equal(f.started.length, 0);
  await f.audio.unlock();
  assert.equal(f.created, 1);
  f.audio.action("build");
  assert.ok(f.started.length > 0);
  const before = f.started.length;
  f.nodes.get("sound-volume").value = "0";
  f.nodes.get("sound-volume").oninput();
  f.audio.play("kill");
  assert.equal(f.started.length, before);
  assert.equal(f.gains[0].gain.value, 0);
  f.nodes.get("sound-volume").value = "50";
  f.nodes.get("sound-volume").oninput();
  assert.equal(f.gains[0].gain.value, 0.5);
  f.nodes.get("sound").onclick();
  assert.equal(f.gains[0].gain.value, 0);
  f.audio.play("recruit");
  assert.equal(f.started.length, before);
  f.nodes.get("sound").onclick();
  f.audio.play("recruit");
  assert.ok(f.started.length > before);
});

test("combat audio deduplicates effects, skips paused events and announces phase changes", async () => {
  const f = fixture(),
    game = new Game();
  await f.audio.unlock();
  f.audio.update(game);
  game.effects = [{ type: "impact", weaponType: "bottle" }];
  f.audio.update(game);
  const hit = f.started.length;
  assert.ok(hit > 0);
  f.context.currentTime += 1;
  f.audio.update(game);
  assert.equal(f.started.length, hit);
  game.effects.push({ type: "stone" });
  f.audio.update(game, { paused: true });
  f.audio.update(game);
  assert.equal(f.started.length, hit);
  game.phase = "combat";
  f.audio.update(game);
  assert.ok(f.started.length > hit);
  const wave = f.started.length;
  game.round++;
  game.phase = "build";
  f.audio.update(game);
  assert.ok(f.started.length > wave);
  f.context.currentTime += 1;
  const clear = f.started.length;
  game.result = "loss";
  f.audio.update(game);
  assert.ok(f.started.length > clear);
  const result = f.started.length;
  f.audio.update(game);
  assert.equal(f.started.length, result);
});

test("real combat events distinguish wood, stone sizes, glass and molotov ignition", () => {
  const game = new Game();
  strikeTarget(
    game,
    { cooldown: 0, damage: 1, x: 0, y: 0 },
    { type: "barrier", hp: 100, x: 0, y: 0 },
  );
  assert.equal(soundForEffect(game.effects.at(-1)), "wood");
  for (const [type, cue] of [
    ["stone", "stone"],
    ["big-stone", "heavyStone"],
    ["bottle", "bottle"],
    ["molotov", "fire"],
  ]) {
    game.units = [{ id: 1, hp: 100, x: 0, y: 0 }];
    game.projectiles = [
      { life: 0, targetId: 1, tx: 0, ty: 0, weapon: { type, damage: 1 } },
    ];
    resolveProjectiles(game, 0.01);
    assert.equal(soundForEffect(game.effects.at(-1)), cue);
    assert.equal(
      soundForEffect({ type }),
      "throw",
      "launch and impact must not share the material impact sound",
    );
  }
});

test("quiet murmurs are bounded by time rather than crowd size and cancel on pause and round end", async () => {
  const f = fixture(),
    game = new Game();
  await f.audio.unlock();
  game.phase = "combat";
  game.units = [{ kind: "basic" }];
  f.audio.update(game);
  assert.equal(f.started.length, 3);
  assert.ok(
    f.gains.slice(3).every((gain) => Math.max(...gain.gain.values) <= 0.01),
  );
  const voices = [...f.started];
  f.audio.update(game, { paused: true });
  assert.ok(voices.every((source) => source.cancelled));
  f.context.currentTime += 2;
  game.units = Array.from({ length: 200 }, () => ({ kind: "basic" }));
  f.audio.update(game);
  assert.equal(f.started.length, 6);
  game.phase = "build";
  f.audio.update(game);
  assert.ok(f.started.every((source) => source.cancelled));
});

test("important cues can preempt ordinary voices in a saturated battle", async () => {
  const f = fixture();
  await f.audio.unlock();
  for (let i = 0; i < 20; i++) {
    f.context.currentTime += 1;
    f.audio.play("bottle");
  }
  const before = f.started.length;
  assert.ok(before > 0);
  f.audio.play("bossClear");
  assert.ok(
    f.started.length > before,
    "boss defeat must remain audible when ordinary voices are saturated",
  );
  assert.ok(f.started.slice(0, before).some((source) => source.cancelled));
});

test("each ordinary defeat gets a varied comic sound without replaying on refresh or resume", async () => {
  const f = fixture(),
    game = new Game();
  await f.audio.unlock();
  f.audio.update(game);
  game.kills = 3;
  f.audio.update(game);
  assert.equal(
    f.started.length,
    3,
    "three simultaneous defeats should produce three short sounds",
  );
  assert.equal(
    new Set(f.started.map((source) => source.frequency.values[0])).size,
    3,
  );
  f.audio.update(game);
  assert.equal(f.started.length, 3);
  game.kills += 2;
  f.audio.update(game, { paused: true });
  f.audio.update(game);
  assert.equal(f.started.length, 3, "paused deaths must not create a backlog");
  game.kills += 100;
  f.audio.update(game);
  assert.ok(
    f.started.length > 3 && f.started.length <= 11,
    "mass defeats must have a bounded audio burst",
  );
  f.nodes.get("sound").onclick();
  const muted = f.started.length;
  game.kills++;
  f.audio.update(game);
  assert.equal(f.started.length, muted);
});
