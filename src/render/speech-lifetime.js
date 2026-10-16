// Preparation has no simulation ticks. Use the renderer's visual clock so
// construction greetings expire there too, without advancing combat.
export function createSpeechLifetime() {
  let previous = null,
    started = new WeakMap();
  return (game, time) => {
    if (previous !== game) {
      previous = game;
      started = new WeakMap();
    }
    return game.speeches.filter((speech) => {
      if (!speech.construction) return true;
      if (!game.buildings.some((b) => b.id === speech.buildingId && b.hp > 0))
        return false;
      if (!started.has(speech)) started.set(speech, time);
      return time - started.get(speech) < 4;
    });
  };
}
