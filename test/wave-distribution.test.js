import { test } from "node:test";
import assert from "node:assert/strict";
import { normalWave } from "../src/data/waves.js";
test("each enemy class is balanced across the round's entrances instead of forming one single-street column", () => {
  for (let round = 1; round <= 20; round++) {
    const wave = normalWave(round, 11);
    for (const kind of new Set(wave.map((u) => u.kind))) {
      const counts = new Map();
      for (const u of wave.filter((u) => u.kind === kind))
        counts.set(u.entry, (counts.get(u.entry) || 0) + 1);
      assert.ok(
        counts.size >= Math.min(2, wave.filter((u) => u.kind === kind).length),
      );
      assert.ok(
        Math.max(...counts.values()) - Math.min(...counts.values()) <= 1,
      );
    }
    assert.deepEqual(
      normalWave(round, 11),
      wave,
      "replaying a wave preserves distribution",
    );
  }
  assert.equal(new Set(normalWave(1, 11).map((u) => u.entry)).size, 2);
  assert.equal(new Set(normalWave(20, 11).map((u) => u.entry)).size, 11);
});
