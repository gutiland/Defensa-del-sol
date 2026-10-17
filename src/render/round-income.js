import { COPY } from "../data/copy.js";
import { projectY } from "../data/map.js";
import { hasDefender } from "../data/building-look.js";
import { drawCharacter, drawSpeech } from "./characters.js";

export function createIncomeState() {
  let currentGame,
    seen = new WeakSet(),
    active = null;
  return (game, dt) => {
    if (game !== currentGame) {
      currentGame = game;
      seen = new WeakSet();
      active = null;
      // Loading an existing preparation must not replay money already awarded.
      for (const effect of game.effects)
        if (effect.type === "round-income") seen.add(effect);
    }
    if (game.phase !== "build" || game.result) {
      active = null;
      return null;
    }
    for (const effect of game.effects) {
      if (effect.type !== "round-income" || seen.has(effect)) continue;
      seen.add(effect);
      active = {
        event: effect,
        age: 0,
        speech: {
          character: "hummus",
          text: COPY.mealLines[(effect.round - 1) % COPY.mealLines.length],
          x: effect.x + (effect.buildingId === "base" ? -22 : 18),
          y: effect.y - 13,
        },
      };
    }
    if (!active) return null;
    active.age += Math.max(0, dt);
    if (active.age >= 4) active = null;
    return active;
  };
}

export function drawRoundIncome(
  ctx,
  game,
  state,
  reducedMotion = false,
  speechCtx = ctx,
  speechViewport,
) {
  if (!state) return;
  const { event, age, speech } = state;
  const source = [game.base, ...game.buildings].find(
    (b) => b.id === event.buildingId,
  );
  if (!source || source.hp <= 0) return;
  const x = event.x,
    y = projectY(event.y);
  ctx.save();
  if (source.type !== "kitchen" || !hasDefender(source))
    drawCharacter(
      ctx,
      "hummus",
      x + (source.id === "base" ? -22 : 22),
      y - 13,
      0.75,
      reducedMotion ? 0 : age,
      "kitchen",
      { moving: false, talking: true, celebrate: reducedMotion ? 0 : 1 },
    );
  const progress = Math.min(1, age / 1.5);
  const lift = reducedMotion ? 0 : Math.sin(progress * Math.PI) * 18;
  ctx.fillStyle = "#20362af5";
  const labelX = Math.max(6, Math.min(804, x - 95));
  const labelY = Math.max(8, Math.min(632, y + 32 - lift));
  ctx.fillRect(labelX, labelY, 190, 42);
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffe18a";
  ctx.font = "bold 15px sans-serif";
  ctx.fillText(`+${event.amount} provisiones`, labelX + 95, labelY + 17);
  ctx.font = "11px sans-serif";
  ctx.fillStyle = "#fff1ce";
  ctx.fillText(
    `${event.amount - event.kitchenAmount} ronda · ${event.kitchenAmount} cocina`,
    labelX + 95,
    labelY + 33,
  );
  if (!reducedMotion)
    for (let i = 0; i < 7; i++) {
      const t = Math.max(0, Math.min(1, (age - i * 0.09) / 1.4));
      if (t <= 0 || t >= 1) continue;
      ctx.globalAlpha = Math.sin(t * Math.PI);
      ctx.fillStyle = "#f4ce66";
      ctx.strokeStyle = "#8c632b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(
        x + (110 - x) * t,
        y + (640 - y) * t - Math.sin(t * Math.PI) * 45,
        4,
        6,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.stroke();
    }
  ctx.restore();
  drawSpeech(speechCtx, speech, speechViewport);
}
