import { drawDefenseStructure } from "./defense-structure.js";
import { projectY } from "../data/map.js";
import { buildingScale, hasDefender } from "../data/building-look.js";
import { CHARACTERS, buildingDefender } from "../data/characters.js";
export function createSprites(ctx) {
  // Share artwork between equal shelters. Damage, residents and animation stay live.
  const structures = new Map();
  function structure(type, level, base) {
    const key = `${type}:${level}:${base}`;
    let image = structures.get(key);
    if (!image) {
      image = document.createElement("canvas");
      image.width = 384;
      image.height = 384;
      const paint = image.getContext("2d");
      paint.scale(2, 2);
      paint.translate(96, 96);
      drawDefenseStructure(paint, type, level, base);
      structures.set(key, image);
    }
    ctx.drawImage(image, -96, -96, 192, 192);
  }
  function text(t, x, y, size = 14, color = "#334641") {
    ctx.fillStyle = color;
    ctx.font = `600 ${size}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(t, x, y);
  }
  function bar(x, y, hp, max, w = 48) {
    ctx.fillStyle = "#334641";
    ctx.fillRect(x - w / 2, y, w, 5);
    ctx.fillStyle = hp / max > 0.35 ? "#83cbaa" : "#eb8069";
    ctx.fillRect(x - w / 2, y, w * Math.max(0, hp / max), 5);
  }
  function tent(b, base = false) {
    ctx.save();
    ctx.translate(b.x, projectY(b.y));
    ctx.scale(buildingScale(b), buildingScale(b));
    structure(b.type, b.level, base);
    if (b.hp / b.maxHp < 0.65) {
      ctx.strokeStyle = "#363c2e99";
      ctx.lineWidth = 1;
      for (let i = 0; i < Math.ceil((1 - b.hp / b.maxHp) * 5); i++) {
        ctx.beginPath();
        ctx.moveTo(9 + i * 4, -8 + i * 3);
        ctx.lineTo(5 + i * 5, 2 + i * 3);
        ctx.stroke();
      }
    }
    ctx.restore();
    if (base || b.id === "base" || b.type === "barrier")
      bar(b.x, projectY(b.y) + 26, b.hp, b.maxHp);
    if (hasDefender(b)) {
      const name = CHARACTERS[buildingDefender(b)].name;
      const y = projectY(b.y) + (base || b.type === "barrier" ? 42 : 34);
      ctx.save();
      ctx.font = "600 8px sans-serif";
      const width = Math.min(78, ctx.measureText(name).width) + 8;
      ctx.fillStyle = "#fff1d8";
      ctx.fillRect(b.x - width / 2, y - 9, width, 13);
      ctx.fillStyle = "#243b2d";
      ctx.textAlign = "center";
      ctx.fillText(name, b.x, y, 78);
      ctx.restore();
    }
  }
  return { text, bar, tent };
}
