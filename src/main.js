import { canDefend } from "./data/progression.js";
import { createAudio } from "./ui/audio.js";
import { COPY, applyStaticCopy } from "./data/copy.js";
import { mountGallery } from "./ui/gallery.js";
import { placementError } from "./placement.js";
import { unprojectY } from "./data/map.js";
import { createBoardRenderer } from "./render/board.js";
import { renderPanel, renderLiveStats } from "./ui/panel.js";
import { showResult } from "./ui/result.js";
import { Game, BUILDINGS } from "./engine.js";
import { Playback } from "./playback.js";
import { createPlaybackControls } from "./ui/playback.js";
import { handleShortcut } from "./ui/shortcuts.js";
import { showFeedback, clearFeedback } from "./ui/feedback.js";
import { createEnemyIntroductions } from "./ui/enemy-intro.js";
import { createStoryScenes } from "./ui/story-scenes.js";
import { nearestConstruction } from "./ui/construction-hit.js";
import { loadCampaign, saveCampaign } from "./campaign-save.js";
import { preferences, mountExperienceSettings } from "./preferences.js";
import { mountSupport } from "./ui/support.js";
applyStaticCopy(document);
mountGallery(document);
mountExperienceSettings(document);
mountSupport(document);
const $ = (id) => document.getElementById(id),
  canvas = $("board"),
  renderer = createBoardRenderer(canvas);
let pointer = null,
  game,
  kind = "tent",
  placing = false,
  selected = null,
  selectedEntries = [0],
  last = performance.now(),
  shown = false;
let resultWait = 0;
const audio = createAudio(document);
const playback = new Playback();
const controls = createPlaybackControls(document, playback, () => game);
const introductions = createEnemyIntroductions(
  document,
  playback,
  () => game,
  () => controls.render(),
);
// @development-only:start
const isAdmin = document.body?.dataset.page === "admin";
let AdminGame, mountAdmin;
if (isAdmin) {
  ({ AdminGame } = await import("./admin-game.js"));
  ({ mountAdmin } = await import("./ui/admin.js"));
}
// @development-only:end
const scenes = createStoryScenes(
  document,
  playback,
  () => game,
  () => controls.render(),
);
function start(mode, restored = null) {
  scenes.cancel();
  playback.reset();
  pointer = null;
  game = isAdmin ? new AdminGame() : restored || new Game(mode);
  if (!isAdmin) void audio.unlock();
  audio.update(game);
  kind = "tent";
  placing = false;
  selected = null;
  selectedEntries = [0];
  shown = false;
  resultWait = 0;
  $("intro").hidden = true;
  $("game").hidden = false;
  if (isAdmin) mountAdmin(document, command, () => start("defense"));
  update();
}
function refreshContinue() {
  const button = $("continue-campaign"),
    saved = loadCampaign();
  if (!button) return;
  button.hidden = !saved;
  if (saved) button.textContent = `Continuar historia · Ronda ${saved.round}`;
  button.onclick = () => {
    const checkpoint = loadCampaign();
    if (checkpoint) start("defense", checkpoint);
  };
}
refreshContinue();
document
  .querySelectorAll("[data-mode]")
  .forEach((b) => (b.onclick = () => start(b.dataset.mode)));
