import { canDefend, totalRounds } from "../data/progression.js";
import { WAVES, normalWave } from "../data/waves.js";
import { ENTRIES, UNITS } from "../data/catalog.js";
import { bossWave, BOSS_ROUNDS } from "../data/bosses.js";
import { COPY } from "../data/copy.js";
import { renderShop } from "./shop.js";
import { renderSelection, refreshSelectionStats } from "./selection.js";
import { renderRoutes, routeSummary } from "./routes.js";
import { currentFeedback } from "./feedback.js";
import { renderStory } from "./story.js";
import {
  campaignLevel,
  campaignPressure,
  levelRound,
} from "../data/campaign.js";
import { storyEventFor } from "../data/story-events.js";
import { controlIcon } from "./control-icon.js";
const $ = (id) => document.getElementById(id);
let lastQuote = null;
export function renderLiveStats(game) {
  refreshSelectionStats(game);
  $("money").textContent = game.money === Infinity ? "∞" : game.money;
  $("undo-build").hidden = game.sandbox || game.mode !== "defense";
  $("undo-build").disabled =
    game.phase !== "build" ||
    !game.buildings.some((b) => b.refundable) ||
    !!game.result;
  const ability = $("ability");
  ability.hidden = game.mode !== "defense";
  ability.disabled =
    game.phase !== "combat" ||
    game.time < game.abilityReadyAt ||
    game.time < game.freezeUntil ||
    !!game.result;
  const remaining = Math.max(0, Math.ceil(game.abilityReadyAt - game.time));
  const abilityLabel =
    game.time < game.freezeUntil
      ? "Asamblea en curso: detenidos"
      : remaining
        ? `Asamblea: ${remaining} s`
        : "Asamblea extraordinaria · Detener 3 s";
  controlIcon(
    ability,
    remaining ? `✋ ${remaining}s` : "✋",
    `${abilityLabel} · Q`,
  );
  document.querySelectorAll("button[data-cost]").forEach((button) => {
    if (game.phase !== "attack")
      button.disabled =
        game.money < Number(button.dataset.cost) || !canDefend(game);
  });
  const quote = game.speeches[0]?.quote;
  if (quote !== lastQuote) {
    lastQuote = quote;
    const source = $("quote-source");
    source.replaceChildren();
    if (quote) {
      const context = document.createElement("span");
      context.textContent = `«${quote.text}» — ${quote.speaker}. ${quote.context} `;
      const link = document.createElement("a");
      link.textContent = "Ver fuente";
      link.href = quote.source;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      source.append(context, link);
    }
  }
  $("health").textContent = Math.ceil(game.base.hp) + " / " + game.base.maxHp;
  if (game.phase === "combat") {
    $("status").textContent =
      COPY.live(game.units.length, game.pending.length) +
      ` · Bajas ${game.kills} · Recompensas ${game.earned}`;
    if (
      game.storyEvent &&
      (game.storyEvent.wholeRound || game.time < game.storyEvent.until)
    )
      $("status").textContent +=
        ` · ${game.storyEvent.title}: ${game.storyEvent.wholeRound ? "hasta terminar la ronda" : `${Math.ceil(game.storyEvent.until - game.time)} s`}`;
  } else
    $("status").textContent =
      COPY.status[game.phase === "attack" ? "attack" : "build"];
  if (game.sandbox && game.result)
    $("status").textContent =
      "Base derrotada. Pulsa Reparar todo y revivir base para continuar.";
  const feedback = currentFeedback(game);
  if (feedback) $("status").textContent = feedback;
}
export function renderPanel(
  { game, kind, selected, selectedEntries },
  { command, selectKind, selectEntry, clearSelection },
) {
  if (!game) return;
  const attacking = game.phase === "attack",
    combat = game.phase === "combat";
  $("modeLabel").textContent =
    game.mode === "defense"
      ? "HISTORIA: LA PLAZA RESISTE"
      : COPY.modes[game.mode];
  if (game.sandbox)
    $("modeLabel").textContent = "ADMIN · LABORATORIO DE PRUEBAS";
  $("phaseTitle").textContent =
    COPY.phase[combat ? "combat" : attacking ? "attack" : "build"];
  if (
    (combat && game.waveIsBoss) ||
    (!combat && game.mode === "defense" && WAVES[game.round - 1]?.boss)
  )
    $("phaseTitle").textContent =
      game.mode === "defense"
        ? `JEFE FINAL · NIVEL ${campaignLevel(game.round).number}`
        : "RONDA DE JEFES";
  $("round").textContent = game.round + " / " + totalRounds(game);
  if (game.mode === "defense") {
    const level = campaignLevel(game.round);
    $("round").textContent =
      `Nivel ${level.number}/3 · Ronda ${levelRound(game.round)}/${level.last - level.first + 1}`;
  }
  $("money").textContent = game.money;
  $("health").textContent = Math.ceil(game.base.hp) + " / " + game.base.maxHp;
  const wave = WAVES[Math.min(game.round - 1, WAVES.length - 1)];
  renderStory(game, document);
  $("wave-preview").textContent = game.sandbox
    ? "Laboratorio: envía unidades manualmente o carga una oleada. Limpiar detiene los ataques; cargar una oleada repara el campamento."
    : game.mode === "defense"
      ? `${campaignLevel(game.round).name} · ${wave.name}: ${wave.hint}`
      : "";
  if (game.mode === "defense" && !game.sandbox && game.round > 5) {
    const pressure = campaignPressure(game.round);
    $("wave-preview").textContent +=
      ` Enemigos normales: vida ×${pressure.health.toFixed(1)}, velocidad +${Math.round((pressure.speed - 1) * 100)} %, daño +${Math.round((pressure.damage - 1) * 100)} %.`;
  }
  renderShop({ game, kind, selectedEntries }, { command, selectKind });
  const event = storyEventFor(game);
  if (game.mode === "defense" && !game.sandbox && !combat) {
    const upcoming = [
      ...normalWave(game.round, ENTRIES.length),
      ...(BOSS_ROUNDS.includes(game.round)
        ? bossWave(game.round, ENTRIES.length)
        : []),
    ];
    const counts = new Map();
    for (const { kind } of upcoming)
      counts.set(kind, (counts.get(kind) || 0) + 1);
    $("wave-preview").textContent +=
      ` · Llegan: ${[...counts].map(([kind, count]) => `${UNITS[kind].name} ×${count}`).join(", ")}`;
  }
  if (event)
    $("wave-preview").textContent +=
      ` · Evento: ${event.title}. ${event.summary}`;
  renderRoutes(game, selectedEntries, selectEntry);
  $("help").textContent =
    !combat && !attacking && kind === "barrier"
      ? "Coloca la barricada sobre un camino. Los atacantes deben romperla para pasar; ella no ataca. Esta línea roja sí se mantiene."
      : canDefend(game) && combat
        ? "Construye y mejora mientras combaten. Cada baja da provisiones. Asamblea detiene a todos durante 3 s; recarga 25 s."
        : COPY.help[combat ? "combat" : attacking ? "attack" : "build"];
  $("satire-news").textContent =
    COPY.headlines[(game.round - 1) % COPY.headlines.length].join(" / ");
  $("action").disabled =
    !!game.result || combat || (attacking && !game.queue.length);
  if ($("test-boss")) {
    $("test-boss").hidden = game.mode !== "defense";
    $("test-boss").disabled = combat || !!game.result;
  }
  $("action").textContent =
    COPY.action[
      combat
        ? "combat"
        : game.mode === "local" && !attacking
          ? "handoff"
          : attacking
            ? "attack"
            : "build"
    ];
  $("queue").replaceChildren();
  if (attacking) {
    $("queue").textContent = COPY.queue(game.queue.length);
    const summary = document.createElement("p");
    summary.textContent = routeSummary(game.queue);
    $("queue").append(summary);
    if (game.queue.length) {
      const b = document.createElement("button");
      b.textContent = COPY.undo;
      b.onclick = () => command({ type: "undo" });
      $("queue").append(document.createElement("br"), b);
    }
  }
  renderSelection({ game, selected }, command, clearSelection);
  $("status").textContent = combat
    ? COPY.live(game.units.length, game.pending.length)
    : attacking
      ? COPY.status.attack
      : COPY.status.build;
  renderLiveStats(game);
}
