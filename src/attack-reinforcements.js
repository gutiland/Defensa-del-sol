import { SLOTS } from "./data/catalog.js";
import { placementError } from "./placement.js";

// One new emplacement between assaults; existing damage and defenses persist.
export function reinforceCamp(game, createBuilding) {
  if (game.mode !== "attack" || game.result || game.round < 2) return null;
  const type =
    game.round === 4 || game.round === 7
      ? "area"
      : game.round === 6
        ? "speaker"
        : "tent";
  const candidates = [...SLOTS];
  for (let y = 180; y <= 620; y += 55)
    for (let x = 200; x <= 800; x += 55) candidates.push({ x, y });
  const place = candidates.find((p) => !placementError(game, p.x, p.y, type));
  if (!place) return null;
  const b = createBuilding(type, place.x, place.y, game.nextId++);
  b.reinforcement = true;
  game.buildings.push(b);
  return b;
}
