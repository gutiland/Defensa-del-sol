import { drawAttackPose } from "./poses.js";
import { drawEquipment } from "./equipment.js";
import { DEFAULT_ROLES } from "../data/roles.js";
import { drawFace } from "./face.js";
import { drawFlag } from "./flags.js";
import { characterFlag } from "../data/characters.js";
import { drawOutfit, drawHairDetails } from "./accessories.js";
import { CHARACTERS } from "../data/characters.js";
import { projectY } from "../data/map.js";

export function drawCharacter(
  ctx,
  id,
  x,
  y,
  scale = 1,
  time = 0,
  role = DEFAULT_ROLES[id],
  pose = {},
) {
  const c = CHARACTERS[id];
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const walking = pose.moving !== false;
  const motionTime = time + id.length * 0.37 + (pose.seed || 0) * 0.63;
  const speed =
    role === "sprinter"
      ? 17
      : role === "fast"
        ? 13
        : ["heavy", "armored"].includes(role)
          ? 5
          : 8;
  const stride = walking
    ? Math.sin(motionTime * speed) *
      (["fast", "sprinter"].includes(role) ? 5.5 : 3.6)
    : 0;
  ctx.fillStyle = "#17201c24";
  ctx.beginPath();
  ctx.ellipse(2, 21, 13, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  const cheer = (pose.celebrate || 0) * Math.max(0, Math.sin(motionTime * 11));
  ctx.translate(0, -cheer * 13);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = "#283528";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-4, 10);
  ctx.lineTo(-6 + stride, 22);
  ctx.moveTo(4, 10);
  ctx.lineTo(6 - stride, 22);
  ctx.stroke();
  ctx.strokeStyle = "#657451";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-4, 10);
  ctx.lineTo(-6 + stride, 21);
  ctx.moveTo(4, 10);
  ctx.lineTo(6 - stride, 21);
  ctx.stroke();
  ctx.fillStyle = "#33382a";
  ctx.beginPath();
  ctx.ellipse(-7 + stride, 23, 5, 2.5, -0.15, 0, Math.PI * 2);
  ctx.ellipse(7 - stride, 23, 5, 2.5, 0.15, 0, Math.PI * 2);
  ctx.fill();
  const bounce = walking
    ? Math.abs(Math.sin(motionTime * speed)) *
      (["fast", "sprinter"].includes(role) ? 3.8 : 2.5)
    : Math.sin(motionTime * 2) * 0.8;
  ctx.translate(0, -bounce);
  if (walking) ctx.rotate(Math.sin(motionTime * speed) * 0.035);
  if (pose.hit) {
    ctx.translate(-3, 1);
    ctx.rotate(-0.14);
  }
  ctx.translate(-(pose.windup || 0) * 4 + (pose.release || 0) * 5, 0);
  if (["fast", "sprinter"].includes(role) && walking)
    ctx.rotate(role === "sprinter" ? -0.2 : -0.13);
  if (["heavy", "armored"].includes(role)) ctx.scale(1.15, 1);
  const squash =
    1 +
    (pose.release || 0) * 0.13 +
    (walking ? Math.sin(motionTime * speed * 2) * 0.025 : 0);
  ctx.scale(squash, 1 / squash);
  ctx.fillStyle = c.shirt;
  ctx.strokeStyle = "#30392a";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-4, -3);
  ctx.quadraticCurveTo(-12, -3, -12, 8);
  ctx.lineTo(-10, 15);
  ctx.quadraticCurveTo(0, 18, 11, 14);
  ctx.lineTo(10, 2);
  ctx.quadraticCurveTo(8, -4, 4, -3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff25";
  ctx.beginPath();
  ctx.moveTo(-8, 1);
  ctx.lineTo(-3, 0);
  ctx.lineTo(-4, 12);
  ctx.lineTo(-8, 10);
  ctx.fill();
  ctx.strokeStyle = "#30392a77";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, 1);
  ctx.lineTo(1, 13);
  ctx.moveTo(-6, 10);
  ctx.lineTo(-3, 12);
  ctx.stroke();
  ctx.save();
  ctx.translate(0, -3);
  ctx.scale(1.12, 1.06);
  const mouth = pose.talking
    ? (0.5 + 0.5 * Math.sin(motionTime * 15)) *
      (0.65 + 0.35 * Math.sin(motionTime * 5) ** 2)
    : pose.celebrate
      ? 0.7
      : 0;
  drawFace(ctx, c, id, mouth);
  drawHairDetails(ctx, c);
  ctx.restore();
  if (pose.celebrate) {
    ctx.strokeStyle = c.skin;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-9, 1);
    ctx.lineTo(-17, -14 - cheer * 5);
    ctx.moveTo(9, 1);
    ctx.lineTo(17, -14 - cheer * 5);
    ctx.stroke();
    ctx.fillStyle = c.skin;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(side * 17, -15 - cheer * 5, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  drawOutfit(ctx, c);
  drawFlag(ctx, characterFlag(id), motionTime);
  if (!((role === "tent" || role === "area") && pose.weapon))
    drawEquipment(ctx, role, c.side, motionTime, pose);
  drawAttackPose(ctx, pose, role);
  if (pose.hit) {
    ctx.strokeStyle = "#f5d2aaab";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, -8, 13, 23, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawSpeech(ctx, speech) {
  const actor = CHARACTERS[speech.character];
  ctx.save();
  ctx.font = "12px sans-serif";
  const words = speech.text.split(" "),
    lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? line + " " + word : word;
    if (ctx.measureText(next).width > 240 && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  const width = 270,
    height = 39 + lines.length * 17;
  const x = Math.max(8, Math.min(722, speech.x - width / 2)),
    y = Math.max(8, Math.min(590, projectY(speech.y) - height - 35));
  ctx.shadowColor = "#0003";
  ctx.shadowBlur = 9;
  ctx.fillStyle = "#fff2c8";
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 13);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#34412b";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + width / 2 - 6, y + height);
  ctx.lineTo(x + width / 2 - 2, y + height + 9);
  ctx.lineTo(x + width / 2 + 8, y + height);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#333b33";
  ctx.textAlign = "left";
  ctx.font = "bold 10px sans-serif";
  ctx.fillText(
    speech.quote
      ? `${speech.quote.speaker} · CITA REAL`
      : actor.name + " · PARODIA",
    x + 12,
    y + 17,
  );
  ctx.font = "12px sans-serif";
  lines.forEach((text, i) => ctx.fillText(text, x + 12, y + 37 + i * 17));
  ctx.restore();
}
