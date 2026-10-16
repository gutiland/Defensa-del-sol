export function drawFlag(ctx, type, time = 0) {
  if (!type) return;
  ctx.save();
  ctx.translate(-18, -5);
  ctx.scale(1.15, 1.15);
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#716954";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 28);
  ctx.lineTo(0, -35);
  ctx.stroke();
  const wave = Math.sin(time * 4) * 4;
  const outline = () => {
    ctx.beginPath();
    ctx.moveTo(0, -34);
    ctx.quadraticCurveTo(-13, -37 + wave, -27, -33);
    ctx.lineTo(-27, -15);
    ctx.quadraticCurveTo(-13, -19 + wave, 0, -16);
    ctx.closePath();
  };
  outline();
  ctx.save();
  ctx.clip();
  if (type === "palestine") {
    ctx.fillStyle = "#151d1a";
    ctx.fillRect(-29, -40, 30, 16);
    ctx.fillStyle = "#eeeee8";
    ctx.fillRect(-29, -28, 30, 6);
    ctx.fillStyle = "#159456";
    ctx.fillRect(-29, -22, 30, 12);
    ctx.fillStyle = "#e34547";
    ctx.beginPath();
    ctx.moveTo(0, -35);
    ctx.lineTo(-13, -25);
    ctx.lineTo(0, -15);
    ctx.closePath();
    ctx.fill();
  } else {
    const colors =
      type === "republic"
        ? ["#ec4d47", "#ffda49", "#8e50c5"]
        : ["#eb4146", "#ffdb45", "#eb4146"];
    const rows =
      type === "republic" ? [-36, -29, -23, -14] : [-36, -30, -21, -14];
    colors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(-29, rows[i], 30, rows[i + 1] - rows[i]);
    });
  }
  const shade = ctx.createLinearGradient(-27, 0, 0, 0);
  shade.addColorStop(0, "#ffffff16");
  shade.addColorStop(0.45, "#00000018");
  shade.addColorStop(1, "#ffffff08");
  ctx.fillStyle = shade;
  ctx.fillRect(-29, -40, 30, 30);
  ctx.restore();
  outline();
  ctx.strokeStyle = "#303b34";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}
