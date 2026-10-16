import { projectY } from "../data/map.js";
export function drawBuildingAmbient(ctx, building, time) {
  const level = building.level || 1;
  const x = building.x,
    y = projectY(building.y);
  if (building.type === "odor" && level >= 3) {
    ctx.save();
    ctx.translate(x + 20, y - 13);
    ctx.rotate(time * 5);
    ctx.fillStyle = "#a8c56a";
    for (let i = 0; i < 3; i++) {
      ctx.rotate((Math.PI * 2) / 3);
      ctx.beginPath();
      ctx.ellipse(4, 0, 6, 2.5, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return;
  }
  if (building.type === "speaker") {
    const pulse = Math.max(0, 1 - (time - (building.lastShot ?? -100)) / 0.4);
    if (!pulse) return;
    ctx.save();
    ctx.strokeStyle = ["#e1e8be", "#9bdeef", "#f5d26b"][level - 1];
    ctx.lineWidth = 1 + level * 0.5;
    for (let i = 0; i < level; i++) {
      ctx.globalAlpha = pulse * 0.75;
      ctx.beginPath();
      ctx.ellipse(
        x,
        y - 12,
        12 + (1 - pulse) * 25 + i * 9,
        7 + (1 - pulse) * 14 + i * 5,
        0,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
    ctx.restore();
    return;
  }
  if (
    building.type === "barrier" &&
    level >= 2 &&
    building.hp < building.maxHp
  ) {
    ctx.save();
    ctx.globalAlpha = 0.3 + Math.sin(time * 3) ** 2 * 0.4;
    ctx.fillStyle = "#d6dfc6";
    for (let i = 0; i < level; i++) ctx.fillRect(x - 12 + i * 12, y + 3, 2, 4);
    ctx.restore();
    return;
  }
  if (building.type !== "kitchen") return;
  ctx.save();
  ctx.strokeStyle = "#eeeada";
  ctx.lineWidth = 1;
  for (let i = 0; i < 2 + level; i++) {
    const age = (time * (0.25 + level * 0.1) + i / (2 + level)) % 1;
    ctx.globalAlpha = (1 - age) * 0.4;
    const x = building.x - 4 + i * 4,
      y = projectY(building.y) - 5 - age * (14 + level * 8);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - 4, y - 4, x + 5, y - 9, x + 2, y - 14);
    ctx.stroke();
  }
  ctx.restore();
}
