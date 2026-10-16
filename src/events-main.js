import { appendStoryReference } from "./ui/story-reference.js";
import { EVENT_PREVIEWS, EventPreviewGame } from "./event-preview.js";
import { createBoardRenderer } from "./render/board.js";
import { createStoryScenes } from "./ui/story-scenes.js";
import { Playback } from "./playback.js";
import { createPlaybackControls } from "./ui/playback.js";
import { createAudio } from "./ui/audio.js";
import { preferences } from "./preferences.js";

const $ = (id) => document.getElementById(id);
const playback = new Playback(),
  renderer = createBoardRenderer($("board"));
let game = null,
  last = performance.now(),
  refresh = 0;
const controls = createPlaybackControls(document, playback, () => game);
const audio = createAudio(document);
const scenes = createStoryScenes(
  document,
  playback,
  () => game,
  () => controls.render(),
);
const playbackKey = document.onkeydown;
document.onkeydown = (event) => {
  if (!scenes.isOpen) playbackKey?.(event);
};
for (const item of EVENT_PREVIEWS) {
  const option = document.createElement("option");
  option.value = item.round;
  option.textContent = `Ronda ${item.round} · ${item.title}`;
  $("preview-event").append(option);
}
$("preview-event").value = "9";
function selection() {
  return EVENT_PREVIEWS.find(
    (item) => item.round === Number($("preview-event").value),
  );
}
function options() {
  const item = selection();
  $("preview-option").replaceChildren();
  for (const choice of item.event?.options || [
    { id: "default", label: "Escena de jefe" },
  ]) {
    const option = document.createElement("option");
    option.value = choice.id;
    option.textContent = choice.label;
    $("preview-option").append(option);
  }
  $("preview-option").value = item.event?.default || "default";
  $("preview-option").disabled = !item.event;
  describe();
}
function describe() {
  appendStoryReference(document, $("preview-reference"), selection().round);
  const item = selection(),
    option = item.event?.options.find(
      (o) => o.id === $("preview-option").value,
    );
  $("preview-description").textContent = option
    ? `${item.event.summary} ${option.description}`
    : "Prueba la entrada del jefe y su combate con las reglas de su nivel.";
}
function run(withScene = false) {
  scenes.cancel();
  playback.reset();
  const item = selection();
  game = new EventPreviewGame(item.round);
  const start = () => {
    game.command({ type: "ready" });
    controls.render();
  };
  if (withScene) {
    if (!scenes.beforeReady(game, start)) start();
  } else {
    if (item.event)
      game.command({ type: "story-choice", option: $("preview-option").value });
    start();
  }
  $("preview-feedback").textContent = `Probando: ${item.title}.`;
  controls.render();
}
$("preview-event").onchange = () => {
  options();
  run();
};
$("preview-option").onchange = describe;
$("preview-scene").onclick = () => {
  void audio.unlock();
  run(true);
};
$("preview-start").onclick = () => {
  void audio.unlock();
  run();
};
$("preview-repeat").onclick = () => {
  void audio.unlock();
  run();
};
$("preview-step").onclick = () => {
  if (!game || scenes.isOpen) return;
  for (let i = 0; i < 300; i++) game.tick(1 / 60);
  controls.render();
};
options();
run();
function frame(now) {
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  playback.advance(dt, game);
  scenes.draw(dt);
  audio.update(game, { paused: playback.paused });
  renderer.draw(game, null, {
    ...preferences,
    paused: playback.paused,
    paths: controls.showPaths,
    animationDelta: playback.paused ? 0 : dt * playback.speed,
  });
  refresh += dt;
  if (refresh > 0.2) {
    $("preview-status").textContent =
      `${game.time.toFixed(1)} s · ${game.units.length} atacantes · ${game.pending.length} por llegar`;
    refresh = 0;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
