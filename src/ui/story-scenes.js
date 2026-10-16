import { appendStoryReference } from "./story-reference.js";
import { preferences } from "../preferences.js";
import { STORY_SCENES } from "../data/story-scenes.js";
import { drawAnimeScene } from "../render/anime-scene.js";
import { CHARACTERS } from "../data/characters.js";
import { storyEventFor } from "../data/story-events.js";

export function createStoryScenes(document, playback, getGame, onChange) {
  const dialog = document.getElementById("story-scene");
  dialog.innerHTML = `<span class="eyebrow">HISTORIA DE LA PLAZA</span><h2 id="scene-title"></h2><canvas id="scene-portrait" width="560" height="300" aria-hidden="true"></canvas><p id="scene-speaker"></p><p id="scene-line" aria-live="polite"></p><p id="scene-event-info" hidden></p><div id="scene-choices" hidden></div><p id="scene-reference"></p><div class="scene-actions"><button id="scene-next" class="primary">Continuar</button><button id="scene-skip" class="subtle">Saltar escena</button></div>`;
  const $ = (id) => document.getElementById(id);
  const reducedMotion = globalThis.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  );
  let state = null,
    currentGame = null,
    seen = new Set();
  function close(resume) {
    if (!state) return;
    const old = state;
    state = null;
    dialog.close();
    playback.paused = old.priorPause;
    if (resume && getGame() === old.game && !old.game.result) old.resume();
    onChange();
  }
  function text() {
    const line = state.scene.lines[state.index];
    $("scene-title").textContent = state.scene.title;
    $("scene-speaker").textContent = line.character.startsWith("boss")
      ? CHARACTERS[line.character].name
      : line.name;
    $("scene-line").textContent = `«${line.text}»`;
    $("scene-next").textContent =
      state.index === state.scene.lines.length - 1
        ? "¡A defender la plaza!"
        : "Responder →";
    const event = state.event;
    const choices = $("scene-choices");
    choices.replaceChildren();
    const lastLine = state.index === state.scene.lines.length - 1;
    choices.hidden = !event || !lastLine;
    $("scene-next").hidden = !!event && lastLine;
    $("scene-event-info").hidden = !event;
    $("scene-skip").textContent = event
      ? "Usar opción gratuita"
      : "Saltar escena";
    if (event) {
      $("scene-event-info").textContent =
        `${event.summary} Opción gratuita: ${event.options.find((option) => option.id === event.default).description}`;
      if (lastLine) {
        for (const option of event.options) {
          const box = document.createElement("div"),
            button = document.createElement("button"),
            description = document.createElement("p");
          button.textContent = option.label;
          const price =
            event.id === "tent-dispute" &&
            !state.game.buildings.some((b) => b.type === "tent" && b.hp > 0)
              ? 0
              : option.cost;
          button.disabled = state.game.money < price;
          if (!price && option.cost)
            button.textContent = "Mediar · sin coste (no hay tienda afectada)";
          description.textContent = option.description;
          button.onclick = () => {
            if (!state || getGame() !== state.game) return;
            if (state.game.command({ type: "story-choice", option: option.id }))
              close(true);
          };
          box.append(button, description);
          choices.append(box);
        }
      }
    }
    appendStoryReference(document, $("scene-reference"), state.game.round);
    state.time = 0;
  }
  $("scene-next").onclick = () => {
    if (!state) return;
    if (++state.index >= state.scene.lines.length) close(true);
    else text();
  };
  $("scene-skip").onclick = () => close(true);
  dialog.oncancel = (event) => {
    event.preventDefault();
    close(true);
  };
  return {
    beforeReady(game, resume) {
      if (game !== currentGame) {
        close(false);
        currentGame = game;
        seen = new Set();
      }
      if (state) return true;
      const event = storyEventFor(game);
      if (event && game.storyChoices?.[game.round]) return false;
      const scene = event?.scene || STORY_SCENES[game.round];
      if (
        game.mode !== "defense" ||
        game.sandbox ||
        game.phase !== "build" ||
        game.result ||
        !scene ||
        seen.has(game.round)
      )
        return false;
      seen.add(game.round);
      state = {
        game,
        scene,
        event,
        resume,
        priorPause: playback.paused,
        index: 0,
        time: 0,
      };
      playback.paused = true;
      text();
      dialog.showModal();
      onChange();
      return true;
    },
    draw(dt) {
      if (!state) return;
      if (getGame() !== state.game) {
        close(false);
        return;
      }
      state.time += Math.min(0.05, Math.max(0, dt));
      const ctx = $("scene-portrait").getContext("2d"),
        line = state.scene.lines[state.index];
      ctx.clearRect(0, 0, 560, 300);
      drawAnimeScene(
        ctx,
        {
          ...line,
          opponent: state.scene.lines.find((item) =>
            item.character.startsWith("boss"),
          )?.character,
        },
        state.time,
        preferences.reducedMotion || reducedMotion?.matches,
      );
    },
    cancel: () => close(false),
    get isOpen() {
      return !!state;
    },
  };
}
