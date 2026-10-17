import { tutorialStep } from "../data/tutorial.js";

export function createTutorial(document, playback, blocked = () => false) {
  const root = document.createElement("dialog"),
    halo = document.createElement("div"),
    arrow = document.createElement("div"),
    card = document.createElement("section"),
    title = document.createElement("h2"),
    text = document.createElement("p"),
    close = document.createElement("button"),
    skip = document.createElement("button");
  root.className = "tutorial-modal";
  root.setAttribute("aria-label", "Aprende a defender la plaza");
  halo.className = "tutorial-spotlight";
  arrow.className = "tutorial-arrow";
  arrow.textContent = "➜";
  halo.setAttribute("aria-hidden", "true");
  arrow.setAttribute("aria-hidden", "true");
  card.className = "tutorial-card";
  close.textContent = "Entendido · cerrar";
  close.className = "primary";
  skip.textContent = "Omitir tutorial";
  skip.className = "subtle";
  close.type = skip.type = "button";
  card.append(title, text, close, skip);
  root.append(halo, arrow, card);
  document.getElementById("game").append(root);
  let currentGame,
    active = null,
    priorPause = false,
    hidden = false,
    seen = new Set();
  function position() {
    if (!active) return;
    const target = document.querySelector(active.target);
    const menu = target?.closest?.(".board-menu");
    if (menu) menu.open = true;
    const rect = target?.getBoundingClientRect?.();
    halo.hidden = arrow.hidden = !rect || !rect.width || !rect.height;
    if (halo.hidden) {
      card.style.top = "50%";
      return;
    }
    const width = globalThis.innerWidth || 1000,
      height = globalThis.innerHeight || 680;
    const x = Math.max(4, rect.left),
      y = Math.max(4, rect.top);
    const w = Math.max(
      0,
      Math.min(rect.right ?? rect.left + rect.width, width - 4) - x,
    );
    const h = Math.max(
      0,
      Math.min(rect.bottom ?? rect.top + rect.height, height - 4) - y,
    );
    if (w <= 0 || h <= 0) {
      halo.hidden = arrow.hidden = true;
      return;
    }
    Object.assign(halo.style, {
      left: `${x}px`,
      top: `${y}px`,
      width: `${w}px`,
      height: `${h}px`,
    });
    // Keep the card opposite the target, especially with the mobile catalogue below the map.
    const below = y + h / 2 > height / 2;
    const cardHeight = card.getBoundingClientRect?.().height || 200;
    card.style.top = `${Math.max(cardHeight / 2 + 12, Math.min(height - cardHeight / 2 - 12, height * (below ? 0.3 : 0.65)))}px`;
    const ax = Math.max(20, Math.min(width - 55, x + w / 2 - 20));
    const ay = below ? Math.max(4, y - 48) : Math.min(height - 50, y + h + 4);
    Object.assign(arrow.style, {
      left: `${ax}px`,
      top: `${ay}px`,
      transform: `rotate(${below ? 90 : -90}deg)`,
    });
  }
  function dismiss() {
    if (!active) return;
    root.close();
    active = null;
    playback.paused = priorPause;
  }
  close.onclick = dismiss;
  skip.onclick = () => {
    hidden = true;
    dismiss();
  };
  root.oncancel = (event) => {
    event.preventDefault();
    dismiss();
  };
  globalThis.addEventListener?.("resize", position);
  return {
    get isOpen() {
      return !!active;
    },
    cancel: dismiss,
    render(game, state = {}) {
      if (game !== currentGame) {
        dismiss();
        currentGame = game;
        hidden = false;
        seen = new Set();
      }
      if (active) {
        position();
        return;
      }
      if (hidden || blocked()) return;
      const step = tutorialStep(game, state, seen);
      if (!step) return;
      active = step;
      seen.add(step.id);
      title.textContent = step.title;
      text.textContent = step.text;
      priorPause = playback.paused;
      playback.paused = true;
      root.showModal();
      position();
      close.focus?.({ preventScroll: true });
      root.scrollTop = 0;
      root.scrollLeft = 0;
    },
  };
}
