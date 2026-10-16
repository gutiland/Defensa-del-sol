import { test } from "node:test";
import assert from "node:assert/strict";
import { nearestConstruction } from "../src/ui/construction-hit.js";
test("clicking tightly packed towers selects the nearest one regardless of creation order", () => {
  const a = { id: 1, x: 400, y: 280 },
    b = { id: 2, x: 442, y: 280 };
  const game = { base: { id: "base", x: 500, y: 340 }, buildings: [a, b] };
  assert.equal(nearestConstruction(game, 433, 280), b);
  assert.equal(nearestConstruction(game, 407, 280), a);
  assert.equal(nearestConstruction(game, 100, 100), null);
  assert.equal(
    nearestConstruction({ ...game, buildings: [a] }, 434, 280, 18),
    null,
    "placement clicks in a legal adjacent slot must not select the neighboring tower",
  );
});
