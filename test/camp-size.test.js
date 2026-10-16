import { test } from "node:test";
import assert from "node:assert/strict";
import { checkCamp, preparedCamp } from "../scripts/camp-balance.js";
import { maxLevel } from "../src/data/weapons.js";

test("final wave defeats small fully upgraded mixed camps while a larger camp can win", () => {
  for (const count of [12, 19]) {
    const game = preparedCamp(count);
    assert.equal(game.buildings.length, count);
    assert.ok(
      game.buildings.every((b) => b.level === maxLevel(b.type) && b.branch),
    );
    assert.equal(checkCamp(count).result, "loss");
  }
  const larger = checkCamp(24);
  assert.equal(larger.result, "defense");
  assert.ok(larger.base > 0);
});
