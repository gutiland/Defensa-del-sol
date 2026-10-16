import { BRANCHES, canDefend } from "../data/progression.js";
import {
  weaponFor,
  maxLevel,
  TENT_WEAPONS,
  rangeFor,
  equipmentFor,
} from "../data/weapons.js";
import { odorStats } from "../stereotypes.js";
import { BUILDINGS } from "../data/catalog.js";
import { CHARACTERS } from "../data/characters.js";
import { canRemove, refundableCost } from "../construction.js";
import { projectY } from "../data/map.js";
const $ = (id) => document.getElementById(id);
const WEAPON_ICONS = ["🪨", "🪨", "🍾", "🔥"];
const BRANCH_LABELS = {
  tent: [
    ["⏱", "−35%"],
    ["⚔", "+55%"],
  ],
  area: [
    ["⏱", "−30%"],
    ["◎", "95"],
  ],
  speaker: [
    ["🐌", "3s"],
    ["⚔", "+90%"],
  ],
  odor: [
    ["◎", "+45"],
    ["☁", "+2/s"],
  ],
  kitchen: [
    ["🍲", "+15/↻"],
    ["🍲", "+2/5s"],
  ],
  barrier: [
    ["🛡", "+240"],
    ["❤️", "+12/s"],
  ],
};
const SHORT_NAMES = {
  tent: "Caseta",
  area: "Área",
  speaker: "Radio",
  odor: "Olor",
  kitchen: "Cocina",
  barrier: "Barrera",
};
let selectionView = null;
export function refreshSelectionStats(game) {
  if (selectionView?.game !== game) return;
  const b = [game.base, ...game.buildings].find(
    (item) => item.id === selectionView.id,
  );
  if (!b) {
    $("selection").replaceChildren();
    $("selection").textContent = "Esta construcción ha sido destruida.";
    $("selection").hidden = true;
    selectionView = null;
    return;
  }
  selectionView.title.textContent = `${BUILDINGS[b.type].icon} ${b.id === "base" ? "Base" : SHORT_NAMES[b.type]} · N${b.level}`;
  selectionView.title.title = `Resistencia: ${Math.ceil(b.hp)}/${b.maxHp}`;
}
export function renderSelection(
  { game, selected },
  command,
  onClose = () => {},
) {
  selectionView = null;
  $("selection").replaceChildren();
  const b = [game.base, ...game.buildings].find((b) => b.id === selected);
  $("selection").hidden = !b;
  if (b) {
    const py = projectY(b.y);
    const style = $("selection").style;
    if (style) {
      style.left = `clamp(min(128px,50%),${b.x / 10}%,calc(100% - min(128px,50%)))`;
      style.top = `${(py / 680) * 100}%`;
    }
    $("selection").setAttribute("data-placement", py < 300 ? "below" : "above");
    const close = document.createElement("button");
    close.textContent = "×";
    close.className = "popover-close";
    close.setAttribute("aria-label", "Cerrar mejoras");
    close.onclick = () => {
      $("selection").hidden = true;
      selectionView = null;
      onClose();
    };
    $("selection").append(close);
    const title = document.createElement("p");
    title.className = "popover-title";
    $("selection").append(title);
    selectionView = { game, id: b.id, title };
    refreshSelectionStats(game);
    const definition = BUILDINGS[b.type];
    const details = document.createElement("p");
    const weapon = weaponFor(b, definition);
    details.textContent = definition.damage
      ? `Daño ${Math.round(weapon.damage)} · Disparo cada ${weapon.rate.toFixed(2)} s · Alcance ${rangeFor(b, definition)}${weapon.splash ? ` · Radio ${weapon.splash}` : ""}${weapon.fire ? ` · Fuego: ${weapon.fire.dps} daño/s, radio ${weapon.fire.radius}, ${weapon.fire.duration} s` : ""}`
      : b.type === "odor"
        ? `Olor: ${odorStats(b, game).dps} daño/s · Radio ${odorStats(b, game).radius}. No ralentiza ni se acumula. Perfumados inmunes.`
        : b.type === "kitchen"
          ? `Produce ${15 * b.level + (b.branch === "rapid" ? 15 : 0)} provisiones por ronda${b.branch === "power" ? " y 2 cada 5 s de combate" : ""}`
          : "Bloquea el paso hasta que la destruyen. No ataca ni causa daño";
    const info = document.createElement("details"),
      summary = document.createElement("summary");
    const secondary = document.createElement("div");
    secondary.className = "popover-secondary";
    summary.textContent = "ⓘ";
    summary.setAttribute("aria-label", "Ver estadísticas y especialidades");
    summary.title = "Estadísticas y especialidades";
    info.append(summary, details);
    const equipment = equipmentFor(b.type, b.level);
    if (equipment) {
      const current = document.createElement("p");
      current.textContent = `${equipment.icon} ${equipment.name}`;
      info.append(current);
    }
    if (canRemove(game, b)) {
      const remove = document.createElement("button");
      remove.textContent = game.sandbox ? "🗑" : `↶ +${refundableCost(b)}`;
      remove.title = game.sandbox
        ? "Eliminar caseta"
        : "Retirar y recuperar provisiones";
      remove.setAttribute(
        "aria-label",
        game.sandbox
          ? "Eliminar caseta"
          : `Retirar: recuperar ${refundableCost(b)} provisiones`,
      );
      remove.onclick = () => command({ type: "remove", id: b.id });
      secondary.append(remove);
    }
    if (game.sandbox && b.branch) {
      const reset = document.createElement("button");
      reset.textContent = "↻";
      reset.title = "Cambiar especialidad";
      reset.setAttribute("aria-label", "Cambiar especialidad");
      reset.onclick = () => command({ type: "admin-branch-reset", id: b.id });
      secondary.append(reset);
    }
    if (b.id === "base") {
      const spokesperson = document.createElement("p");
      spokesperson.textContent = `${CHARACTERS.spokesperson.name} · Portavoz del campamento`;
      info.append(spokesperson);
    }
    if (b.level < maxLevel(b.type) && canDefend(game)) {
      const btn = document.createElement("button");
      const upgradeLabel =
        b.type === "tent"
          ? `↑ ${TENT_WEAPONS[b.level].name} · ${b.level * 30}`
          : `↑ ${equipmentFor(b.type, b.level + 1).name} · ${b.level * 30}`;
      btn.textContent = `↑ ${b.type === "tent" ? WEAPON_ICONS[b.level] : equipmentFor(b.type, b.level + 1).icon} N${b.level + 1} · ${b.level * 30}`;
      btn.title = upgradeLabel;
      btn.setAttribute("aria-label", `${upgradeLabel} provisiones`);
      btn.className = "upgrade-primary";
      btn.dataset.cost = b.level * 30;
      btn.disabled = game.money < b.level * 30;
      btn.onclick = () => command({ type: "upgrade", id: b.id });
      $("selection").append(btn);
    }
    if (b.branch) {
      const note = document.createElement("p");
      const label = BRANCH_LABELS[b.type][b.branch === "rapid" ? 0 : 1];
      note.textContent = `✓ ${label.join(" ")}`;
      note.title = BRANCHES[b.type][b.branch][1];
      note.setAttribute(
        "aria-label",
        BRANCHES[b.type][b.branch].slice(0, 2).join(": "),
      );
      const explanation = document.createElement("p");
      explanation.textContent = BRANCHES[b.type][b.branch]
        .slice(0, 2)
        .join(": ");
      info.append(explanation);
      $("selection").append(note);
    } else if (canDefend(game)) {
      const choices = document.createElement("div");
      choices.className = "specialty-choices";
      for (const [branch, [name, description, cost]] of Object.entries(
        BRANCHES[b.type],
      )) {
        const button = document.createElement("button");
        const [icon, short] = BRANCH_LABELS[b.type][branch === "rapid" ? 0 : 1];
        const symbol = document.createElement("span"),
          caption = document.createElement("span"),
          price = document.createElement("span");
        symbol.textContent = icon;
        symbol.setAttribute("aria-hidden", "true");
        caption.textContent = short;
        caption.className = "specialty-name";
        price.textContent = `◈ ${cost}`;
        price.className = "specialty-price";
        button.append(symbol, caption, price);
        button.title = `${description}. Elección permanente: excluye la otra rama.`;
        button.setAttribute(
          "aria-label",
          `${name}, ${cost} provisiones. ${description}. Elección permanente.`,
        );
        const explanation = document.createElement("p");
        explanation.textContent = `${name}: ${description}`;
        info.append(explanation);
        button.dataset.cost = cost;
        button.disabled = game.money < cost;
        button.onclick = () =>
          command({ type: "specialize", id: b.id, branch });
        choices.append(button);
      }
      $("selection").append(choices);
    }
    $("selection").append(info);
    $("selection").append(secondary);
  }
}
