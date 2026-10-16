import { createSynth } from "../audio-synth.js";
import { soundForEffect } from "../audio-events.js";
import { preferences } from "../preferences.js";
import { controlIcon } from "./control-icon.js";

export function createAudio(
  document,
  {
    createContext = () =>
      new (globalThis.AudioContext || globalThis.webkitAudioContext)(),
  } = {},
) {
  let context,
    synth,
    enabled = true,
    volume = 0.35,
    previous = null,
    nextMurmur = 0,
    nextFire = 0,
    murmurVoice = 0;
  const button = document.getElementById("sound"),
    slider = document.getElementById("sound-volume");
  const heard = new WeakSet();
  let bossSeen = new WeakSet();
  function render() {
    controlIcon(
      button,
      enabled ? "🔊" : "🔇",
      enabled ? "Silenciar sonido" : "Activar sonido",
    );
    button.setAttribute("aria-pressed", String(enabled));
  }
  async function unlock() {
    if (!enabled) return;
    try {
      if (!context) {
        context = createContext();
        synth = createSynth(context);
      }
      synth.volume(enabled ? volume : 0);
      if (context.state !== "running") await context.resume();
    } catch {
      controlIcon(button, "♪!", "Sonido no disponible");
    }
  }
  let deathVoice = 0;
  function play(name, offset = 0) {
    if (enabled && synth && context?.state === "running" && volume > 0)
      synth.play(name, offset);
  }
  button.onclick = () => {
    enabled = !enabled;
    render();
    if (enabled) void unlock();
    else {
      synth?.volume(0);
      synth?.stop();
    }
  };
  slider.value = "35";
  slider.oninput = () => {
    const value = Number(slider.value);
    if (!Number.isFinite(value)) return;
    volume = Math.max(0, Math.min(1, value / 100));
    synth?.volume(enabled ? volume : 0);
    if (enabled) void unlock();
  };
  render();
  return {
    unlock,
    play,
    action(type) {
      play(
        {
          build: "build",
          upgrade: "upgrade",
          specialize: "upgrade",
          recruit: "recruit",
          remove: "remove",
          undo: "remove",
        }[type],
      );
    },
    update(game, { paused = false } = {}) {
      if (previous?.game !== game) {
        synth?.stopGroup("murmur");
        synth?.stopGroup("death");
        nextMurmur = 0;
        nextFire = 0;
        bossSeen = new WeakSet();
      }
      synth?.mix(preferences.effectsVolume, preferences.ambientVolume);
      if (paused) synth?.stopGroup("death");
      const fresh = game.effects.filter((e) => !heard.has(e));
      fresh.forEach((e) => heard.add(e));
      if (previous?.game === game) {
        if (game.result && game.result !== previous.result)
          play(game.result === "loss" ? "defeat" : "victory");
        else if (game.round > previous.round) play("clear");
        else if (game.phase === "combat" && previous.phase !== "combat")
          play("wave");
        if (!paused) {
          const defeatedBoss = game.deaths.some(
            (death) => death.kind?.startsWith("boss") && !bossSeen.has(death),
          );
          for (const death of game.deaths) bossSeen.add(death);
          const deaths = Math.max(0, game.kills - previous.kills);
          for (let i = 0; i < Math.min(deaths, 8); i++)
            play(
              ["deathBoing", "deathQuack", "deathSqueak"][deathVoice++ % 3],
              i * 0.025,
            );
          if (defeatedBoss) play("bossClear");
          else if (deaths && (game.chain?.count || 0) >= 3) play("multi");
          const cues = new Set(fresh.map(soundForEffect));
          cues.forEach((cue) => {
            if (cue) play(cue);
          });
        }
      }
      const murmuring =
        enabled &&
        volume > 0 &&
        context?.state === "running" &&
        !paused &&
        !game.result &&
        game.phase === "combat" &&
        game.units.length > 0;
      if (!murmuring) synth?.stopGroup("murmur");
      else if (context.currentTime >= nextMurmur) {
        play(murmurVoice++ % 2 ? "murmurHigh" : "murmurLow");
        nextMurmur = context.currentTime + 1.05;
      }
      if (murmuring && game.fires.length && context.currentTime >= nextFire) {
        play("fireBed");
        nextFire = context.currentTime + 0.85;
      }
      previous = {
        game,
        phase: game.phase,
        round: game.round,
        result: game.result,
        kills: game.kills,
      };
    },
  };
}
