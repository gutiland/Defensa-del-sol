import { drawWeapon } from "./weapon-art.js";
import { projectY } from "../data/map.js";
import { impactColor } from "./impact-feedback.js";

export function drawCombatEffects(ctx, effects, intensity = 0) {
  ctx.save();
  for (const e of effects) {
    if (e.type === "round-income") continue;
    const t = Math.max(0, Math.min(1, 1 - e.life / (e.duration || 0.4)));
    const x = e.x,
      y = projectY(e.y),
      tx = e.tx,
      ty = projectY(e.ty);
    ctx.globalAlpha = 1 - t;
    if (e.type === "reward") {
      ctx.save();
      ctx.fillStyle = "#17392e";
      ctx.fillRect(tx - 25, ty - 48 - t * 20, 50, 20);
      ctx.fillStyle = "#ffe394";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(e.text || "", tx, ty - 34 - t * 20);
      ctx.restore();
      ctx.fillStyle = "#f2d778";
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(
          tx + (i - 1) * 6,
          ty - 20 - t * 26 - i * 3,
          2.5,
          3.5,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    } else if (e.type === "assembly") {
      ctx.strokeStyle = "#9ce6ff";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(tx, ty, 40 + t * 650, 25 + t * 420, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (e.type === "sound") {
      if (e.radius) {
        ctx.strokeStyle = "#e2f3b8";
        ctx.lineWidth = 2.5;
        const rings = Math.min(5, 1 + (e.level || 1));
        for (let i = 0; i < rings; i++) {
          const progress = (t + i / rings) % 1;
          ctx.globalAlpha = (1 - t) * (1 - progress) * 0.65;
          ctx.beginPath();
          ctx.ellipse(
            x,
            y,
            e.radius * progress,
            e.radius * progress * 0.66,
            0,
            0,
            Math.PI * 2,
          );
          ctx.stroke();
        }
        continue;
      }
      const angle = Math.atan2(ty - y, tx - x);
      ctx.strokeStyle = "#d3ded0";
      ctx.lineWidth = 2.4;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(x, y, 9 + t * 45 + i * 9, angle - 0.48, angle + 0.48);
        ctx.stroke();
      }
    } else if (e.type === "splash") {
      const explosive =
        e.weaponType === "firecracker" || e.weaponType === "grenade";
      const radius = (e.radius || 65) * (0.3 + t * 0.7);
      ctx.fillStyle = explosive
        ? "#f0a23b44"
        : e.weaponType === "paintcan"
          ? "#39b8cc55"
          : "#a16aba55";
      ctx.strokeStyle = impactColor(e.weaponType);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(tx, ty, radius, radius * 0.66, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (let i = 0; i < 10 + Math.round(intensity * 8); i++) {
        const a = i * 2.4;
        ctx.fillStyle = explosive
          ? i % 2
            ? "#e79842"
            : "#fff1aa"
          : impactColor(e.weaponType);
        ctx.beginPath();
        ctx.arc(
          tx + Math.cos(a) * radius,
          ty + Math.sin(a) * radius * 0.66 - Math.sin(t * Math.PI) * 12,
          3.5,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      if (explosive) {
        ctx.strokeStyle = e.weaponType === "grenade" ? "#fff0ad" : "#ffb352";
        ctx.lineWidth = e.weaponType === "grenade" ? 3 : 2;
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          ctx.beginPath();
          ctx.moveTo(
            tx + Math.cos(angle) * radius * 0.3,
            ty + Math.sin(angle) * radius * 0.2,
          );
          ctx.lineTo(
            tx + Math.cos(angle) * radius * 0.8,
            ty + Math.sin(angle) * radius * 0.5,
          );
          ctx.stroke();
        }
      }
    } else if (e.type === "impact" || e.type === "rubble") {
      const rubble = e.type === "rubble";
      const cloud = ctx.createRadialGradient(
        tx,
        ty,
        1,
        tx,
        ty,
        8 + t * (rubble ? 42 : 19),
      );
      cloud.addColorStop(0, "#c3b79755");
      cloud.addColorStop(1, "#b8ac8c00");
      ctx.fillStyle = cloud;
      ctx.beginPath();
      ctx.ellipse(
        tx,
        ty,
        8 + t * (rubble ? 42 : 19),
        4 + t * (rubble ? 18 : 10),
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      for (let i = 0; i < (rubble ? 14 : 7) + Math.round(intensity * 5); i++) {
        const a = i * 2.39996,
          d = (rubble ? 32 : 15) * t;
        ctx.fillStyle = i % 2 ? "#b1a281" : "#766e5b";
        ctx.fillRect(
          tx + Math.cos(a) * d,
          ty + Math.sin(a) * d * 0.5 - Math.sin(t * Math.PI) * 8,
          2 + (i % 3),
          1 + (i % 2),
        );
      }
      if (!rubble) {
        ctx.strokeStyle = "#ffe9b0";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(tx, ty, 4 + t * 12, 2 + t * 6, 0, 0, Math.PI * 2);
        ctx.stroke();
        if (t < 0.65) {
          ctx.strokeStyle = "#fff3cb";
          ctx.lineWidth = 2;
          for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI) / 3,
              inner = 7 + t * 12,
              outer = inner + 8 * (1 - t);
            ctx.beginPath();
            ctx.moveTo(
              tx + Math.cos(a) * inner,
              ty + Math.sin(a) * inner * 0.7,
            );
            ctx.lineTo(
              tx + Math.cos(a) * outer,
              ty + Math.sin(a) * outer * 0.7,
            );
            ctx.stroke();
          }
        }
      }
    } else {
      const px = x + (tx - x) * t,
        py = y + (ty - y) * t - Math.sin(t * Math.PI) * 34;
      {
        ctx.fillStyle = e.type === "molotov" ? "#ffc173" : "#e2d7af";
        for (let i = 1; i <= 3; i++) {
          ctx.globalAlpha = (1 - t) * (0.35 - i * 0.06);
          ctx.beginPath();
          ctx.arc(
            px - (tx - x) * 0.025 * i,
            py - (ty - y) * 0.025 * i,
            2 + intensity,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
        ctx.globalAlpha = 1 - t;
      }
      // A piece of cardboard in flight replaces the old beam.
      ctx.strokeStyle = "#c1b69a45";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px - (tx - x) * 0.09, py - (ty - y) * 0.09);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(t * 5);
      ctx.lineWidth = 0.7;
      drawWeapon(ctx, e.type);
      ctx.restore();
    }
  }
  ctx.restore();
}

export function drawFirePools(ctx, fires, time) {
  ctx.save();
  for (const fire of fires) {
    const x = fire.x,
      y = projectY(fire.y),
      fade = Math.min(1, fire.life / 0.6);
    ctx.globalAlpha = fade;
    ctx.strokeStyle = "#d6b08070";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      fire.radius,
      fire.radius * 0.66,
      0,
      -Math.PI / 2,
      -Math.PI / 2 + (Math.PI * 2 * fire.life) / fire.duration,
    );
    ctx.stroke();
    const glow = ctx.createRadialGradient(x, y, 2, x, y, fire.radius);
    glow.addColorStop(0, "#f5aa4b85");
    glow.addColorStop(0.7, "#c5532f65");
    glow.addColorStop(1, "#30271e00");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(x, y, fire.radius, fire.radius * 0.66, 0, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 12; i++) {
      const angle = i * 2.4,
        r = Math.sqrt(i / 12) * fire.radius * 0.75,
        px = x + Math.cos(angle) * r,
        py = y + Math.sin(angle) * r * 0.66,
        h = 8 + Math.sin(time * 9 + i * 2) * 4;
      ctx.fillStyle = i % 2 ? "#eb7439" : "#f5ab48";
      ctx.beginPath();
      ctx.moveTo(px - 4, py);
      ctx.quadraticCurveTo(
        px - 5,
        py - h * 0.6,
        px + Math.sin(time * 7 + i) * 3,
        py - h,
      );
      ctx.quadraticCurveTo(px + 5, py - h * 0.3, px + 4, py);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffeab0";
      ctx.beginPath();
      ctx.ellipse(px, py - 2, 1.5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < 3; i++) {
      const age = (time * 0.6 + i / 3) % 1;
      ctx.globalAlpha = fade * (1 - age) * 0.12;
      ctx.fillStyle = "#4e5048";
      ctx.beginPath();
      ctx.ellipse(
        x - 14 + i * 14 + age * 9,
        y - 8 - age * 30,
        4 + age * 7,
        6 + age * 10,
        -0.2,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
  ctx.restore();
}

export function drawGroundMotion(ctx, unit, time, moving = true) {
  if (!moving || unit.cooldown > 0 || unit.blockedBy || unit.waiting) return;
  const x = unit.x,
    y = projectY(unit.y) + 20;
  ctx.save();
  ctx.fillStyle = "#bdb49b";
  for (let i = 0; i < 3; i++) {
    const age = (time * 1.8 + i / 3) % 1;
    ctx.globalAlpha = (1 - age) * 0.32;
    ctx.beginPath();
    ctx.ellipse(
      x - 4 + i * 4,
      y + age * 8,
      3 + age * 7,
      2 + age * 3,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.restore();
}

export function gradeEnvironment(ctx) {
  ctx.save();
  const sunlight = ctx.createLinearGradient(0, 0, 1000, 680);
  sunlight.addColorStop(0, "#f5dfad18");
  sunlight.addColorStop(0.5, "#e9ddc105");
  sunlight.addColorStop(1, "#263a4626");
  ctx.fillStyle = sunlight;
  ctx.fillRect(0, 0, 1000, 680);
  const vignette = ctx.createRadialGradient(500, 350, 230, 500, 350, 650);
  vignette.addColorStop(0, "#15212800");
  vignette.addColorStop(1, "#15212838");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, 1000, 680);
  ctx.restore();
}
