import { plazaPath } from "../placement.js";
import { ROUTES } from "../data/routes.js";
export function drawRain(ctx, game, time, air = false) {
  if (game.phase !== "combat" || game.result || game.storyEvent?.id !== "rain")
    return;
  ctx.save();
  if (air) {
    ctx.strokeStyle = "#b9d9e1a6";
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 85; i++) {
      const x = ((i * 137 + time * 65) % 1020) - 10,
        y = ((i * 83 + time * 295) % 700) - 10;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 6, y + 17);
      ctx.stroke();
    }
  } else {
    plazaPath(ctx);
    ctx.clip();
    ctx.fillStyle = "#446b8026";
    ctx.fillRect(0, 0, 1000, 680);
    for (let i = 0; i < 22; i++) {
      const route = ROUTES[i % ROUTES.length],
        point = route[Math.floor(route.length * (0.25 + (i % 5) * 0.12))];
      const x = point[0],
        y = point[1],
        w = 15 + (i % 4) * 6;
      ctx.fillStyle = "#57899455";
      ctx.strokeStyle = "#d4e9df77";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(x, y, w, w * 0.3, i * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#e3f3e499";
      ctx.beginPath();
      ctx.moveTo(x - w * 0.5, y - 1);
      ctx.lineTo(x + w * 0.3, y - 2);
      ctx.stroke();
      const ripple = (time * 0.8 + i * 0.17) % 1;
      ctx.globalAlpha = (1 - ripple) * 0.55;
      ctx.beginPath();
      ctx.ellipse(
        x + 3,
        y + 2,
        2 + ripple * 12,
        1 + ripple * 4,
        0,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
  ctx.restore();
}
