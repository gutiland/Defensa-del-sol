import { drawBanner } from "./banner.js";
import { drawWeapon } from "./weapon-art.js";
export function drawEquipment(ctx, role, side, time = 0, pose = {}) {
  ctx.save();
  ctx.lineJoin = "round";
  if (role === "medic") {
    ctx.fillStyle = "#21694f";
    ctx.strokeStyle = "#152e25";
    ctx.lineWidth = 2;
    ctx.fillRect(12, 0, 18, 16);
    ctx.strokeRect(12, 0, 18, 16);
    ctx.strokeRect(17, -4, 8, 4);
    ctx.fillStyle = "#e9ffd9";
    ctx.fillRect(19, 2, 4, 12);
    ctx.fillRect(15, 6, 12, 4);
  } else if (role === "berserker") {
    ctx.fillStyle = "#b7362e";
    ctx.strokeStyle = "#3b2924";
    ctx.lineWidth = 2;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(
        side * 16,
        -3 - (pose.release || 0) * 9,
        7,
        9,
        side * 0.3,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.stroke();
    }
  } else if (role === "armored") {
    ctx.fillStyle = "#7a8990";
    ctx.strokeStyle = "#2c3d40";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -26, 13, Math.PI, 0);
    ctx.lineTo(14, -23);
    ctx.lineTo(-14, -23);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#839da0";
    ctx.beginPath();
    ctx.moveTo(10, -9);
    ctx.lineTo(30, -9);
    ctx.lineTo(29, 13);
    ctx.lineTo(20, 22);
    ctx.lineTo(10, 13);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#d9c976";
    ctx.beginPath();
    ctx.moveTo(20, -5);
    ctx.lineTo(20, 14);
    ctx.stroke();
  } else if (role === "sprinter") {
    ctx.fillStyle = "#d94c42";
    ctx.fillRect(-12, -4, 24, 13);
    ctx.fillStyle = "#fff0ca";
    ctx.fillRect(-3, -4, 3, 17);
    ctx.fillStyle = "#f0dc78";
    ctx.fillRect(-12, 20, 10, 5);
    ctx.fillRect(5, 20, 11, 5);
  } else if (role === "area") {
    drawWeapon(ctx, "paintbomb", 15, 5);
  } else if (role === "heavy" || role === "barrier") {
    drawBanner(ctx, side, time, pose);
  } else if (role === "perfume") {
    ctx.fillStyle = "#cba5dc";
    ctx.strokeStyle = "#51415f";
    ctx.lineWidth = 1.3;
    ctx.fillRect(10, -3, 9, 13);
    ctx.strokeRect(10, -3, 9, 13);
    ctx.fillStyle = "#e6dfbb";
    ctx.fillRect(12, -7, 6, 4);
    ctx.strokeStyle = "#d8b4e3";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(19, -6);
    ctx.lineTo(27, -10);
    ctx.moveTo(20, -3);
    ctx.lineTo(29, -3);
    ctx.stroke();
  } else if (role === "odor") {
    ctx.fillStyle = "#a3a75a";
    ctx.strokeStyle = "#394834";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(9, 0);
    ctx.lineTo(22, 3);
    ctx.lineTo(19, 18);
    ctx.lineTo(6, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#b9c75a";
    ctx.beginPath();
    ctx.moveTo(19, -3);
    ctx.quadraticCurveTo(25, -8, 19, -14);
    ctx.stroke();
  } else if (role === "fast") {
    ctx.strokeStyle = "#caab8b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(9, 4);
    ctx.lineTo(17, -7);
    ctx.stroke();
    ctx.fillStyle = "#263640";
    ctx.strokeStyle = "#151f26";
    ctx.lineWidth = 1;
    ctx.fillRect(13, -22, 11, 17);
    ctx.strokeRect(13, -22, 11, 17);
    ctx.fillStyle = "#b5e0df";
    ctx.fillRect(15, -20, 7, 12);
    ctx.fillStyle = "#cb5546";
    ctx.beginPath();
    ctx.arc(19, -17, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ebf8ef";
    ctx.fillRect(16, -12, 5, 1);
    ctx.strokeStyle = "#c0c7b0";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(20, -24, 3, -1, 1);
    ctx.stroke();
  } else if (role === "speaker" || role === "base") {
    ctx.fillStyle = "#d9dfcf";
    ctx.strokeStyle = "#3d4943";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(10, -9);
    ctx.lineTo(27, -19);
    ctx.lineTo(27, -1);
    ctx.lineTo(10, -5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#545f52";
    ctx.fillRect(11, -6, 4, 13);
    ctx.beginPath();
    ctx.ellipse(27, -10, 3, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#dbd5b0";
    ctx.lineWidth = 1.3;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.arc(29, -10, 6 + i * 5, -0.65, 0.65);
      ctx.stroke();
    }
  } else if (role === "kitchen") {
    ctx.fillStyle = "#e4dfce";
    ctx.fillRect(-7, 0, 14, 15);
    ctx.strokeStyle = "#f5ebd4";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-8, -2);
    ctx.lineTo(-5, 3);
    ctx.moveTo(8, -2);
    ctx.lineTo(5, 3);
    ctx.stroke();
    ctx.strokeStyle = "#9ba39b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(13, 10);
    ctx.lineTo(17, -14);
    ctx.stroke();
    ctx.fillStyle = "#c9cec2";
    ctx.beginPath();
    ctx.ellipse(18, -16, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#5e655d";
    ctx.fillRect(-15, 10, 11, 8);
    ctx.fillStyle = "#bdc5b9";
    ctx.beginPath();
    ctx.ellipse(-9.5, 10, 6, 2, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (role === "tent") {
    ctx.fillStyle = "#b6a17c";
    ctx.strokeStyle = "#6c5943";
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(8 - i, 3 + i * 4, 17, 4);
      ctx.strokeRect(8 - i, 3 + i * 4, 17, 4);
    }
  } else {
    ctx.strokeStyle = "#735d45";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(13, 18);
    ctx.lineTo(16, -5);
    ctx.stroke();
    ctx.fillStyle = "#c4ad7c";
    ctx.fillRect(13, -7, 17, 12);
    ctx.strokeStyle = "#574b36";
    ctx.lineWidth = 0.7;
    ctx.strokeRect(13, -7, 17, 12);
    ctx.fillStyle = "#534631";
    ctx.font = "bold 5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ORDEN", 21, -1);
  }
  ctx.restore();
}
