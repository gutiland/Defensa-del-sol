import { beginRoundReport } from "./experience.js";
// Simulation timestamps restart for every fight, including manual sandbox fights.
export function startCombat(game) {
  beginRoundReport(game);
  game.phase = "combat";
  game.time = 0;
  game.abilityReadyAt = 0;
  game.freezeUntil = 0;
  game.fires = [];
  game.projectiles = [];
  game.effects = [];
  game.speeches = [];
  game.nextSpeechAt = 0;
  game.lastSpeechSide = null;
  for (const b of [game.base, ...game.buildings]) {
    b.refundable = false;
    b.cooldown = 0;
    delete b.lastHit;
    delete b.lastShot;
  }
}
