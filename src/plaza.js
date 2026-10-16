import { plazaPath } from "./placement.js";
import { stone, clipStreetCorridors } from "./render/materials.js";
import { STREETS } from "./data/map.js";
import { buildingBlock, label } from "./render/architecture.js";

function drawStreets(ctx) {
  ctx.lineCap = "round";
  for (const s of STREETS) {
    ctx.strokeStyle = "#64784b";
    ctx.lineWidth = s.width + 6;
    ctx.beginPath();
    ctx.moveTo(...s.from);
    for (const point of [...(s.via || []), s.to]) ctx.lineTo(...point);
    ctx.stroke();
    ctx.strokeStyle = "#b5b77d";
    ctx.lineWidth = s.width;
    ctx.stroke();
  }
}
function drawPaving(ctx) {
  ctx.save();
  plazaPath(ctx);
  ctx.clip();
  stone(ctx, 30, 90, 940, 490);
  ctx.strokeStyle = "#c3a46370";
  ctx.lineWidth = 1.3;
  for (let i = 0; i < 24; i++) {
    const a = (i * Math.PI) / 12;
    ctx.beginPath();
    ctx.moveTo(500 + 48 * Math.cos(a), 351 + 25 * Math.sin(a));
    ctx.lineTo(500 + 580 * Math.cos(a), 351 + 300 * Math.sin(a));
    ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = "#94988f";
  ctx.lineWidth = 1;
  plazaPath(ctx);
  ctx.stroke();
  // Separate segments reflect the northern bank line and leave pedestrian gaps.
  ctx.strokeStyle = "#a5a79e";
  ctx.lineWidth = 7;
  for (let i = 0; i < 8; i++) {
    const a = Math.PI + (i * Math.PI) / 8;
    ctx.beginPath();
    ctx.ellipse(500, 455, 420, 320, 0, a + 0.035, a + Math.PI / 8 - 0.035);
    ctx.stroke();
  }
}
export function drawPlaza(ctx) {
  ctx.save();
  ctx.fillStyle = "#77935e";
  ctx.fillRect(0, 0, 1000, 680);
  // Small background roofs make the surrounding city read as a continuous fabric.
  for (let y = 0; y < 680; y += 78)
    for (let x = 0; x < 1000; x += 103) {
      ctx.fillStyle = (x + y) % 2 ? "#8f9d68" : "#a0ab76";
      ctx.fillRect(x + 5, y + 5, 91, 66);
      ctx.strokeStyle = "#677c4a";
      ctx.strokeRect(x + 13, y + 13, 75, 50);
    }

  const blocks = [
    { x: 36, y: 300, w: 102, h: 70, color: "#e3bd7d" },
    { x: 125, y: 210, w: 95, h: 76, color: "#ca9270" },
    { x: 280, y: 125, w: 80, h: 77, color: "#efd092" },
    { x: 500, y: 95, w: 134, h: 82, color: "#e4c188", name: "SOL" },
    { x: 735, y: 130, w: 119, h: 77, color: "#c99470" },
    { x: 920, y: 235, w: 88, h: 73, color: "#e6ce96" },
    { x: 110, y: 667, w: 104, h: 74, color: "#d4b681" },
    { x: 690, y: 667, w: 101, h: 76, color: "#c89972" },
    { x: 910, y: 667, w: 116, h: 77, color: "#d7bf86" },
  ];
  ctx.save();
  clipStreetCorridors(ctx, STREETS);
  for (const b of blocks) buildingBlock(ctx, b);
  // The clock and brick facade face the plaza, with Carretas to the east.
  buildingBlock(ctx, {
    x: 449,
    y: 671,
    w: 236,
    h: 60,
    color: "#c78162",
    name: "REAL CASA DE CORREOS",
    clock: true,
  });
  ctx.restore();
  drawStreets(ctx);
  drawPaving(ctx);
  label(ctx, "KIL\u00d3METRO 0", 449, 596, 8);
  ctx.strokeStyle = "#a99572";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(438, 584);
  ctx.lineTo(449, 575);
  ctx.lineTo(460, 584);
  ctx.lineTo(449, 593);
  ctx.closePath();
  ctx.stroke();

  // The familiar rooftop sign is exaggerated for the caricature.
  label(ctx, "T\u00cdO PEPE", 135, 118, 12, "#8e433e");
  label(ctx, "PUERTA DEL SOL", 105, 46, 16);
  label(ctx, "MADRID - VISTA TACTICA", 105, 63, 8);
  label(ctx, "N", 957, 47, 13);
  ctx.strokeStyle = "#665a48";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(957, 80);
  ctx.lineTo(957, 57);
  ctx.lineTo(952, 64);
  ctx.moveTo(957, 57);
  ctx.lineTo(962, 64);
  ctx.stroke();
  ctx.restore();
}
