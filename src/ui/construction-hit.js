export function nearestConstruction(game, x, y, radius = 35) {
  let best = null,
    distance = radius;
  for (const b of [game.base, ...game.buildings]) {
    const d = Math.hypot(b.x - x, b.y - y);
    if (d < distance) {
      best = b;
      distance = d;
    }
  }
  return best;
}
