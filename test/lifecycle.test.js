import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { AdminGame } from "../src/admin-game.js";
import { defenderPose } from "../src/render/poses.js";
import { createDeathAnimations } from "../src/render/deaths.js";

test("invalid commands cannot poison budgets or create inherited catalog entries", () => {
  for (const game of [new Game(), new Game("attack"), new AdminGame()]) {
    const budget = game.money;
    for (const command of [
      null,
      undefined,
      1,
      "ready",
      {},
      [],
      { type: "build", kind: "constructor", x: 400, y: 280 },
      { type: "build", kind: "toString", x: 400, y: 280 },
      { type: "recruit", kind: "constructor", entry: 0 },
      { type: "recruit", kind: "basic", entry: "length" },
      { type: "recruit", kind: "basic", entry: "0" },
      { type: "recruit", kind: "basic", entry: NaN },
    ])
      assert.equal(game.command(command), false);
    assert.equal(game.money, budget);
    assert.equal(game.buildings.length, game.mode === "attack" ? 3 : 0);
    assert.equal(game.queue.length, 0);
  }
});

test("each fight starts with fresh defender cooldowns and visual timestamps", () => {
  const game = new Game();
  game.base.lastHit = 20;
  game.base.lastShot = 19;
  game.base.cooldown = 0.7;
  game.command({ type: "ready" });
  assert.equal(game.base.lastHit, undefined);
  assert.equal(game.base.lastShot, undefined);
  assert.equal(game.base.cooldown, 0);
  const pose = defenderPose(game.base, 0);
  assert.equal(pose.hit, false);
  assert.equal(pose.release, 0);
  assert.equal(pose.windup, 0);
  const admin = new AdminGame();
  admin.base.lastHit = 50;
  admin.base.cooldown = 1;
  admin.command({ type: "admin-spawn", kind: "basic", entry: 0, count: 1 });
  assert.equal(admin.base.lastHit, undefined);
  assert.equal(admin.base.cooldown, 0);
  admin.base.hp = 0;
  admin.result = "loss";
  admin.command({ type: "admin-stop" });
  assert.equal(admin.command({ type: "ready" }), false);
  assert.ok(admin.command({ type: "admin-heal" }));
  assert.ok(admin.command({ type: "ready" }));
});

test("sandbox clear cancels death animation and reset allows reused unit identifiers", () => {
  const game = new AdminGame(),
    draw = createDeathAnimations(() => ({ getContext: () => ctx }));
  let calls = 0;
  const ctx = new Proxy(
    {},
    {
      get: (_, key) =>
        key === "measureText"
          ? (text) => ({ width: text.length * 5 })
          : key === "createLinearGradient" || key === "createRadialGradient"
            ? () => ({ addColorStop() {} })
            : () => {
                calls++;
              },
      set: () => true,
    },
  );
  const death = { id: 1, character: "polo", kind: "basic", x: 300, y: 300 };
  game.deaths.push(death);
  draw(ctx, game, 0.05);
  assert.ok(calls > 0);
  calls = 0;
  game.command({ type: "admin-clear" });
  draw(ctx, game, 0);
  assert.equal(calls, 0);
  game.command({ type: "admin-reset" });
  game.deaths.push(death);
  draw(ctx, game, 0.05);
  assert.ok(calls > 0);
});
