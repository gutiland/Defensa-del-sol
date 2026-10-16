export function createPlaybackControls(document, playback, getGame) {
  const pause = document.getElementById("pause"),
    speed = document.getElementById("speed"),
    paths = document.getElementById("paths");
  let showPaths = false;
  function render() {
    const game = getGame(),
      combat = game?.phase === "combat" && !game.result;
    pause.disabled = !combat;
    speed.disabled = !combat;
    pause.textContent = playback.paused
      ? "▶ Reanudar la bronca"
      : "Ⅱ Pausa parlamentaria";
    pause.setAttribute("aria-pressed", String(playback.paused));
    speed.textContent = `${playback.speed}× · Ritmo de tertulia`;
    paths.textContent = showPaths ? "Ocultar rutas" : "Ver rutas de entrada";
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
