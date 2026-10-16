import { STREETS, projectY, unprojectY } from "./map.js";
export const BASE_POSITION = { x: 500, y: 340 };
const goal = [BASE_POSITION.x, projectY(BASE_POSITION.y)];
export const PATH_WIDTH = 24;
// A shared winding corridor; every entrance joins at the same point.
const finalAnchors = [[350, 260], [520, 260], [560, 300], goal];
const westernLoop = [
  [280, 420],
  [350, 460],
  [420, 440],
  [420, 390],
  [340, 360],
  [300, 300],
];
// Sample rounded corners so drawing, placement and movement use identical paths.
export function roundCorners(points, radius = 26) {
  const result = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1],
      b = points[i],
      c = points[i + 1];
    const incoming = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const outgoing = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const r = Math.min(radius, incoming / 3, outgoing / 3);
    if (!r) {
      result.push(b);
      continue;
    }
    const p = [
      b[0] + ((a[0] - b[0]) * r) / incoming,
      b[1] + ((a[1] - b[1]) * r) / incoming,
    ];
    const q = [
      b[0] + ((c[0] - b[0]) * r) / outgoing,
      b[1] + ((c[1] - b[1]) * r) / outgoing,
    ];
    result.push(p);
    for (let j = 1; j <= 5; j++) {
      const t = j / 5,
        v = 1 - t;
      result.push([
        v * v * p[0] + 2 * v * t * b[0] + t * t * q[0],
        v * v * p[1] + 2 * v * t * b[1] + t * t * q[1],
      ]);
    }
  }
  result.push(points.at(-1));
  return result;
}
export const FINAL_PATH = roundCorners(finalAnchors);
const west = [
  [190, 420],
  [230, 470],
];
const north = [[260, 235], [205, 300], ...west];
const east = [
  [820, 390],
  [760, 300],
  [650, 235],
  [620, 270],
  [610, 320],
  [640, 360],
  [650, 450],
  [540, 490],
  [460, 480],
  [420, 440],
  [420, 390],
  [340, 360],
  [300, 300],
];
export function streetRoute(street) {
  let trunk;
  if (street.name === "ARENAL") trunk = [...west, ...westernLoop];
  else if (street.name === "MAYOR")
    trunk = [[190, 460], [230, 470], ...westernLoop];
  else if (["PRECIADOS", "CARMEN"].includes(street.name))
    trunk = [...north, ...westernLoop];
  else if (street.name === "MONTERA")
    trunk = [[650, 235], [500, 215], [380, 230], ...north, ...westernLoop];
  else if (street.name === "CORREO")
    trunk = [[260, 490], [230, 470], ...westernLoop];
  else if (street.name === "CARRETAS")
    trunk = [
      [520, 490],
      [420, 490],
      [350, 490],
      [280, 460],
      [240, 400],
      [260, 340],
      [300, 300],
    ];
  else if (street.name === "ESPOZ Y MINA")
    trunk = [[800, 510], [825, 440], ...east];
  else trunk = east;
  return [
    street.from,
    ...(street.via || []),
    ...roundCorners([street.to, ...trunk, finalAnchors[0]]).slice(0, -1),
    ...FINAL_PATH,
  ];
}
export const ROUTES = STREETS.map(streetRoute);
export const worldRoute = (index) => {
  const points = ROUTES[index]
    .slice(1)
    .map(([x, y]) => ({ x, y: unprojectY(y) }));
  const before = points[points.length - 2];
  const dx = before.x - BASE_POSITION.x,
    dy = before.y - BASE_POSITION.y,
    length = Math.hypot(dx, dy);
  points[points.length - 1] = {
    x: BASE_POSITION.x + (dx / length) * 28,
    y: BASE_POSITION.y + (dy / length) * 28,
  };
  return points;
};
export function distanceToSegment(x, y, a, b) {
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    length = dx * dx + dy * dy;
  const t = length
    ? Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / length))
    : 0;
  return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy);
}
export function onPath(x, y, clearance = 0) {
  return ROUTES.some((points) =>
    points.some(
      (point, i) =>
        i > 0 &&
        distanceToSegment(x, y, points[i - 1], point) <
          PATH_WIDTH / 2 + clearance,
    ),
  );
}
