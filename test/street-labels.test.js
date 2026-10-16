import { test } from "node:test";
import assert from "node:assert/strict";
import { streetLabelLayout } from "../src/render/street-labels.js";
import { ROUTES, distanceToSegment } from "../src/data/routes.js";
import { STREETS } from "../src/data/map.js";
test("all street plaques stay within the map and clear the playable paths", () => {
  const boxes = streetLabelLayout((s) => s.length * 7);
  assert.equal(boxes.length, STREETS.length);
  for (const b of boxes) {
    assert.ok(b.x - b.width / 2 >= 0 && b.x + b.width / 2 <= 1000);
    assert.ok(b.y - b.height / 2 >= 0 && b.y + b.height / 2 <= 680);
    for (let x = b.x - b.width / 2; x <= b.x + b.width / 2; x += 3)
      for (let y = b.y - b.height / 2; y <= b.y + b.height / 2; y += 3)
        for (const route of ROUTES)
          for (let i = 1; i < route.length; i++)
            assert.ok(
              distanceToSegment(x, y, route[i - 1], route[i]) >= 16,
              b.name,
            );
  }
});
