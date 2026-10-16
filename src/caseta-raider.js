import { strikeTarget } from "./combat.js";

export function raidNearbyCaseta(game, unit, dt) {
  let target = null;
  let nearest = unit.raidRange;
  for (const building of game.buildings) {
    if (building.hp <= 0 || building.type === "barrier") continue;
    const distance = Math.hypot(unit.x - building.x, unit.y - building.y);
    if (
      distance < nearest ||
      (distance === nearest && building.id < target?.id)
    ) {
      target = building;
      nearest = distance;
    }
  }
  if (!target) {
    unit.raidingId = null;
    unit.raidWindup = 0;
    return false;
  }
  if (unit.raidingId !== target.id) {
    unit.raidingId = target.id;
    unit.raidWindup = 0.85;
  }
  unit.raidWindup = Math.max(0, unit.raidWindup - dt);
  if (unit.raidWindup === 0 && unit.cooldown <= 0) {
    strikeTarget(game, unit, target);
    unit.cooldown = 2.8;
    unit.raidWindup = 0.85;
  }
  return true;
}
