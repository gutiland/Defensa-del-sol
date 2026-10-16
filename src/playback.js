export class Playback {
  constructor() {
    this.reset();
  }
  reset() {
    this.paused = false;
    this.speed = 1;
    this.accumulator = 0;
  }
  toggle() {
    this.paused = !this.paused;
    return this.paused;
  }
  cycleSpeed() {
    this.speed = this.speed === 3 ? 1 : this.speed + 1;
    return this.speed;
  }
  advance(seconds, game) {
    if (this.paused || game.phase !== "combat" || game.result) {
      this.accumulator = 0;
      return;
    }
    // Fixed steps preserve the combat rules at every playback speed.
    const step = 1 / 60;
    this.accumulator += Math.max(0, Math.min(seconds, 0.1)) * this.speed;
    while (this.accumulator + 1e-10 >= step) {
      this.accumulator -= step;
      game.tick(step);
      if (game.phase !== "combat" || game.result) {
        this.accumulator = 0;
        break;
      }
    }
  }
}
