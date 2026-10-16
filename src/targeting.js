const routeLengths = new WeakMap();
export function remainingPathDistance(unit, base) {
  const route = unit.route || [];
  const index = Math.max(0, unit.routeIndex || 0);
  if (index >= route.length)
    return Math.max(0, Math.hypot(unit.x - base.x, unit.y - base.y) - 32);
  let suffix = routeLengths.get(route);
  if (!suffix) {
    suffix = new Array(route.length).fill(0);
    for (let i = route.length - 2; i >= 0; i--)
      suffix[i] =
        suffix[i + 1] +
        Math.hypot(route[i + 1].x - route[i].x, route[i + 1].y - route[i].y);
    routeLengths.set(route, suffix);
  }
  const point = route[index],
    last = route.at(-1);
  return (
    Math.hypot(point.x - unit.x, point.y - unit.y) +
    suffix[index] +
    Math.max(0, Math.hypot(last.x - base.x, last.y - base.y) - 32)
  );
}
export function priorityTarget(building, units, range, distances) {
  let target = null,
    nearest = Infinity;
  for (const u of units) {
    if (u.hp <= 0 || Math.hypot(u.x - building.x, u.y - building.y) >= range)
      continue;
    const remaining = distances.get(u);
    if (remaining < nearest || (remaining === nearest && u.id < target?.id)) {
      target = u;
      nearest = remaining;
    }
  }
  return target;
}
