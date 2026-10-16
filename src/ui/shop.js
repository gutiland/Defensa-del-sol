import { canDefend } from "../data/progression.js";
import { BUILD_KEYS } from "./shortcuts.js";
import { drawCharacter } from "../render/characters.js";
import { drawDefenseStructure } from "../render/defense-structure.js";
import { ROLE_LABELS } from "../data/roles.js";
import {
  CHARACTERS,
  attackerCharacter,
  defenderCharacter,
} from "../data/characters.js";
import { COPY } from "../data/copy.js";
import { BUILDINGS, UNITS, ENTRIES } from "../data/catalog.js";
const $ = (id) => document.getElementById(id);
export function renderShop(
  { game, kind, selectedEntries },
  { command, selectKind },
) {
  const attacking = game.phase === "attack";
  $("shopLabel").textContent = COPY.shop[attacking ? "attack" : "build"];
  $("shop").replaceChildren();
  const entry = selectedEntries[game.queue.length % selectedEntries.length];
  for (const [key, d] of Object.entries(attacking ? UNITS : BUILDINGS)) {
    const b = document.createElement("button");
    b.textContent = `${d.icon} ${d.name}`;
    const price = document.createElement("span"),
      description = document.createElement("small");
    price.textContent = `${d.cost} ◈`;
    description.className = "shop-description";
    description.textContent =
      d.desc || `Resistencia ${d.hp} · Velocidad ${d.speed}`;
    b.append(price, description);
    b.setAttribute(
      "aria-label",
      `${d.name}, ${d.cost} provisiones. ${d.desc || `Resistencia ${d.hp}, velocidad ${d.speed}`}`,
    );
    const roleLabel = document.createElement("small");
    roleLabel.textContent = d.scale ? "JEFE FINAL" : ROLE_LABELS[key];
    b.append(roleLabel);
    if (attacking) {
      const route = document.createElement("small");
      route.textContent =
        entry === undefined
          ? "Selecciona al menos una calle"
          : `Próximo recluta → ${ENTRIES[entry].name}`;
      b.append(route);
    }
    const character = attacking
      ? attackerCharacter(key)
      : defenderCharacter(key);
    const portrait = document.createElement("canvas");
    portrait.width = 100;
    portrait.height = 120;
    portrait.className = "character-portrait";
    portrait.setAttribute("aria-hidden", "true");
    if (!attacking) {
      const ctx = portrait.getContext("2d");
      ctx.save();
      ctx.translate(27, 87);
      ctx.scale(0.6, 0.6);
      drawDefenseStructure(ctx, key, 1);
      ctx.restore();
    }
    drawCharacter(
      portrait.getContext("2d"),
      character,
      63,
      74,
      1.1,
      0,
      d.role || key,
    );
    b.append(portrait);
    b.classList.toggle("has-portrait", true);
    b.title = CHARACTERS[character].name;
    b.title += ` · ${d.desc || `Resistencia ${d.hp}, velocidad ${d.speed}`}`;
    b.classList.toggle("active", !attacking && kind === key);
    if (!attacking) {
      b.setAttribute("aria-pressed", String(kind === key));
      b.title += ` · Tecla ${BUILD_KEYS.indexOf(key) + 1} para colocar`;
    }
    b.disabled =
      (!attacking && !canDefend(game)) ||
      game.money < d.cost ||
      (attacking && entry === undefined);
    b.dataset.cost = d.cost;
    b.dataset.shop = "true";
    b.onclick = () => {
      if (attacking) command({ type: "recruit", kind: key, entry });
      else {
        selectKind(key);
      }
    };
    $("shop").append(b);
  }
}
