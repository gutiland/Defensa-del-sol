export function createBattleCamera() {
  let previous = null,
    revision = null,
    seen = new WeakSet(),
    age = 1;
  return {
    advance(game, dt, reducedMotion) {
      if (previous !== game || revision !== game.visualRevision) {
        previous = game;
        revision = game.visualRevision;
        seen = new WeakSet();
        age = 1;
      }
      for (const death of game.deaths) {
        if (seen.has(death)) continue;
        seen.add(death);
        if (death.kind.startsWith("boss")) age = 0;
      }
      age += Math.max(0, dt);
      if (reducedMotion || age > 0.18) return 0;
      return Math.sin(age * 105) * 3 * (1 - age / 0.18);
    },
  };
}
