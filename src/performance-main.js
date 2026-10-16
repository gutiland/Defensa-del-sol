import { AdminGame } from "./admin-game.js";
import { EventPreviewGame } from "./event-preview.js";
import { createBoardRenderer } from "./render/board.js";
import { Playback } from "./playback.js";
import { PerformanceSamples } from "./performance-samples.js";
import { preferences, mountExperienceSettings } from "./preferences.js";
const $ = (id) => document.getElementById(id),
  renderer = createBoardRenderer($("board")),
  playback = new Playback();
mountExperienceSettings(document);
let game,
  samples,
  last = performance.now(),
  refresh = 0,
  scenario;
function reset() {
  game = new AdminGame();
  const camp = new EventPreviewGame(9);
  game.buildings = camp.buildings;
  game.base = camp.base;
  game.base.invulnerable = true;
  game.round = 20;
  scenario = $("stress-scenario").value;
  const count = Number($("stress-count").value);
  for (let i = 0; i < count; i += 100)
    game.command({
      type: "admin-spawn",
      kind: "basic",
      entry: (i / 100) % 11,
      count: Math.min(100, count - i),
    });
  for (const p of game.pending) p.at = 0;
  game.tick(1 / 60);
  if (scenario !== "march")
    for (let i = 0; i < game.units.length; i++) {
      const u = game.units[i];
      u.x = 180 + (i % 30) * 21;
      u.y = 250 + Math.floor(i / 30) * 14;
    }
  if (scenario === "rain")
    game.storyEvent = { id: "rain", until: 0, intervalMultiplier: 1 };
  if (scenario === "fire")
    game.fires = Array.from({ length: 10 }, (_, i) => ({
      x: 250 + (i % 5) * 110,
      y: 320 + Math.floor(i / 5) * 130,
      radius: 70,
      dps: 1,
      life: 120,
      duration: 120,
    }));
  playback.reset();
  samples = new PerformanceSamples();
  refresh = 0;
  last = performance.now();
  $("stress-pause").textContent = "Pausa";
}
$("stress-restart").onclick = reset;
$("stress-count").onchange = reset;
$("stress-scenario").onchange = reset;
$("stress-pause").onclick = () => {
  playback.toggle();
  $("stress-pause").textContent = playback.paused ? "Reanudar" : "Pausa";
};
reset();
function frame(now) {
  const frameMs = Math.max(0.01, now - last),
    dt = Math.min(0.05, frameMs / 1000);
  last = now;
  const began = performance.now();
  if (scenario === "deaths" && !playback.paused)
    for (const unit of game.units.slice(0, 6)) {
      unit.hp = 0;
      unit.hitWeapon = "paintbomb";
    }
  playback.advance(dt, game);
  const simulated = performance.now();
  renderer.draw(game, null, {
    ...preferences,
    paused: playback.paused,
    animationDelta: playback.paused ? 0 : dt,
  });
  const painted = performance.now();
  samples.add(frameMs, simulated - began, painted - simulated);
  refresh += dt;
  if (refresh > 0.5) {
    refresh = 0;
    const s = samples.summary();
    const memory = performance.memory?.usedJSHeapSize;
    $("stress-stats").textContent =
      `${game.units.length} activos · ${s.fps.toFixed(0)} FPS · Fotograma P95 ${s.frameP95.toFixed(1)} ms · Simulación P95 ${s.simulationP95.toFixed(1)} ms · Dibujo P50/P95 ${s.renderP50.toFixed(1)}/${s.renderP95.toFixed(1)} ms · ${s.samples} muestras${memory ? ` · Memoria JS ${(memory / 1048576).toFixed(1)} MiB (excluye GPU)` : ""}`;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
