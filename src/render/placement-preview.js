import { projectY } from "../data/map.js";
import { BUILDINGS } from "../data/catalog.js";
import { drawDefenseStructure } from "./defense-structure.js";
import { buildingScale } from "../data/building-look.js";

export function drawPlacementPreview(ctx, preview, kind) {
  const y = projectY(preview.y);
  ctx.save();
  ctx.translate(preview.x, y);
  const scale = buildingScale({ level: 1 });
  ctx.scale(scale, scale);
  ctx.globalAlpha = preview.valid ? 0.6 : 0.3;
  drawDefenseStructure(ctx, kind, 1);
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = preview.valid ? "#c6f497" : "#ff8f7b";
  ctx.fillStyle = preview.valid ? "#b4de7620" : "#ff776630";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.ellipse(preview.x, y, 17, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#203527e8";
  ctx.fillRect(preview.x - 67, y + 35, 134, 22);
  ctx.fillStyle = preview.valid ? "#e0f4b4" : "#ffb7a5";
  ctx.fillText(
    preview.valid
      ? `${BUILDINGS[kind].cost} provisiones · colocar`
      : "Posición no disponible",
    preview.x,
    y + 50,
  );
  ctx.restore();
}
