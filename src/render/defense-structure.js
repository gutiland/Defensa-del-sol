import { drawCampingTent } from "./tent.js";
import { drawCampStructure } from "./camp.js";
import { drawWeaponStock, drawWeapon } from "./weapon-art.js";
import { AREA_WEAPONS } from "../data/weapons.js";

function canvasShelter(ctx, color, roof, level) {
  ctx.fillStyle = color;
  ctx.strokeStyle = "#324332";
  ctx.lineWidth = 2.3;
  ctx.fillRect(-29, -2, 58, 26);
  ctx.strokeRect(-29, -2, 58, 26);
  ctx.beginPath();
  ctx.moveTo(-37, 0);
  if (roof === "dome") {
    ctx.bezierCurveTo(-35, -46, 35, -46, 37, 0);
  } else if (roof === "ridge") {
    ctx.lineTo(-15, -34);
    ctx.lineTo(35, -17);
    ctx.lineTo(37, 0);
  } else {
    ctx.lineTo(0, -41);
    ctx.lineTo(37, 0);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#29382e";
  ctx.beginPath();
  ctx.moveTo(-8, 24);
  ctx.lineTo(-7, 1);
  ctx.lineTo(9, 1);
  ctx.lineTo(12, 24);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#e8d8ae";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-30, -1);
  ctx.lineTo(-30, 24);
  ctx.moveTo(29, 0);
  ctx.lineTo(29, 23);
  ctx.stroke();
  ctx.strokeStyle = "#917c50";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-34, 0);
  ctx.lineTo(-41, 27);
  ctx.moveTo(34, 0);
  ctx.lineTo(42, 27);
  ctx.stroke();
  ctx.fillStyle = level === 1 ? "#a89976" : "#ead9a4";
  ctx.fillRect(-25, 9, 9, 7);
  if (level >= 2) {
    ctx.strokeStyle = "#ecdeb7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-37, 0);
    ctx.lineTo(37, 0);
    ctx.stroke();
  }
  if (level >= 3) {
    ctx.fillStyle = "#c29c66";
    ctx.fillRect(-35, 24, 70, 5);
  }
}
export function drawDefenseStructure(ctx, type, level = 1, base = false) {
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = "#324332";
  ctx.lineWidth = 2;
  if (base || type === "tent") {
    drawCampingTent(ctx, base, level);
    drawWeaponStock(ctx, level);
    if (base) {
      ctx.strokeStyle = "#654d39";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-20, -7);
      ctx.lineTo(-20, -51);
      ctx.stroke();
      ctx.fillStyle = "#d37a45";
      ctx.beginPath();
      ctx.moveTo(-20, -51);
      ctx.lineTo(7, -48);
      ctx.lineTo(1, -37);
      ctx.lineTo(-20, -39);
      ctx.closePath();
      ctx.fill();
    }
  } else if (type === "area") {
    canvasShelter(ctx, "#ab78ab", "ridge", level);
    ctx.fillStyle = "#73523f";
    ctx.fillRect(-30, 16, 59, 7);
    ctx.strokeRect(-30, 16, 59, 7);
    for (let i = 0; i < (level > 1 ? 3 : 2); i++)
      drawWeapon(ctx, AREA_WEAPONS[level - 1].type, -20 + i * 18, 14, 0.85);
    ctx.fillStyle = "#f0c9ea";
    for (const [x, y] of [
      [-16, -15],
      [12, -12],
      [22, -6],
    ]) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === "odor") {
    canvasShelter(ctx, "#8f9d50", "dome", level);
    ctx.strokeStyle = "#7e7146";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-31, -21);
    ctx.lineTo(27, -18);
    ctx.stroke();
    ctx.fillStyle = "#e4dfab";
    ctx.beginPath();
    ctx.moveTo(-24, -21);
    ctx.lineTo(-9, -20);
    ctx.lineTo(-11, -6);
    ctx.lineTo(-22, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#c1cc79";
    ctx.fillRect(20, 10, 12, 14);
    ctx.strokeRect(20, 10, 12, 14);
    ctx.fillStyle = "#5e713a";
    ctx.fillRect(24, 5, 5, 6);
    if (level >= 2) {
      ctx.fillStyle = "#6c8545";
      ctx.fillRect(-33, 7, 14, 20);
      ctx.strokeRect(-33, 7, 14, 20);
      ctx.strokeStyle = "#cbd9a2";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-26, 7);
      ctx.quadraticCurveTo(-20, -5, -7, -2);
      ctx.stroke();
    }
    if (level >= 3) {
      ctx.fillStyle = "#e0d79d";
      ctx.beginPath();
      ctx.arc(25, -13, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.strokeStyle = "#bcd579";
    ctx.lineWidth = 2;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.moveTo(14 + i * 9, -24);
      ctx.quadraticCurveTo(7 + i * 9, -29, 15 + i * 9, -34);
      ctx.stroke();
    }
  } else if (type === "speaker") {
    canvasShelter(ctx, "#6393ad", "peak", level);
    for (const x of level === 1 ? [24] : [-24, 24]) {
      ctx.fillStyle = "#254551";
      ctx.fillRect(x - 6, 5, 12, 19);
      ctx.strokeRect(x - 6, 5, 12, 19);
      ctx.fillStyle = "#9ebcc8";
      ctx.beginPath();
      ctx.arc(x, 15, 4, 0, Math.PI * 2);
      ctx.fill();
      if (level >= 3) {
        ctx.fillStyle = "#254551";
        ctx.fillRect(x - 7, -15, 14, 18);
        ctx.strokeRect(x - 7, -15, 14, 18);
        ctx.fillStyle = "#9ebcc8";
        ctx.beginPath();
        ctx.arc(x, -6, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.strokeStyle = "#495f64";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(4, -55);
    ctx.stroke();
    ctx.fillStyle = "#d4dccc";
    ctx.beginPath();
    ctx.moveTo(1, -35);
    ctx.lineTo(17, -42);
    ctx.lineTo(18, -30);
    ctx.lineTo(2, -30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    drawCampStructure(ctx, type);
    if (type === "kitchen") {
      ctx.fillStyle = "#263d35";
      ctx.fillRect(-13, 0, 26, 15);
      ctx.fillStyle = "#bec9b6";
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (level >= 2) {
        ctx.fillStyle = "#acb8a2";
        ctx.fillRect(-30, 3, 13, 17);
        ctx.strokeRect(-30, 3, 13, 17);
      }
      if (level >= 3) {
        ctx.fillStyle = "#677e58";
        ctx.fillRect(-32, 22, 64, 8);
        ctx.strokeRect(-32, 22, 64, 8);
        ctx.fillStyle = "#edb357";
        for (const x of [-23, 0, 24]) {
          ctx.beginPath();
          ctx.arc(x, 25, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.strokeStyle = "#e7d2a5";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(18, 17);
      ctx.lineTo(25, -12);
      ctx.stroke();
    } else if (type === "barrier") {
      if (level >= 2) {
        ctx.strokeStyle = "#8c9da0";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-25, -2);
        ctx.lineTo(27, 23);
        ctx.moveTo(25, -2);
        ctx.lineTo(-27, 23);
        ctx.stroke();
      }
      if (level >= 3) {
        ctx.fillStyle = "#a3956d";
        for (let i = 0; i < 5; i++) {
          ctx.fillRect(-36 + i * 15, 23, 14, 9);
          ctx.strokeRect(-36 + i * 15, 23, 14, 9);
        }
      }
      ctx.fillStyle = "#cf5747";
      ctx.fillRect(-30, 13, 61, 6);
      ctx.fillStyle = "#f9deb1";
      for (let x = -26; x < 28; x += 14) {
        ctx.beginPath();
        ctx.moveTo(x, 13);
        ctx.lineTo(x + 5, 13);
        ctx.lineTo(x, 19);
        ctx.lineTo(x - 5, 19);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
  ctx.restore();
}