function reset() {
  scenes.cancel();
  if (isAdmin) return start("defense");
  $("result").close();
  $("intro").hidden = false;
  $("game").hidden = true;
  game = null;
  refreshContinue();
}
$("restart").onclick = reset;
$("again").onclick = reset;
function command(c, afterScene = false) {
  if (scenes.isOpen) return false;
  if (
    c.type === "ready" &&
    !afterScene &&
    scenes.beforeReady(game, () => command(c, true))
  )
    return true;
  void audio.unlock();
  if (c.type === "ready" || c.type === "test-boss") saveCampaign(game);
  const ok = game.command(c);
  if (ok) {
    clearFeedback(game);
    update();
    audio.action(c.type);
  }
  return ok;
}
function update() {
  if (game && !isAdmin && saveCampaign(game)) {
    const status = $("save-status");
    if (status) status.textContent = "Historia guardada en este navegador";
  }
  controls.render();
  renderPanel(
    { game, kind: placing ? kind : null, selected, selectedEntries },
    {
      command,
      selectKind(value) {
        kind = value;
        placing = true;
        selected = null;
        update();
      },
      selectEntry(value) {
        selectedEntries = selectedEntries.includes(value)
          ? selectedEntries.filter((entry) => entry !== value)
          : [...selectedEntries, value];
        update();
      },
    },
  );
  $("cancel-build").disabled = !placing && selected === null;
}
function cancelPlacement() {
  if (game) clearFeedback(game);
  placing = false;
  selected = null;
  pointer = null;
  if (game) update();
}
$("cancel-build").onclick = cancelPlacement;
const playbackKey = document.onkeydown;
document.onkeydown = (event) => {
  if (introductions.isOpen || scenes.isOpen) return;
  if (
    handleShortcut(event, {
      game,
      command,
      cancel: cancelPlacement,
      selectKind(value) {
        kind = value;
        placing = true;
        selected = null;
        update();
      },
    })
  )
    return;
  playbackKey?.(event);
};
$("action").onclick = () => command({ type: "ready" });
$("ability").onclick = () => command({ type: "ability" });
if ($("test-boss"))
  $("test-boss").onclick = () => command({ type: "test-boss" });
$("undo-build").onclick = () => {
  const b = [...game.buildings].reverse().find((b) => b.refundable);
  if (b) command({ type: "remove", id: b.id });
};
canvas.onclick = (e) => {
  if (!game || game.result) return;
  const r = canvas.getBoundingClientRect(),
    x = ((e.clientX - r.left) * 1000) / r.width,
    y = unprojectY(((e.clientY - r.top) * 680) / r.height);
  const b = nearestConstruction(game, x, y, placing ? 18 : 35);
  if (b) {
    placing = false;
    selected = b.id;
    update();
    return;
  }
  if (!placing) {
    selected = null;
    update();
    return;
  }
  if (!canDefend(game)) return;
  const error = placementError(game, x, y, kind);
  if (error) {
    void audio.unlock();
    audio.play("error");
    showFeedback(game, error);
    $("status").textContent = error;
    return;
  }
  selected = null;
  if (!command({ type: "build", kind, x, y })) {
    showFeedback(game, COPY.noMoney);
    $("status").textContent = COPY.noMoney;
  } else if (!e.shiftKey) {
    placing = false;
    selected = game.buildings.at(-1).id;
    update();
  }
};
canvas.oncontextmenu = (e) => {
  e.preventDefault();
  cancelPlacement();
};
canvas.onpointermove = (e) => {
  const r = canvas.getBoundingClientRect();
  pointer = {
    x: ((e.clientX - r.left) * 1000) / r.width,
    y: unprojectY(((e.clientY - r.top) * 680) / r.height),
  };
};
canvas.onpointerleave = () => {
  pointer = null;
};
let refresh = 0;
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  if (game) {
    const phase = game.phase;
    const previousRound = game.round;
    const previousResult = game.result;
    playback.advance(dt, game);
    if (previousRound !== game.round || (!previousResult && game.result)) {
      selected = null;
      placing = false;
      pointer = null;
      selectedEntries = [];
      update();
    }
    scenes.draw(dt);
    if (!scenes.isOpen && introductions.update(game)) controls.render();
    audio.update(game, { paused: playback.paused });
    renderer.draw(
      game,
      canDefend(game) && placing && pointer
        ? {
            ...pointer,
            valid:
              !placementError(game, pointer.x, pointer.y, kind) &&
              game.money >= BUILDINGS[kind].cost,
          }
        : null,
      {
        ...preferences,
        selected,
        kind,
        paths: controls.showPaths,
        selectedEntries,
        paused: playback.paused,
        animationDelta:
          game.phase === "combat"
            ? playback.paused
              ? 0
              : dt * playback.speed
            : dt,
      },
    );
    refresh += dt;
    if (phase !== game.phase) {
      update();
      refresh = 0;
    } else if (refresh > 0.2) {
      renderLiveStats(game);
      refresh = 0;
    }
    if (game.result && !shown && !game.sandbox) {
      if (resultWait === 0) controls.render();
      resultWait += dt;
      if (!game.defendedWaves || game.base.hp <= 0 || resultWait >= 2.4) {
        shown = true;
        showResult(game);
      }
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
if (isAdmin) start("defense");
