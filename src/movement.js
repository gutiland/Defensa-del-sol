// Exhaust the approach route before targeting anything inside the plaza.
export function followRoute(unit, distance, barriers = []) {
  unit.blockedBy = null;
  unit.waiting = false;
  while (unit.routeIndex < unit.route.length) {
    const point = unit.route[unit.routeIndex];
    const dx = point.x - unit.x,
      dy = point.y - unit.y;
    const remaining = Math.hypot(dx, dy);
    if (remaining > 0) {
      const nx = dx / remaining,
        ny = dy / remaining,
        travel = Math.min(distance, remaining);
      let nearest = travel + 1,
        blocker = null;
      for (const barrier of barriers) {
        if (barrier.hp <= 0) continue;
        const ox = unit.x - barrier.x,
          oy = unit.y - barrier.y;
        const projection = ox * nx + oy * ny,
          discriminant =
            projection * projection - (ox * ox + oy * oy - 28 * 28);
        if (discriminant < 0 || projection >= 0) continue;
        const contact = Math.max(0, -projection - Math.sqrt(discriminant));
        if (contact <= travel + 1e-6 && contact < nearest) {
          nearest = contact;
          blocker = barrier;
        }
      }
      if (blocker) {
        unit.x += nx * nearest;
        unit.y += ny * nearest;
        unit.blockedBy = blocker.crowd ? null : blocker.id;
        unit.waiting = !!blocker.crowd;
        return false;
      }
    }
    if (remaining > distance) {
      unit.x += (dx / remaining) * distance;
      unit.y += (dy / remaining) * distance;
      return false;
    }
    unit.x = point.x;
    unit.y = point.y;
    distance -= remaining;
    unit.routeIndex++;
  }
  return true;
}
