import { EnemyDiscovery } from "../enemy-discovery.js";
import { UNITS } from "../data/catalog.js";
import { attackerCharacter } from "../data/characters.js";
import { drawCharacter } from "../render/characters.js";

export function createEnemyIntroductions(
  document,
  playback,
  getGame,
  onChange,
) {
  const dialog = document.getElementById("enemy-intro"),
    discovery = new EnemyDiscovery();
  let currentGame = null,
    active = null,
    priorPause = false;
  dialog.innerHTML = `<span class="eyebrow">NUEVO ATACANTE · CONOCE AL PERSONAL</span><h2 id="enemy-intro-name"></h2><canvas id="enemy-intro-portrait" width="220" height="230" aria-hidden="true"></canvas><p id="enemy-intro-description"></p><p id="enemy-intro-stats"></p><button id="enemy-intro-close" class="primary">Entendido · continuar</button>`;
  const $ = (id) => document.getElementById(id);
  function update(game) {
    if (game !== currentGame) {
      if (active) dialog.close();
      currentGame = game;
      active = null;
    }
    discovery.observe(game);
    if (active || !game || game.result) return false;
    const kind = discovery.next();
    if (!kind) return false;
    active = kind;
    priorPause = playback.paused;
    playback.paused = true;
    const d = UNITS[kind];
    const unit = game.units.find((unit) => unit.kind === kind);
    $("enemy-intro-name").textContent = d.name;
    $("enemy-intro-description").textContent = d.desc;
    $("enemy-intro-stats").textContent =
      `Aguante ${unit?.maxHp || d.hp} · Velocidad ${d.speed} · Daño ${d.damage}. Su aspecto siempre identifica este tipo.`;
    const canvas = $("enemy-intro-portrait"),
      ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 220, 230);
    drawCharacter(
      ctx,
      attackerCharacter(kind),
      110,
      145,
      d.scale ? 1.6 : 2.2,
      0,
      d.role || kind,
      { moving: false },
    );
    dialog.showModal();
    return true;
  }
  function dismiss() {
    dialog.close();
    active = null;
    playback.paused = priorPause;
    update(getGame());
    onChange();
  }
  $("enemy-intro-close").onclick = dismiss;
  dialog.oncancel = (e) => {
    e.preventDefault();
    dismiss();
  };
  return {
    update,
    get isOpen() {
      return !!active;
    },
  };
}
