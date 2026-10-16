export function drawOutfit(ctx, c) {
  if (c.accessory === "turnList") {
    ctx.fillStyle = "#f6ebc8";
    ctx.strokeStyle = "#564a39";
    ctx.lineWidth = 1;
    ctx.fillRect(-21, -5, 10, 18);
    ctx.strokeRect(-21, -5, 10, 18);
    ctx.strokeStyle = "#7d755f";
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(-19, -1 + i * 2.5);
      ctx.lineTo(-13, -1 + i * 2.5);
      ctx.stroke();
    }
  }
  if (c.accessory === "hummusBowl") {
    ctx.fillStyle = "#e9dcc0";
    ctx.fillRect(-8, 0, 16, 16);
    ctx.strokeStyle = "#746344";
    ctx.lineWidth = 1.5;
    ctx.fillStyle = "#8b6448";
    ctx.beginPath();
    ctx.ellipse(13, 9, 12, 7, 0, 0, Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#e4c990";
    ctx.beginPath();
    ctx.ellipse(13, 9, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#a17c3e";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(13, 9, 6, 2, 0, 0, Math.PI * 1.7);
    ctx.stroke();
  }
  if (c.accessory === "muscles") {
    ctx.strokeStyle = c.skin;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-10, 1);
    ctx.lineTo(-17, 11);
    ctx.moveTo(10, 1);
    ctx.lineTo(17, 11);
    ctx.stroke();
    ctx.fillStyle = "#f4e9bc";
    ctx.font = "bold 4px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DESALOJO", 0, 9);
  }
  if (c.accessory === "tie") {
    ctx.fillStyle = "#e6e4d6";
    ctx.beginPath();
    ctx.moveTo(-5, -2);
    ctx.lineTo(0, 6);
    ctx.lineTo(5, -2);
    ctx.fill();
    ctx.fillStyle = "#d9554b";
    ctx.beginPath();
    ctx.moveTo(0, 1);
    ctx.lineTo(-2, 11);
    ctx.lineTo(1, 14);
    ctx.lineTo(3, 10);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = "#414741";
  ctx.lineWidth = 2.3;
  ctx.beginPath();
  ctx.moveTo(-9, 1);
  ctx.lineTo(-14, 12);
  ctx.moveTo(9, 1);
  ctx.lineTo(14, 12);
  ctx.stroke();
  if (c.accessory === "sweater") {
    ctx.strokeStyle = "#414c62";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-10, -1);
    ctx.lineTo(10, -1);
    ctx.moveTo(-9, 0);
    ctx.lineTo(-4, 10);
    ctx.moveTo(9, 0);
    ctx.lineTo(4, 10);
    ctx.stroke();
  }
  if (c.accessory === "vest") {
    ctx.fillStyle = "#b8a758";
    ctx.fillRect(-10, -1, 7, 14);
    ctx.fillRect(3, -1, 7, 14);
    ctx.fillStyle = "#d4cbaa";
    ctx.fillRect(-10, 6, 20, 2);
  }
  if (c.accessory === "scarf") {
    ctx.strokeStyle = "#a95546";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-7, -1);
    ctx.lineTo(8, 0);
    ctx.lineTo(4, 13);
    ctx.stroke();
  }
  if (c.accessory === "tote") {
    ctx.strokeStyle = "#b8af8f";
    ctx.lineWidth = 1;
    ctx.strokeRect(8, 1, 8, 11);
    ctx.fillStyle = "#c5ba95";
    ctx.fillRect(7, 7, 12, 15);
    ctx.strokeStyle = "#6b775b";
    ctx.beginPath();
    ctx.moveTo(10, 17);
    ctx.lineTo(16, 12);
    ctx.stroke();
  }
  if (c.accessory === "briefcase") {
    ctx.strokeStyle = "#3c3831";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(12, 10, 5, 5);
    ctx.fillStyle = "#584b3c";
    ctx.fillRect(9, 14, 14, 11);
    ctx.fillStyle = "#c5b38e";
    ctx.fillRect(15, 18, 3, 2);
  }
  if (c.accessory === "megaphone") {
    ctx.fillStyle = "#a3a698";
    ctx.beginPath();
    ctx.moveTo(10, 3);
    ctx.lineTo(23, -4);
    ctx.lineTo(23, 9);
    ctx.lineTo(10, 7);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#424c45";
    ctx.fillRect(11, 7, 3, 6);
  }
}
export function drawHairDetails(ctx, c) {
  ctx.fillStyle = c.hair;
  ctx.strokeStyle = c.hair;
  if (c.style === "dreads") {
    ctx.lineWidth = 3.5;
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 3, -26);
      ctx.bezierCurveTo(i * 4, -20, i * 5, -5, i * 5, 3 + (i % 2) * 5);
      ctx.stroke();
    }
  }
  if (c.style === "bun") {
    ctx.beginPath();
    ctx.arc(5, -30, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  if (c.style === "sidepart" || c.style === "slick") {
    ctx.strokeStyle = "#aba08b70";
    ctx.lineWidth = 0.7;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(-7 + i * 3, -25);
      ctx.lineTo(6 + i, -22);
      ctx.stroke();
    }
  }
  if (c.style === "undercut") {
    ctx.fillStyle = "#98718e";
    ctx.fillRect(-5, -28, 13, 5);
  }
  if (c.moustache) {
    ctx.strokeStyle = c.hair;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-6, -6);
    ctx.quadraticCurveTo(0, -9, 6, -6);
    ctx.stroke();
  }
  if (c.glasses || c.accessory === "sunglasses") {
    ctx.strokeStyle = "#3d423d";
    ctx.lineWidth = 1;
    for (const x of [-8, 2]) {
      if (c.accessory === "sunglasses") {
        ctx.fillStyle = "#272f32";
        ctx.fillRect(x, -17, 7, 5);
      }
      ctx.strokeRect(x, -17, 7, 5);
    }
    ctx.beginPath();
    ctx.moveTo(-1, -15);
    ctx.lineTo(2, -15);
    ctx.stroke();
  }
  if (c.piercing) {
    ctx.strokeStyle = "#ccc8b8";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(10, -8, 2, 0, Math.PI * 2);
    ctx.stroke();
  }
}
