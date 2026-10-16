import { controlIcon } from "./control-icon.js";

export function createPlaybackControls(document, playback, getGame) {
  const pause = document.getElementById("pause"),
    speed = document.getElementById("speed"),
    paths = document.getElementById("paths");
  let showPaths = false;
  const undo = document.getElementById("undo-build"),
    cancel = document.getElementById("cancel-build");
  if (undo) controlIcon(undo, "↶", "Deshacer última colocación");
  if (cancel) controlIcon(cancel, "×", "Cancelar selección · Esc");
  function render() {
    const game = getGame(),
      combat = game?.phase === "combat" && !game.result;
    pause.disabled = !combat;
    speed.disabled = !combat;
    controlIcon(
      pause,
      playback.paused ? "▶" : "Ⅱ",
      playback.paused ? "Reanudar · Espacio" : "Pausar · Espacio",
    );
    pause.setAttribute("aria-pressed", String(playback.paused));
    controlIcon(
      speed,
      `${playback.speed}×`,
      `Velocidad ${playback.speed}× · Pulsa para cambiar`,
    );
    controlIcon(
      paths,
      "↝",
      showPaths ? "Ocultar rutas" : "Ver rutas de entrada",
    );
    paths.setAttribute("aria-pressed", String(showPaths));
  }
  pause.onclick = () => {
    if (getGame()?.phase === "combat") {
      playback.toggle();
      render();
    }
  };
  speed.onclick = () => {
    if (getGame()?.phase === "combat") {
      playback.cycleSpeed();
      render();
    }
  };
  paths.onclick = () => {
    showPaths = !showPaths;
    render();
  };
  document.onkeydown = (event) => {
    if (
      event.code !== "Space" ||
      event.repeat ||
      ["BUTTON", "INPUT", "TEXTAREA", "SELECT"].includes(
        event.target?.tagName,
      ) ||
      event.target?.isContentEditable
    )
      return;
    if (getGame()?.phase === "combat" && !getGame().result) {
      event.preventDefault();
      pause.onclick();
    }
  };
  return {
    render,
    get showPaths() {
      return showPaths;
    },
  };
}
