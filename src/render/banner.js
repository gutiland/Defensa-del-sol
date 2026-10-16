import { bannerText } from "../data/banner-copy.js";

export function drawBanner(ctx, side, time, pose) {
  const walking = pose.moving !== false;
  const wave = walking ? Math.sin(time * 4) * 1.4 : Math.sin(time * 1.8) * 0.5;
  ctx.save();
  ctx.translate(
    (pose.release || 0) * 3,
    walking ? Math.sin(time * 5) * 0.9 : 0,
  );
  ctx.rotate(
    walking ? Math.sin(time * 2.5) * 0.025 : -(pose.release || 0) * 0.04,
  );
  ctx.strokeStyle = "#69482f";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-23, 5);
  ctx.lineTo(-24, 36);
  ctx.moveTo(23, 5);
  ctx.lineTo(25, 36);
  ctx.stroke();
  ctx.strokeStyle = "#ba8d56";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-22, 7);
  ctx.lineTo(-23, 35);
  ctx.moveTo(24, 7);
  ctx.lineTo(26, 35);
  ctx.stroke();
  const cloth = ctx.createLinearGradient(0, 13, 0, 35);
  cloth.addColorStop(0, side === "attack" ? "#ffedac" : "#fff1ce");
  cloth.addColorStop(0.65, side === "attack" ? "#efd17b" : "#ead8a6");
  cloth.addColorStop(1, "#cfb679");
  ctx.fillStyle = cloth;
  ctx.strokeStyle = "#51432f";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-41, 14 + wave);
  ctx.quadraticCurveTo(-16, 12, 0, 16 - wave);
  ctx.quadraticCurveTo(20, 18, 41, 13 + wave);
  ctx.lineTo(40, 31 + wave);
  ctx.lineTo(35, 30 + wave);
  ctx.lineTo(34, 34 + wave);
  ctx.quadraticCurveTo(10, 36, -4, 32 - wave);
  ctx.quadraticCurveTo(-23, 30, -41, 34 + wave);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "#fff7da";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-38, 17 + wave);
  ctx.quadraticCurveTo(-13, 15, 0, 19 - wave);
  ctx.quadraticCurveTo(18, 21, 38, 16 + wave);
  ctx.stroke();
  ctx.strokeStyle = "#a28b5c80";
  for (const x of [-29, 29]) {
    ctx.beginPath();
    ctx.moveTo(x, 17);
    ctx.quadraticCurveTo(x - 4, 24, x + 1, 31);
    ctx.stroke();
  }
  ctx.fillStyle = "#5c4d36";
  for (const x of [-36, 36]) {
    ctx.beginPath();
    ctx.arc(x, 18 + wave, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "#d2b47b";
  ctx.lineWidth = 1.4;
  for (const x of [-24, 24]) {
    ctx.beginPath();
    ctx.moveTo(x, 13);
    ctx.lineTo(x - 3, 19);
    ctx.lineTo(x + 2, 18);
    ctx.stroke();
  }
  ctx.fillStyle = "#302c23";
  ctx.font = "900 9px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(bannerText(side, pose.seed), 0, 25, 69);
  ctx.fillStyle = "#ccaa83";
  for (const x of [-23, 23]) {
    ctx.beginPath();
    ctx.arc(x, 7, 2.7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
