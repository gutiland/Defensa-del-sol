import { projectY } from "../data/map.js";
import { isEnraged } from "../attacker-abilities.js";
export function drawAttackerAbilities(ctx, u, game, time) {
  const x = u.x,
    y = projectY(u.y),
    active = game.time >= game.freezeUntil;
  ctx.save();
  if (
    (["fast", "sprinter"].includes(u.kind) || isEnraged(u)) &&
    active &&
    !u.blockedBy &&
    u.cooldown <= 0
  ) {
    const point = u.route?.[u.routeIndex] || game.base;
    const dx = (point?.x ?? x) - x,
      dy = projectY(point?.y ?? u.y) - projectY(u.y);
    const angle = Math.atan2(dy, dx);
    ctx.translate(x, y - 10);
    ctx.rotate(angle);
    ctx.strokeStyle = isEnraged(u) ? "#e65b39aa" : "#ffe99ccc";
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 4; i++) {
      const shift = (time * 75 + i * 7) % 23;
      ctx.beginPath();
      ctx.moveTo(-17 - shift, (i - 1.5) * 7);
      ctx.lineTo(-30 - shift, (i - 1.5) * 7);
      ctx.stroke();
    }
    ctx.rotate(-angle);
    ctx.translate(-x, -y + 10);
  }
  if (u.kind === "fast") {
    ctx.strokeStyle = "#f3b84d";
    ctx.globalAlpha = 0.18 + 0.1 * Math.sin(time * 5);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(x, y + 10, 65, 43, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  if (u.kind === "medic") {
    if (active && u.hp < u.maxHp) {
      const age = (time * 0.7 + u.id * 0.13) % 1;
      ctx.globalAlpha = 1 - age;
      ctx.fillStyle = "#65d89a";
      ctx.fillRect(x - 9, y - 40 - age * 23, 4, 12);
      ctx.fillRect(x - 13, y - 36 - age * 23, 12, 4);
    }
  }
  if (u.kind === "berserker") {
    ctx.globalAlpha = isEnraged(u) ? 0.8 : 0.45;
    ctx.strokeStyle = "#f05237";
    ctx.lineWidth = isEnraged(u) ? 4 : 2;
    ctx.beginPath();
    ctx.arc(x, y - 20, 27 + Math.sin(time * 8) * 2, -Math.PI, 0);
    ctx.stroke();
  }
  ctx.restore();
}
