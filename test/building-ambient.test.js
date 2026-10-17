import { test } from "node:test";
import assert from "node:assert/strict";
import { drawBuildingAmbient } from "../src/render/ambient.js";
import { buildingScale } from "../src/data/building-look.js";
import { projectY } from "../src/data/map.js";

function recorder() {
  const ellipses = [],
    translations = [],
    scales = [];
  const ctx = new Proxy(
    {},
    {
      get: (_, key) =>
        key === "ellipse"
          ? (...args) => ellipses.push(args)
          : key === "translate"
            ? (...args) => translations.push(args)
            : key === "scale"
              ? (...args) => scales.push(args)
              : () => {},
      set: () => true,
    },
  );
  return { ctx, ellipses, translations, scales };
}

test("radio waves follow combat time independently of the animation clock", () => {
  const { ctx, ellipses } = recorder();
  const building = { type: "speaker", level: 3, x: 200, y: 400, lastShot: 12 };
  drawBuildingAmbient(ctx, building, 90, 12.2);
  assert.equal(ellipses.length, 3);
  assert.ok(ellipses.every((args) => args[2] > 0 && args[3] > 0));
  ellipses.length = 0;
  drawBuildingAmbient(ctx, building, 90, 13);
  drawBuildingAmbient(ctx, building, 0, 11);
  drawBuildingAmbient(ctx, building, 0, 12.2, true);
  assert.equal(ellipses.length, 0);
});

test("odor fan stays aligned with its scaled shelter", () => {
  const { ctx, translations, scales } = recorder();
  const building = { id: 1, type: "odor", level: 3, x: 200, y: 400 };
  drawBuildingAmbient(ctx, building, 10);
  const scale = buildingScale(building);
  assert.deepEqual(translations[0], [
    200 + 25 * scale,
    projectY(400) - 13 * scale,
  ]);
  assert.deepEqual(scales[0], [scale, scale]);
});
