import { projectY } from "../data/map.js";
export function drawBuildingAmbient(ctx, building, time) {
  if (building.type !== "kitchen") return;
  ctx.save();
  ctx.strokeStyle = "#eeeada";
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    const age = (time * 0.35 + i / 3) % 1;
    ctx.globalAlpha = (1 - age) * 0.4;
    const x = building.x - 4 + i * 4,
      y = projectY(building.y) - 5 - age * 21;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - 4, y - 4, x + 5, y - 9, x + 2, y - 14);
    ctx.stroke();
  }
  ctx.restore();
}
