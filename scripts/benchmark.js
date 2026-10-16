import { AdminGame } from "../src/admin-game.js";

// Finite, repeatable stress run. Measures simulation only, never browser FPS.
for (const size of [100, 300, 600]) {
  const game = new AdminGame();
  for (let i = 0; i < size; i += 100)
    game.command({
      type: "admin-spawn",
      kind: "basic",
      entry: 0,
      count: Math.min(100, size - i),
    });
  const started = performance.now();
  // Spawn the full crowd at once: staggered gameplay departures would measure
  // only ~32 active units regardless of the requested stress size.
  for (const spawn of game.pending) spawn.at = 0;
  for (let step = 0; step < 1800; step++) game.tick(1 / 60);
  console.log(
    JSON.stringify({
      units: size,
      steps: 1800,
      milliseconds: Math.round(performance.now() - started),
      active: game.units.length,
    }),
  );
}
