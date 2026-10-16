import { onPath } from "./data/routes.js";
import { COPY } from "./data/copy.js";
import { projectY } from "./data/map.js";

const curves = [
  [
    [40, 455],
    [60, 230],
    [270, 95],
    [500, 100],
  ],
  [
    [500, 100],
    [730, 95],
    [940, 230],
    [960, 455],
  ],
];
export function plazaPath(ctx) {
  ctx.beginPath();
  ctx.moveTo(...curves[0][0]);
  for (const [, a, b, c] of curves) ctx.bezierCurveTo(...a, ...b, ...c);
  ctx.lineTo(915, 575);
  ctx.lineTo(85, 575);
  ctx.closePath();
}
const boundary = curves
  .flatMap((points) =>
    Array.from({ length: 41 }, (_, i) => {
      const t = i / 40,
        v = 1 - t;
      return [0, 1].map(
        (axis) =>
          v ** 3 * points[0][axis] +
          3 * v * v * t * points[1][axis] +
          3 * v * t * t * points[2][axis] +
          t ** 3 * points[3][axis],
      );
    }),
  )
  .concat([
    [915, 575],
    [85, 575],
  ]);
function inside(x, y) {
  let result = false;
  for (let i = 0, j = boundary.length - 1; i < boundary.length; j = i++) {
    const [ax, ay] = boundary[i],
      [bx, by] = boundary[j];
    if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax)
      result = !result;
  }
  return result;
}
const landmarks = [
  { x: 585, y: 416, rx: 64, ry: 32 },
  { x: 713, y: 473, rx: 55, ry: 28 },
  { x: 845, y: 314, rx: 24, ry: 30 },
  { x: 149, y: 316, rx: 20, ry: 24 },
];
export function placementError(game, x, y, kind = "tent") {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return COPY.placement.invalid;
  const py = projectY(y);
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    if (!inside(x + 22 * Math.cos(a), py + 16 * Math.sin(a)))
      return COPY.placement.outside;
  }
  if (kind === "barrier" && !onPath(x, py))
    return "La barricada va sobre el camino";
  if (kind !== "barrier" && onPath(x, py, 14))
    return "Camino reservado: construye a los lados";
  if (
    landmarks.some(
      (b) =>
        ((x - b.x) / (b.rx + 20)) ** 2 + ((py - b.y) / (b.ry + 15)) ** 2 < 1,
    )
  )
    return COPY.placement.landmark;
  if (
    [game.base, ...game.buildings].some((b) => {
      const base = b.id === "base";
      return (
        ((x - b.x) / (base ? 58 : 34)) ** 2 +
          ((py - projectY(b.y)) / (base ? 40 : 24)) ** 2 <
        1
      );
    })
  )
    return COPY.placement.overlap;
  return null;
}
