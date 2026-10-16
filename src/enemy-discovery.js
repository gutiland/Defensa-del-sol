export class EnemyDiscovery {
  constructor() {
    this.game = null;
    this.seen = new Set();
    this.queue = [];
  }
  observe(game) {
    if (game !== this.game) {
      this.game = game;
      this.seen = new Set(game?.discoveredEnemies || []);
      this.queue = [];
    }
    if (!game || game.mode !== "defense" || game.sandbox) return;
    for (const unit of game.units)
      if (!this.seen.has(unit.kind)) {
        this.seen.add(unit.kind);
        this.queue.push(unit.kind);
      }
  }
  next() {
    return this.queue.shift();
  }
}
