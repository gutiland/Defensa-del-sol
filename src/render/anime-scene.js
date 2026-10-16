import { drawCharacter } from "./characters.js";
import { DEFAULT_ROLES } from "../data/roles.js";

// A single eased entrance and steady speed lines: no flashing or camera shake.
export function drawAnimeScene(ctx, line, time, reducedMotion = false) {
  const attack = line.character.startsWith("boss");
  const t = reducedMotion ? 1 : Math.min(1, time / 0.65);
  const ease = 1 - (1 - t) ** 3;
  ctx.save();
  ctx.fillStyle = "#12202e";
  ctx.fillRect(0, 0, 560, 300);
  const gradient = ctx.createLinearGradient(0, 0, 560, 300);
  gradient.addColorStop(0, attack ? "#69242f" : "#174950");
  gradient.addColorStop(1, attack ? "#df8541" : "#87a655");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, 55);
  ctx.lineTo(560, 10);
  ctx.lineTo(560, 255);
  ctx.lineTo(0, 290);
  ctx.closePath();
  ctx.fill();
  const cx = attack ? 350 : 220;
  ctx.strokeStyle = attack ? "#ffe3a54d" : "#d5ffdf4d";
  for (let i = 0; i < 32; i++) {
    const angle = (i * Math.PI) / 16;
    const shift = reducedMotion ? 0 : (time * 12 + i * 7) % 32;
    ctx.lineWidth = i % 3 === 0 ? 3 : 1;
    ctx.beginPath();
    ctx.moveTo(
      cx + Math.cos(angle) * (80 + shift),
      145 + Math.sin(angle) * (65 + shift),
    );
    ctx.lineTo(cx + Math.cos(angle) * 640, 145 + Math.sin(angle) * 380);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.38;
  const other = attack ? "spokesperson" : line.opponent || "union";
  drawCharacter(
    ctx,
    other,
    attack ? 78 : 482,
    225,
    2.5,
    0,
    DEFAULT_ROLES[other],
    { moving: false },
  );
  ctx.globalAlpha = 1;
  const x = cx + (attack ? 1 : -1) * (1 - ease) * 180;
  ctx.fillStyle = attack ? "#ffd27735" : "#d9ffa535";
  ctx.beginPath();
  ctx.ellipse(cx, 160, 90, 120, -0.15, 0, Math.PI * 2);
  ctx.fill();
  drawCharacter(
    ctx,
    line.character,
    x,
    230,
    3.8 + (1 - ease) * 0.7,
    reducedMotion ? 0 : time,
    DEFAULT_ROLES[line.character],
    { moving: false, talking: !reducedMotion, release: (1 - ease) * 0.5 },
  );
  ctx.fillStyle = "#10202b";
  ctx.fillRect(0, 0, 560, 18);
  ctx.fillRect(0, 282, 560, 18);
  ctx.strokeStyle = "#f4e1a8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.lineTo(560, 20);
  ctx.moveTo(0, 280);
  ctx.lineTo(560, 280);
  ctx.stroke();
  ctx.restore();
}
