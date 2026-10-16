export function createCelebration() {
  let previous = null,
    count = 0,
    remaining = 0;
  return (game, dt) => {
    if (game !== previous) {
      previous = game;
      count = game.defendedWaves || 0;
      remaining = 0;
    }
    const cleared = (game.defendedWaves || 0) > count;
    count = game.defendedWaves || 0;
    if (cleared) remaining = 2.8;
    if (
      game.base.hp <= 0 ||
      (game.phase === "combat" && !game.result && !cleared)
    )
      remaining = 0;
    remaining = Math.max(0, remaining - Math.max(0, dt));
    return Math.min(1, remaining / 0.5);
  };
}
