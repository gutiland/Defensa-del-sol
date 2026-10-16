export const ODOR_RADIUS = 95;
export const LIVE_RADIUS = 65;
export const odorStats = (building) => ({
  radius:
    ODOR_RADIUS +
    15 * (building.level - 1) +
    (building.branch === "rapid" ? 45 : 0),
  dps: 2 + (building.level - 1) + (building.branch === "power" ? 2 : 0),
});
export function stereotypeState(game, unit, sources) {
  let odor = 0,
    sourceId;
  for (const b of sources?.odors || game.buildings) {
    if (b.type !== "odor" || b.hp <= 0) continue;
    const stats = odorStats(b);
    if (
      Math.hypot(unit.x - b.x, unit.y - b.y) < stats.radius &&
      stats.dps > odor
    ) {
      odor = stats.dps;
      sourceId = b.id;
    }
  }
  const stinky = odor > 0;
  const perfumed = unit.kind === "perfume";
  const hyped =
    unit.kind !== "fast" &&
    (sources?.runners || game.units).some(
      (other) =>
        other !== unit &&
        other.kind === "fast" &&
        other.hp > 0 &&
        Math.hypot(unit.x - other.x, unit.y - other.y) < LIVE_RADIUS,
    );
  return {
    stinky: stinky && !perfumed,
    perfumed,
    hyped,
    multiplier: hyped ? 1.25 : 1,
    dps: perfumed ? 0 : odor,
    sourceId,
  };
}
