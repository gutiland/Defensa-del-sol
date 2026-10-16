import { TENT_WEAPONS, AREA_WEAPONS } from "../data/weapons.js";
import { drawWeapon } from "./weapon-art.js";

export function defenderPose(building, time) {
  const since = time - (building.lastShot ?? -100);
  return {
    moving: false,
    release: since >= 0 && since < 0.42 ? (1 - since / 0.42) ** 2 : 0,
    windup:
      building.cooldown > 0 && building.cooldown < 0.26
        ? 1 - building.cooldown / 0.26
        : 0,
    weapon:
      building.type === "tent"
        ? TENT_WEAPONS[building.level - 1].type
        : building.type === "area"
          ? AREA_WEAPONS[building.level - 1].type
          : null,
    hit:
      time >= (building.lastHit ?? -100) &&
      time - (building.lastHit ?? -100) < 0.14,
  };
}
export function drawAttackPose(ctx, pose, role) {
  if (pose.weapon) {
    const load = pose.windup || 0,
      release = pose.release || 0;
    const x = release ? 12 + release * 10 : 10 - load * 16,
      y = release ? -10 - release * 8 : 4 - load * 24;
    ctx.strokeStyle = "#bb967b";
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(8, -1);
    ctx.lineTo(x - 2, y + 5);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!release) drawWeapon(ctx, pose.weapon, x, y, 0.8);
  } else if ((role === "speaker" || role === "base") && pose.release) {
    ctx.strokeStyle = "#ddce9c";
    ctx.lineWidth = 1;
    ctx.globalAlpha = pose.release;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.arc(29, -10, 10 + (1 - pose.release) * 12 + i * 5, -0.6, 0.6);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}
