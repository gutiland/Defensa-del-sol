import { CHARACTERS } from "./data/characters.js";
import { buildingDefender } from "./data/characters.js";
import { hasDefender } from "./data/building-look.js";

export function constructionDialogue(game, building) {
  if (!hasDefender(building)) return;
  const character = buildingDefender(building),
    actor = CHARACTERS[character];
  game.speeches = [
    {
      character,
      text: actor.entrance || actor.lines[building.id % actor.lines.length],
      x: building.x + 18,
      y: building.y - 13,
      buildingId: building.id,
      construction: true,
      until: game.time + 4,
    },
  ];
  game.nextSpeechAt = game.time + 4;
}
export function tryDialogue(game, character, source) {
  if (game.time < game.nextSpeechAt) return false;
  game.dialogueCount++;
  // An occasional exchange, never a bubble on every hit.
  if (game.dialogueCount % 3 !== 1) return false;
  const actor = CHARACTERS[character];
  if (actor.side === game.lastSpeechSide) return false;
  const index = (game.round + game.dialogueCount) % actor.lines.length;
  const quote = actor.quotes?.[index];
  game.speeches = [
    {
      character,
      text: actor.lines[index],
      quote,
      x: source.x,
      y: source.y,
      until: game.time + 4,
    },
  ];
  game.nextSpeechAt = game.time + 5;
  game.lastSpeechSide = actor.side;
  return true;
}
