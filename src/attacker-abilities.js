export const isEnraged = (u) =>
  u.kind === "berserker" && u.hp > 0 && u.hp < u.maxHp / 2;
export function advanceAttackerAbility(u, dt) {
  if (u.hp > 0 && u.kind === "medic") u.hp = Math.min(u.maxHp, u.hp + 5 * dt);
}
export const attackerSpeedMultiplier = (u) => (isEnraged(u) ? 1.6 : 1);
