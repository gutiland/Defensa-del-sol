import { projectY } from "./data/map.js";
export function footprint(unit) {
  const banner = (unit.role || unit.kind) === "heavy";
  const scale = unit.scale || (banner ? 1.15 : 1);
  return { x: (banner ? 49 : 18) * scale, y: (banner ? 42 : 30) * scale };
}
export function footprintsOverlap(a, b) {
  const x = footprint(a),
    y = footprint(b);
  return (
    ((a.x - b.x) / (x.x + y.x)) ** 2 +
      ((projectY(a.y) - projectY(b.y)) / (x.y + y.y)) ** 2 <
    1
  );
}
export function remainingDistance(unit) {
  let length = 0,
    previous = unit;
  for (const point of unit.route.slice(unit.routeIndex)) {
    length += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }
  return length;
}
export function crowdContact(unit, other, nx, ny, travel) {
  const a = footprint(unit),
    b = footprint(other),
    rx = a.x + b.x,
    ry = a.y + b.y;
  const ox = (unit.x - other.x) / rx,
    oy = (projectY(unit.y) - projectY(other.y)) / ry;
  const vx = nx / rx,
    vy = (ny * 0.66) / ry,
    A = vx * vx + vy * vy,
    B = ox * vx + oy * vy,
    C = ox * ox + oy * oy - 1;
  if (!A || B >= 0) return null;
  const discriminant = B * B - A * C;
  if (discriminant < 0) return null;
  const contact = Math.max(0, (-B - Math.sqrt(discriminant)) / A);
  return contact <= travel + 1e-6 ? contact : null;
}
