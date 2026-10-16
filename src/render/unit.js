import { bossState } from "../boss-mechanics.js";
import { projectY } from "../data/map.js";
import { drawCharacter } from "./characters.js";
import { drawGroundMotion } from "./effects.js";
import { drawAttackerAbilities } from "./attacker-abilities.js";
import { drawImpactFeedback } from "./impact-feedback.js";

export function drawUnit(ctx, u, game, time, sources, sprites, view = {}) {
  const state = bossState(game, u, sources);
  if (
    u.scale ||
    state.shield ||
    state.speed > 1 ||
    game.time < game.freezeUntil ||
    state.armor
  ) {
    ctx.save();
    ctx.strokeStyle =
      game.time < game.freezeUntil
        ? "#a9edff"
        : state.shield
          ? "#77baff"
          : state.speed > 1
            ? "#ffae60"
            : "#bfc8cc";
    ctx.lineWidth = state.shield ? 4 : 2;
    ctx.beginPath();
    ctx.ellipse(u.x, projectY(u.y) - 16, 30, 40, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  const slipping = u.slipRemaining > 0;
  const dustStride = Math.max(1, Math.ceil(game.units.length / 80));
  if (
    !view.reducedMotion &&
    view.quality !== "low" &&
    (u.scale || u.id % dustStride === 0)
  )
    drawGroundMotion(ctx, u, time, game.time >= game.freezeUntil && !slipping);
  ctx.save();
  if (slipping) {
    const elapsed = 1.6 - u.slipRemaining;
    const fall =
      elapsed < 0.3
        ? elapsed / 0.3
        : elapsed < 1
          ? 1
          : Math.max(0, (1.6 - elapsed) / 0.6);
    const y = projectY(u.y) + 20;
    ctx.strokeStyle = "#d9f1f0aa";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(u.x, y, 10 + fall * 13, 3 + fall * 3, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.translate(u.x, y);
    if (!view.reducedMotion) ctx.rotate((u.id % 2 ? 1 : -1) * fall * 1.35);
    ctx.translate(-u.x, -y);
  }
  (sprites?.draw || drawCharacter)(
    ctx,
    u.character,
    u.x,
    projectY(u.y),
    u.scale || (u.kind === "heavy" ? 1.15 : 1),
    view.reducedMotion ? 0 : time,
    u.role || u.kind,
    {
      seed: u.id,
      talking: game.phase === "combat" && !game.result && !slipping,
      moving:
        !view.reducedMotion &&
        game.time >= game.freezeUntil &&
        u.cooldown <= 0 &&
        !u.waiting &&
        !u.raidingId &&
        !u.blockedBy &&
        !slipping,
      release: Math.max(0, 1 - (game.time - (u.lastStrike ?? -100)) / 0.25),
      hit:
        !view.reducedMotion &&
        !u.hitContinuous &&
        game.time - (u.lastHit ?? -100) < 0.14,
    },
  );
  ctx.save();
  ctx.translate(u.x, projectY(u.y));
  drawImpactFeedback(ctx, u, game, view.flashes !== false);
  ctx.restore();
  ctx.restore();
  if (!slipping)
    drawAttackerAbilities(ctx, u, game, view.reducedMotion ? 0 : time);
  if (u.raidingId && !slipping && game.time >= game.freezeUntil) {
    const target = game.buildings.find((b) => b.id === u.raidingId && b.hp > 0);
    if (target) {
      ctx.save();
      ctx.strokeStyle = "#db7839";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(u.x, projectY(u.y) - 15);
      ctx.lineTo(target.x, projectY(target.y) - 12);
      ctx.stroke();
      ctx.strokeStyle = "#b6382e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(target.x, projectY(target.y), 25, 17, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
  if (u.kind.startsWith("boss")) {
    ctx.save();
    ctx.fillStyle = "#16352e";
    ctx.fillRect(u.x - 70, projectY(u.y) - 108, 140, 17);
    ctx.fillStyle = "#ffe79b";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(state.phase, u.x, projectY(u.y) - 96);
    ctx.restore();
  }
}

export function drawUnitLabel(ctx, u, game, bar, sources) {
  bar(
    u.x,
    projectY(u.y) - (u.scale ? 84 : 53),
    u.hp,
    u.maxHp,
    u.scale ? 62 : 24,
  );
}

export function drawUnitBars(ctx, units) {
  ctx.save();
  // Three batches replace two fillRect/style changes per attacker.
  for (const group of ["background", "healthy", "critical"]) {
    ctx.fillStyle =
      group === "background"
        ? "#334641"
        : group === "healthy"
          ? "#83cbaa"
          : "#eb8069";
    ctx.beginPath();
    for (const u of units) {
      const ratio = Math.max(0, u.hp / u.maxHp);
      if (group !== "background" && ratio > 0.35 !== (group === "healthy"))
        continue;
      const width = u.scale ? 62 : 24;
      ctx.rect(
        u.x - width / 2,
        projectY(u.y) - (u.scale ? 84 : 53),
        group === "background" ? width : width * ratio,
        5,
      );
    }
    ctx.fill();
  }
  ctx.restore();
}
