import { METRO_ACCESS } from "../data/map.js";

export function drawStationClosure(ctx, game, reducedMotion = false) {
  if (
    game.phase !== "combat" ||
    game.result ||
    game.storyEvent?.id !== "station-closure"
  )
    return;
  ctx.save();
  ctx.translate(METRO_ACCESS.x, METRO_ACCESS.y);
  ctx.fillStyle = "#fffaf0";
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#b72d30";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-10, 10);
  ctx.lineTo(10, -10);
  ctx.stroke();
  ctx.translate(0, 28);
  ctx.fillStyle = "#24343d";
  ctx.fillRect(-45, -7, 90, 20);
  ctx.strokeStyle = "#f6d56c";
  ctx.lineWidth = 3;
  ctx.strokeRect(-45, -7, 90, 20);
  ctx.font = "bold 9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff4ce";
  ctx.fillText("METRO SOL CERRADO", 0, 6);
  for (let x = -35; x <= 35; x += 14) {
    ctx.fillStyle = "#e88b3f";
    ctx.beginPath();
    ctx.moveTo(x, 15);
    ctx.lineTo(x - 5, 29);
    ctx.lineTo(x + 5, 29);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#fff0bf";
    ctx.fillRect(x - 3, 23, 6, 2);
  }
  const offset = reducedMotion ? 0 : Math.sin(game.time * 3) * 3;
  ctx.fillStyle = game.storyEvent.signposted ? "#9de2c1" : "#ffe18a";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText("↑ PRECIADOS", offset, 43);
  ctx.restore();
}
