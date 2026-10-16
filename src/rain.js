// One deterministic slip per selected attacker, so weather never causes a stunlock.
export function advanceRainSlip(game, unit, dt) {
  if (game.storyEvent?.id !== "rain") return false;
  if (unit.slipRemaining > 0) {
    unit.slipRemaining = Math.max(0, unit.slipRemaining - dt);
    return true;
  }
  if (
    unit.slipUsed ||
    unit.id % 3 !== 0 ||
    unit.blockedBy ||
    unit.routeIndex >= unit.route.length
  )
    return false;
  unit.slipAt ??= game.time + 3 + (unit.id % 5) * 0.7;
  if (game.time < unit.slipAt) return false;
  unit.slipUsed = true;
  unit.slipRemaining = 1.6;
  unit.hp = Math.max(0, unit.hp - 6);
  unit.lastHit = game.time;
  return true;
}
