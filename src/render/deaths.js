import { drawCharacter } from "./characters.js";
import { projectY } from "../data/map.js";
import { impactColor } from "./impact-feedback.js";

export function createDeathAnimations(
  createCanvas = () => document.createElement("canvas"),
) {
  let previousGame = null,
    previousRevision = null,
    active = [];
  const seen = new Set(),
    portraits = new Map();
  function portrait(death) {
    const role = death.role || death.kind,
      variant = role === "heavy" ? death.id % 5 : 0;
    const key = `${death.character}:${role}:${variant}`;
    if (!portraits.has(key)) {
      const image = createCanvas();
      image.width = 160;
      image.height = 180;
      drawCharacter(
        image.getContext("2d"),
        death.character,
        80,
        100,
        1,
        0,
        role,
        { moving: false, seed: variant },
      );
      if (portraits.size >= 64) portraits.delete(portraits.keys().next().value);
      portraits.set(key, image);
    }
    return portraits.get(key);
  }
  return function drawDeaths(
    ctx,
    game,
    dt,
    { reducedMotion = false, flashes = true, quality = "auto" } = {},
  ) {
    if (game !== previousGame || game.visualRevision !== previousRevision) {
      previousGame = game;
      previousRevision = game.visualRevision;
      seen.clear();
      active = [];
    }
    for (const event of game.deaths) {
      if (seen.has(event.id)) continue;
      seen.add(event.id);
      active.push({ ...event, age: 0 });
    }
    active = active.slice(-96);
    let detailed = quality === "low" ? 8 : 24;
    for (const death of active) {
      death.age += Math.max(0, dt);
      const boss = death.kind.startsWith("boss");
      const duration = boss ? 1.6 : 0.65;
      const progress = Math.min(1, death.age / duration);
      const fall = reducedMotion
        ? 0
        : Math.max(0, Math.min(1, (death.age - (boss ? 0.15 : 0)) / 0.45));
      const x = death.x,
        y = projectY(death.y) + 20;
      const color = impactColor(death.weapon);
      ctx.save();
      ctx.globalAlpha = 1 - progress;
      if (boss || detailed-- > 0) {
        ctx.translate(x, y);
        ctx.rotate((death.direction || 1) * (1 - (1 - fall) ** 3) * 1.5);
        const scale = death.scale || (death.kind === "heavy" ? 1.15 : 1);
        ctx.scale(scale, scale);
        ctx.drawImage(portrait(death), -80, -120);
      } else {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(
          x,
          y - progress * 10,
          8 * (1 - progress),
          4,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.restore();
      if ((boss || detailed > 0) && flashes) {
        ctx.save();
        ctx.globalAlpha = (1 - progress) * 0.65;
        ctx.strokeStyle = color;
        ctx.lineWidth = boss ? 5 : 2;
        ctx.beginPath();
        ctx.ellipse(
          x,
          y - 10,
          8 + progress * (boss ? 95 : 24),
          5 + progress * (boss ? 50 : 12),
          0,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        ctx.restore();
      }
      if (boss) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (1 - progress) * 3);
        ctx.fillStyle = "#18332deb";
        ctx.fillRect(290, 95, 420, 57);
        ctx.textAlign = "center";
        ctx.font = "900 25px sans-serif";
        ctx.fillStyle = "#ffdf70";
        ctx.fillText("¡LA PLAZA RESISTE!", 500, 132);
        ctx.restore();
      }
    }
    active = active.filter(
      (d) => d.age < (d.kind.startsWith("boss") ? 1.6 : 0.65),
    );
    const retained = new Set([...game.deaths, ...active].map((d) => d.id));
    for (const id of seen) if (!retained.has(id)) seen.delete(id);
  };
}
