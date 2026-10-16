import { test } from "node:test";
import assert from "node:assert/strict";
import { spaceSpawns } from "../src/spawn-schedule.js";
import { Game } from "../src/engine.js";
import { AdminGame } from "../src/admin-game.js";
function check(spawns) {
  const last = new Map();
  for (const s of spawns) {
    if (last.has(s.entry)) assert.ok(s.at - last.get(s.entry) >= 0.95 - 1e-9);
    last.set(s.entry, s.at);
  }
}
test("spacing separates the same entrance while preserving simultaneous different streets and input data", () => {
  const input = [
    { entry: 0, at: 0 },
    { entry: 0, at: 0 },
    { entry: 1, at: 0 },
  ];
  const output = spaceSpawns(input);
  check(output);
  assert.equal(output.filter((s) => s.at === 0).length, 2);
  assert.deepEqual(
    input.map((s) => s.at),
    [0, 0, 0],
  );
});
test("normal waves, boss escorts and repeated sandbox sends respect entrance spacing", () => {
  for (let round = 1; round <= 20; round++) {
    const g = new Game();
    g.round = round;
    g.command({ type: "ready" });
    check(g.pending);
  }
  const g = new AdminGame();
  for (let i = 0; i < 2; i++)
    g.command({ type: "admin-spawn", kind: "basic", entry: 0, count: 5 });
  assert.equal(g.pending.length, 10);
  check(g.pending);
});
