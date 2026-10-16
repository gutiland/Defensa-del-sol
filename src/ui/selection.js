import { BRANCHES, canDefend } from "../data/progression.js";
import {
  weaponFor,
  maxLevel,
  TENT_WEAPONS,
  rangeFor,
} from "../data/weapons.js";
import { odorStats } from "../stereotypes.js";
import { BUILDINGS } from "../data/catalog.js";
import { canRemove, refundableCost } from "../construction.js";
import { projectY } from "../data/map.js";
const $ = (id) => document.getElementById(id);
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
  selectionView.title.textContent = `${BUILDINGS[b.type].name} · N${b.level} · ${Math.ceil(b.hp)}/${b.maxHp}`;
}
export function renderSelection({ game, selected }, command) {
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
        ? `Olor: ${odorStats(b).dps} daño/s · Radio ${odorStats(b).radius}. No ralentiza ni se acumula. Perfumados inmunes.`
        : b.type === "kitchen"
          ? `Produce ${20 * b.level + (b.branch === "rapid" ? 20 : 0)} provisiones por ronda${b.branch === "power" ? " y 2 cada 5 s de combate" : ""}`
          : "Bloquea el paso hasta que la destruyen. No ataca ni causa daño";
    const info = document.createElement("details"),
      summary = document.createElement("summary");
    const secondary = document.createElement("div");
    secondary.className = "popover-secondary";
    summary.textContent = "Detalles";
    info.append(summary, details);
    if (canRemove(game, b)) {
      const remove = document.createElement("button");
      remove.textContent = game.sandbox
        ? "Eliminar"
        : `Retirar · +${refundableCost(b)}`;
      remove.onclick = () => command({ type: "remove", id: b.id });
      secondary.append(remove);
    }
    if (game.sandbox && b.branch) {
      const reset = document.createElement("button");
      reset.textContent = "Cambiar especialidad";
      reset.onclick = () => command({ type: "admin-branch-reset", id: b.id });
      secondary.append(reset);
    }
    if (b.id === "base") {
      const spokesperson = document.createElement("p");
      spokesperson.textContent =
        "Alicia del Alquiler · Portavoz del campamento";
      info.append(spokesperson);
    }
    if (b.level < maxLevel(b.type) && canDefend(game)) {
      const btn = document.createElement("button");
      btn.textContent =
        b.type === "tent"
          ? `↑ ${TENT_WEAPONS[b.level].name} · ${b.level * 30}`
          : `↑ Nivel ${b.level + 1} · ${b.level * 30}`;
      btn.className = "upgrade-primary";
      btn.dataset.cost = b.level * 30;
      btn.disabled = game.money < b.level * 30;
      btn.onclick = () => command({ type: "upgrade", id: b.id });
      $("selection").append(btn);
    }
    if (b.branch) {
      const note = document.createElement("p");
      note.textContent = BRANCHES[b.type][b.branch][0];
      note.title = BRANCHES[b.type][b.branch][1];
      $("selection").append(note);
    } else if (canDefend(game)) {
      const choices = document.createElement("div");
      choices.className = "specialty-choices";
      for (const [branch, [name, description, cost]] of Object.entries(
        BRANCHES[b.type],
      )) {
        const button = document.createElement("button");
        button.textContent = `${name} · ${cost}`;
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
