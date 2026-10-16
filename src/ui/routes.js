import { ENTRIES } from "../data/catalog.js";
const $ = (id) => document.getElementById(id);
export function renderRoutes(game, selectedEntries, toggleEntry) {
  const container = $("routes");
  container.hidden = game.phase !== "attack";
  container.replaceChildren();
  ENTRIES.forEach((entry, i) => {
    const button = document.createElement("button");
    const count = game.queue.filter((unit) => unit.entry === i).length;
    button.textContent = `${entry.name}${count ? ` · ${count}` : ""}`;
    button.classList.toggle("active", selectedEntries.includes(i));
    button.setAttribute("aria-pressed", String(selectedEntries.includes(i)));
    button.onclick = () => toggleEntry(i);
    container.append(button);
  });
}
export function routeSummary(queue) {
  return ENTRIES.map((entry, i) => {
    const count = queue.filter((unit) => unit.entry === i).length;
    return count ? `${entry.name}: ${count}` : null;
  })
    .filter(Boolean)
    .join(" · ");
}
