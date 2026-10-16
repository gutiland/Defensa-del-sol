// Alternating identifiers keep cosmetic variety deterministic and out of combat rules.
export function damageMarkLevel(unit) {
  if (
    !Number.isInteger(unit.id) ||
    unit.id % 2 !== 0 ||
    unit.hp <= 0 ||
    !unit.maxHp ||
    unit.hp >= unit.maxHp
  )
    return 0;
  const ratio = unit.hp / unit.maxHp;
  return ratio < 0.3 ? 3 : ratio < 0.6 ? 2 : 1;
}

export function drawDamageMarks(ctx, level, scale, x, y) {
  if (!level) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  // Bruise sits below the eye, keeping the expression readable.
  ctx.fillStyle = "#765180bb";
  ctx.beginPath();
  ctx.ellipse(-5, -19, 4.5, 2.6, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#513c61";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(-5, -20, 3.5, 0.1, Math.PI - 0.1);
  ctx.stroke();
  if (level >= 2) {
    ctx.translate(7, -11);
    ctx.rotate(-0.35);
    ctx.fillStyle = "#f3d6a4";
    ctx.fillRect(-4, -2, 8, 4);
    ctx.strokeStyle = "#9a7455";
    ctx.strokeRect(-4, -2, 8, 4);
    ctx.fillStyle = "#c7a67a";
    ctx.fillRect(-1, -1.5, 2, 3);
    ctx.rotate(0.35);
    ctx.translate(-7, 11);
  }
  if (level >= 3) {
    ctx.strokeStyle = "#e4d8b5";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-6, 4);
    ctx.lineTo(1, 9);
    ctx.moveTo(-5, 8);
    ctx.lineTo(1, 4);
    ctx.stroke();
  }
  ctx.restore();
}
