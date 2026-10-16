const INK = "#4a5133";
export function label(ctx, s, x, y, size = 10, color = INK) {
  ctx.fillStyle = color;
  ctx.font = `500 ${size}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(s, x, y);
}
export function buildingBlock(
  ctx,
  { x, y, w, h = 65, color = "#dfbd8e", name, clock = false },
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.lineJoin = "round";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5;
  ctx.fillStyle = "#20221d30";
  ctx.beginPath();
  ctx.ellipse(10, 10, w * 0.56, 17, 0, 0, 7);
  ctx.fill();
  ctx.fillStyle = "#b6a084";
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2 + 13, -10);
  ctx.lineTo(w / 2 + 13, -h - 10);
  ctx.lineTo(w / 2, -h);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  const facade = ctx.createLinearGradient(0, -h, 0, 0);
  facade.addColorStop(0, color);
  facade.addColorStop(1, "#b5a371");
  ctx.fillStyle = facade;
  ctx.fillRect(-w / 2, -h, w, h);
  ctx.strokeRect(-w / 2, -h, w, h);
  for (let row = 0; row < 3; row++)
    for (let col = -w / 2 + 12; col < w / 2 - 6; col += 19) {
      const yy = -h + 13 + row * 17;
      ctx.fillStyle = "#454f50";
      ctx.fillRect(col, yy, 8, 11);
      ctx.fillStyle = "#cec9bc";
      ctx.fillRect(col - 2, yy - 2, 12, 3);
      if (row === 1) {
        ctx.strokeStyle = INK;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(col - 3, yy + 6, 14, 6);
      }
    }
  ctx.strokeStyle = "#534a3c18";
  ctx.lineWidth = 0.5;
  for (let yy = -h + 4; yy < 0; yy += 5) {
    ctx.beginPath();
    ctx.moveTo(-w / 2, yy);
    ctx.lineTo(w / 2, yy);
    ctx.stroke();
  }
  ctx.fillStyle = "#857d70";
  ctx.fillRect(-w / 2, -8, w, 8);
  for (let col = -w / 2 + 12; col < w / 2 - 5; col += 25) {
    ctx.fillStyle = "#414e4e";
    ctx.fillRect(col, -12, 12, 12);
  }
  ctx.fillStyle = "#736d66";
  ctx.beginPath();
  ctx.moveTo(-w / 2 - 5, -h);
  ctx.lineTo(-w / 2 + 7, -h - 14);
  ctx.lineTo(w / 2 + 4, -h - 14);
  ctx.lineTo(w / 2 + 14, -h);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.stroke();
  if (clock) {
    ctx.fillStyle = "#d7bb96";
    ctx.fillRect(-19, -h - 30, 38, 34);
    ctx.strokeRect(-19, -h - 30, 38, 34);
    ctx.fillStyle = "#f8f0d6";
    ctx.beginPath();
    ctx.arc(0, -h - 15, 11, 0, 7);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#3a4035";
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(Math.sin(angle) * 8, -h - 15 + Math.cos(angle) * 8);
      ctx.lineTo(Math.sin(angle) * 10, -h - 15 + Math.cos(angle) * 10);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(0, -h - 23);
    ctx.lineTo(0, -h - 15);
    ctx.lineTo(6, -h - 15);
    ctx.stroke();
    ctx.fillStyle = "#655b52";
    ctx.beginPath();
    ctx.moveTo(-23, -h - 30);
    ctx.lineTo(0, -h - 47);
    ctx.lineTo(23, -h - 30);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#d9c299";
    ctx.fillRect(-4, -h - 56, 8, 10);
    ctx.strokeStyle = "#43483b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -h - 56);
    ctx.lineTo(0, -h - 66);
    ctx.stroke();
    ctx.fillRect(-2, -h - 59, 4, 17);
  }
  if (name) {
    ctx.fillStyle = "#fbefce";
    ctx.fillRect(-w * 0.42, -32, w * 0.84, 16);
    label(ctx, name, 0, -20, Math.min(10, w / 12));
  }
  ctx.restore();
}
