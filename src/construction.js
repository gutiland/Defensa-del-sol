import { BUILDINGS } from "./data/catalog.js";
import { BRANCHES } from "./data/progression.js";

export function refundableCost(b) {
  return (
    BUILDINGS[b.type].cost +
    (30 * b.level * (b.level - 1)) / 2 +
    (b.branch ? BRANCHES[b.type][b.branch][2] : 0)
  );
}
export function canRemove(game, b) {
  return (
    !!b &&
    b.id !== "base" &&
    !game.result &&
    (game.sandbox ||
      (game.mode === "defense" && game.phase === "build" && b.refundable))
  );
}
export function removeConstruction(game, id) {
  const b = game.buildings.find((b) => b.id === id);
  if (!canRemove(game, b)) return false;
  game.money += refundableCost(b);
  game.buildings = game.buildings.filter((item) => item !== b);
  return true;
}
