export function drawWeapon(ctx, type, x = 0, y = 0, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.lineWidth = 0.7;
  if (type === "paintbomb") {
    ctx.fillStyle = "#a16aba";
    ctx.strokeStyle = "#483155";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#e0b5ed";
    ctx.beginPath();
    ctx.arc(-2, -2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }
  if (type === "stone" || type === "big-stone") {
    const r = type === "stone" ? 3 : 5.5;
    ctx.fillStyle = "#8c9085";
    ctx.strokeStyle = "#4d564e";
    ctx.beginPath();
    ctx.moveTo(-r, -r * 0.4);
    ctx.lineTo(-r * 0.3, -r);
    ctx.lineTo(r * 0.8, -r * 0.6);
    ctx.lineTo(r, r * 0.5);
    ctx.lineTo(0, r);
    ctx.lineTo(-r, r * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#cbd0bc";
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.3);
    ctx.lineTo(r * 0.3, -r * 0.5);
    ctx.stroke();
  } else if (type === "bottle" || type === "molotov") {
    ctx.fillStyle = "#49745a";
    ctx.strokeStyle = "#233f31";
    ctx.fillRect(-3, -2, 6, 9);
    ctx.strokeRect(-3, -2, 6, 9);
    ctx.fillRect(-1.5, -7, 3, 5);
    ctx.fillStyle = "#d4c899";
    ctx.fillRect(-2, 1, 4, 3);
    ctx.strokeStyle = "#c9e7cb90";
    ctx.beginPath();
    ctx.moveTo(-1, -1);
    ctx.lineTo(-1, 5);
    ctx.stroke();
    if (type === "molotov") {
      ctx.fillStyle = "#f8b548";
      ctx.beginPath();
      ctx.moveTo(-2, -7);
      ctx.quadraticCurveTo(-6, -15, 0, -18);
      ctx.quadraticCurveTo(5, -10, 1, -7);
      ctx.fill();
      ctx.fillStyle = "#fff0a7";
      ctx.fillRect(-0.7, -12, 1.4, 5);
    }
  }
  ctx.restore();
}
export function drawWeaponStock(ctx, level) {
  const type = ["stone", "big-stone", "bottle", "molotov"][level - 1];
  ctx.save();
  ctx.translate(-24, 18);
  if (level >= 3) {
    ctx.fillStyle = "#655944";
    ctx.fillRect(-12, -1, 25, 9);
    ctx.strokeStyle = "#a38a61";
    ctx.lineWidth = 1;
    ctx.strokeRect(-12, -1, 25, 9);
  }
  for (let i = 0; i < (level < 3 ? 5 : 3); i++)
    drawWeapon(ctx, type, -8 + i * (level < 3 ? 4 : 8), i % 2 ? 1 : -1, 0.6);
  ctx.restore();
}
