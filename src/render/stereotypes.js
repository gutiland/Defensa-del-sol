import { projectY } from "../data/map.js";
import { odorStats } from "../stereotypes.js";
export function drawOdorLines(ctx, building, time) {
  if (building.type !== "odor") return;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const x = building.x,
    y = projectY(building.y) - 17;
  const level = building.level || 1;
  const count = 3 + level;
  for (let i = 0; i < count; i++) {
    const age = (time * (0.3 + level * 0.08) + i / count) % 1;
    const rise = age * (16 + level * 8),
      side = (i - 2) * 8;
    const sway = Math.sin(time * 2.5 + i) * 4;
    ctx.globalAlpha = Math.sin(age * Math.PI) * 0.85;
    ctx.beginPath();
    ctx.moveTo(x + side, y - rise);
    ctx.bezierCurveTo(
      x + side - 9 + sway,
      y - rise - 9,
      x + side + 10 + sway,
      y - rise - 17,
      x + side + sway,
      y - rise - 28,
    );
    ctx.strokeStyle = "#536c2c";
    ctx.lineWidth = 2 + level * 0.6;
    ctx.stroke();
    ctx.strokeStyle = "#bed168";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();
}
export function drawStereotypes(ctx, game, time = game.time, view = {}) {
  ctx.save();
  for (const b of game.buildings) {
    if (
      b.type !== "odor" ||
      b.hp <= 0 ||
      (game.storyEvent?.buildingId === b.id &&
        (game.storyEvent.wholeRound || game.time < game.storyEvent.until))
    )
      continue;
    const x = b.x,
      y = projectY(b.y),
      radius = odorStats(b, game).radius;
    ctx.fillStyle = "#b2c75520";
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius * 0.66, 0, 0, Math.PI * 2);
    ctx.fill();
    // Bounded rings and wisps span the actual damage radius, including upgrades.
    ctx.strokeStyle = "#a3bf5d";
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.42;
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius * 0.66, 0, 0, Math.PI * 2);
    ctx.stroke();
    const rings = view.quality === "low" ? 1 : 2;
    for (let i = 0; i < rings; i++) {
      const wave = (time * 0.22 + i / rings) % 1;
      ctx.globalAlpha = (1 - wave) * 0.35;
      ctx.beginPath();
      ctx.ellipse(x, y, radius * wave, radius * wave * 0.66, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    const count = view.quality === "low" ? 4 : 8;
    for (let i = 0; i < count; i++) {
      const age = (time * 0.3 + i / count) % 1;
      const angle = i * 2.39996 + time * 0.12;
      const distance = radius * (0.25 + 0.58 * age);
      ctx.globalAlpha = Math.sin(age * Math.PI) * 0.28;
      ctx.fillStyle = "#b1c74e";
      ctx.beginPath();
      ctx.ellipse(
        x + Math.cos(angle) * distance,
        y + Math.sin(angle) * distance * 0.66 - age * 5,
        4 + age * 9,
        3 + age * 6,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  for (const u of game.units) {
    const x = u.x,
      y = projectY(u.y);
    if (u.kind === "perfume") {
      ctx.strokeStyle = "#d4b0e080";
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const age = (time * 0.5 + i / 3) % 1;
        ctx.globalAlpha = 1 - age;
        ctx.beginPath();
        ctx.arc(x + 13, y - 14, 3 + age * 10, -1, 0.7);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    if (u.kind === "fast") {
      ctx.fillStyle = "#ed6d57";
      ctx.beginPath();
      ctx.arc(x + 18, y - 30, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ed6d5780";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.arc(x + 18, y - 30, 6 + i * 4, -0.7, 0.7);
        ctx.stroke();
      }
    }
    if (u.stinky) {
      ctx.strokeStyle = "#9aaf3b";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x - 6, y - 39);
      ctx.quadraticCurveTo(x - 10, y - 44, x - 5, y - 48);
      ctx.moveTo(x, y - 40);
      ctx.quadraticCurveTo(x + 5, y - 44, x + 1, y - 48);
      ctx.stroke();
    }
    if (u.hyped) {
      ctx.strokeStyle = "#e4c36d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 16, y - 22);
      ctx.lineTo(x - 13, y - 26);
      ctx.lineTo(x - 10, y - 22);
      ctx.stroke();
    }
  }
  ctx.restore();
}
