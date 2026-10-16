import { CHARACTERS } from "../data/characters.js";
import { drawCharacter } from "../render/characters.js";
import { DEFAULT_ROLES, ROLE_LABELS } from "../data/roles.js";
import { FEATURED_CHARACTERS } from "../data/featured-characters.js";
export function mountGallery(document) {
  const container = document.getElementById("characters-gallery");
  container.replaceChildren();
  for (const id of FEATURED_CHARACTERS) {
    const actor = CHARACTERS[id];
    const card = document.createElement("div");
    card.className = "character-card";
    const portrait = document.createElement("canvas");
    portrait.width = 200;
    portrait.height = 220;
    portrait.setAttribute("aria-hidden", "true");
    drawCharacter(portrait.getContext("2d"), id, 110, 140, 2.05);
    const name = document.createElement("strong");
    name.textContent = actor.name;
    const side = document.createElement("small");
    side.textContent = ROLE_LABELS[DEFAULT_ROLES[id]];
    card.append(portrait, name, side);
    container.append(card);
  }
}
