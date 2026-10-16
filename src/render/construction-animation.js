import { projectY } from "../data/map.js";

export function createConstructionAnimation() {
  let clock = 0,
    previous = null,
    states = new WeakMap();
  return {
    advance(game, dt) {
      if (game !== previous) {
        previous = game;
        clock = 0;
        states = new WeakMap();
      }
      clock += Math.max(0, dt);
    },
    draw(ctx, b, paint) {
      let state = states.get(b);
      if (!state || state.level !== b.level || state.branch !== b.branch) {
        state = { at: clock, level: b.level, branch: b.branch, fresh: !state };
        states.set(b, state);
      }
      const arriving = state.fresh && b.reinforcement;
      const t = Math.min(1, (clock - state.at) / (arriving ? 1.5 : 0.55)),
        y = projectY(b.y);
      ctx.save();
      if (t < 1) {
        ctx.globalAlpha = (1 - t) * 0.65;
        ctx.strokeStyle = state.fresh ? "#d4e6a0" : "#ffe38c";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(b.x, y, 25 + t * 26, 14 + t * 15, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        if (!state.fresh) {
          ctx.fillStyle = "#ffe38c";
          for (let i = 0; i < 5; i++)
            ctx.fillRect(
              b.x - 20 + i * 10,
              y - 18 - t * 35 - (i % 2) * 9,
              3,
              6,
            );
        }
        const ease = 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;
        const scale = state.fresh
          ? arriving
            ? 0.15 + 0.85 * ease
            : 0.75 + 0.25 * ease
          : 1 + Math.sin(t * Math.PI) * 0.045;
        if (arriving) {
          ctx.strokeStyle = "#b9ae7d";
          ctx.globalAlpha = 1 - t;
          for (let i = 0; i < 8; i++) {
            const a = (i * Math.PI) / 4;
            ctx.beginPath();
            ctx.ellipse(
              b.x + Math.cos(a) * t * 45,
              y + Math.sin(a) * t * 20,
              4 + t * 8,
              3 + t * 4,
              0,
              0,
              Math.PI * 2,
            );
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }
        ctx.translate(b.x, y - (arriving ? (1 - t) ** 2 * 45 : 0));
        ctx.scale(scale, scale);
        ctx.translate(-b.x, -y);
      }
      paint();
      ctx.restore();
    },
  };
}
