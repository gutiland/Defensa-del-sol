const INK = "#30392a";
export function drawFace(ctx, c, id, mouth = 0) {
  const w = (c.faceWidth || 10) * 1.12;
  const long = id === "assembly" || id === "micro",
    top = long ? -30 : -27;
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = INK;
  if (c.style === "ponytail") {
    ctx.fillStyle = c.hair;
    ctx.beginPath();
    ctx.ellipse(12, -8, 5, 13, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#e7b986";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(side * w, -12, 3, 4, side * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = c.skin;
  ctx.beginPath();
  ctx.moveTo(-w, -16);
  ctx.bezierCurveTo(-w - 3, top - 6, w + 3, top - 6, w, -15);
  ctx.lineTo(w - 1, -6);
  ctx.quadraticCurveTo(w * 0.6, 4, 0, 3);
  ctx.quadraticCurveTo(-w, 2, -w, -9);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#f4cd9d";
  ctx.beginPath();
  ctx.ellipse(-w * 0.45, -18, 3, 6, -0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = c.hair;
  ctx.beginPath();
  if (c.style === "bald" || c.style === "balding") {
    ctx.moveTo(-w, -10);
    ctx.lineTo(-w - 1, -21);
    ctx.lineTo(-w + 3, -23);
    ctx.lineTo(-w + 2, -11);
    ctx.moveTo(w, -10);
    ctx.lineTo(w + 1, -21);
    ctx.lineTo(w - 3, -23);
    ctx.lineTo(w - 2, -11);
  } else {
    ctx.moveTo(-w, -12);
    ctx.bezierCurveTo(-w - 6, top - 9, w + 6, top - 9, w, -12);
    ctx.lineTo(w - 3, -22);
    ctx.lineTo(3, -21);
    ctx.lineTo(-1, -25);
    ctx.lineTo(-w + 3, -22);
    ctx.closePath();
  }
  ctx.fill();
  ctx.stroke();
  if (c.style === "quiff") {
    ctx.beginPath();
    ctx.moveTo(-w, top + 5);
    ctx.bezierCurveTo(-w - 6, top - 12, w + 12, top - 10, w + 3, top);
    ctx.lineTo(1, top + 7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  if (c.beard) {
    ctx.beginPath();
    ctx.moveTo(-w, -10);
    ctx.lineTo(-w + 2, -1);
    ctx.quadraticCurveTo(0, 9, w - 2, -1);
    ctx.lineTo(w, -10);
    ctx.lineTo(w - 5, -4);
    ctx.lineTo(-w + 5, -4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  // Unequal oversized eyes and asymmetrical brows give readable expressions at game scale.
  ctx.fillStyle = "#fff5d8";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(-5, -15, 4.4, 5.1, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(5, -15.5, 4, 4.6, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.ellipse(-3.7, -14.5, 1.8, 2.2, 0, 0, Math.PI * 2);
  ctx.ellipse(6, -15, 1.7, 2.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fffdf0";
  ctx.fillRect(-4.4, -16, 1.2, 1.4);
  ctx.fillRect(5.3, -16.4, 1, 1.2);
  ctx.strokeStyle = c.hair;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-9, -22);
  ctx.lineTo(-2, -20);
  ctx.moveTo(2, -21);
  ctx.lineTo(9, -23);
  ctx.stroke();
  ctx.fillStyle = "#d4a078";
  ctx.strokeStyle = "#91643e";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.quadraticCurveTo(7, -7, 2, -7);
  ctx.lineTo(-1, -8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#603e2e";
  if (mouth > 0.15) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.ellipse(1, -1, 5.2, 1 + mouth * 4.2, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f9e9bd";
    ctx.fillRect(-2.5, -2.7, 7, 1.3);
    ctx.fillStyle = "#c67a70";
    ctx.beginPath();
    ctx.ellipse(1, 1 + mouth * 1.8, 2.7, mouth, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-5, -3);
    ctx.quadraticCurveTo(0, -1, 7, -5);
    ctx.quadraticCurveTo(6, 2, -1, 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f9e9bd";
    ctx.beginPath();
    ctx.moveTo(-3, -2.8);
    ctx.lineTo(5, -4);
    ctx.lineTo(4, -1.7);
    ctx.lineTo(-2, -1);
    ctx.closePath();
    ctx.fill();
  }
  if (id === "assembly") {
    ctx.strokeStyle = "#d8d5ac";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(-w, -9, 2, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}
