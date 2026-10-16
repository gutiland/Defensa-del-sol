import { canDefend } from "../data/progression.js";

export const BUILD_KEYS = [
  "tent",
  "area",
  "speaker",
  "odor",
  "kitchen",
  "barrier",
];
export function handleShortcut(event, { game, selectKind, cancel, command }) {
  if (
    !game ||
    game.result ||
    event.repeat ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.target?.isContentEditable ||
    ["BUTTON", "INPUT", "TEXTAREA", "SELECT", "A"].includes(
      event.target?.tagName,
    )
  )
    return false;
  if (event.code === "Escape") cancel();
  else if (event.code === "Enter" && game.phase !== "combat")
    command({ type: "ready" });
  else if (
    event.code === "KeyQ" &&
    game.mode === "defense" &&
    game.phase === "combat"
  )
    command({ type: "ability" });
  else if (/^Digit[1-6]$/.test(event.code) && canDefend(game))
    selectKind(BUILD_KEYS[Number(event.code.slice(-1)) - 1]);
  else return false;
  event.preventDefault();
  return true;
}
