import { SOUNDS } from "./data/sounds.js";

export function createSynth(context) {
  const master = context.createGain();
  master.gain.value = 0.35;
  const limiter = context.createDynamicsCompressor?.();
  if (limiter) {
    master.connect(limiter);
    limiter.connect(context.destination);
  } else master.connect(context.destination);
  const effects = context.createGain(),
    ambient = context.createGain();
  effects.connect(master);
  ambient.connect(master);
  let ambientVolume = 0.5,
    serial = 0,
    currentGroup = "effect",
    lastEffect = null,
    lastAmbient = null;
  const active = new Map(),
    last = new Map();
  const noise = context.createBuffer(
    1,
    Math.ceil(context.sampleRate * 0.9),
    context.sampleRate,
  );
  const samples = noise.getChannelData(0);
  let seed = 7291;
  for (let i = 0; i < samples.length; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    samples[i] = (seed / 4294967296) * 2 - 1;
  }
  function voice(
    source,
    duration,
    delay = 0,
    filter = null,
    gain = 0.06,
    group = "effect",
  ) {
    if (active.size >= (group === "critical" ? 16 : 12)) {
      if (group === "critical") {
        const victim = [...active].find(
          ([, category]) => category !== "critical",
        );
        if (victim) {
          active.delete(victim[0]);
          try {
            victim[0].stop();
          } catch {}
        } else {
          source.disconnect();
          filter?.disconnect();
          return;
        }
      } else {
        source.disconnect();
        filter?.disconnect();
        return;
      }
    }
    const at = context.currentTime + delay,
      envelope = context.createGain();
    envelope.gain.setValueAtTime(0.001, at);
    envelope.gain.exponentialRampToValueAtTime(gain, at + 0.003);
    envelope.gain.exponentialRampToValueAtTime(0.001, at + duration);
    source.connect(filter || envelope);
    if (filter) filter.connect(envelope);
    envelope.connect(group === "murmur" ? ambient : effects);
    active.set(source, group);
    source.onended = () => {
      active.delete(source);
      source.disconnect();
      filter?.disconnect();
      envelope.disconnect();
    };
    source.start(at);
    source.stop(at + duration + 0.01);
  }
  return {
    mix(effectVolume, backgroundVolume) {
      if (lastEffect !== effectVolume)
        effects.gain.setValueAtTime(effectVolume, context.currentTime);
      ambientVolume = backgroundVolume;
      if (lastAmbient !== backgroundVolume)
        ambient.gain.setValueAtTime(backgroundVolume, context.currentTime);
      lastEffect = effectVolume;
      lastAmbient = backgroundVolume;
    },
    volume(value) {
      master.gain.setValueAtTime(
        Math.max(0, Math.min(1, value)),
        context.currentTime,
      );
    },
    stop() {
      for (const source of active.keys()) {
        try {
          source.stop();
        } catch {}
      }
      active.clear();
    },
    stopGroup(group) {
      for (const [source, category] of active)
        if (category === group) {
          try {
            source.stop();
          } catch {}
          active.delete(source);
        }
    },
    play(name, offset = 0) {
      const cue = SOUNDS[name];
      if (!cue || context.state !== "running") return;
      currentGroup = name.startsWith("death")
        ? "death"
        : name === "fireBed"
          ? "murmur"
          : [
                "multi",
                "bossClear",
                "victory",
                "defeat",
                "clear",
                "wave",
              ].includes(name)
            ? "critical"
            : "effect";
      const interval = [
        "stone",
        "hit",
        "wood",
        "throw",
        "sound",
        "kill",
      ].includes(name)
        ? 0.09
        : 0.16;
      if (
        !name.startsWith("death") &&
        context.currentTime - (last.get(name) ?? -100) < interval
      )
        return;
      last.set(name, context.currentTime);
      const pitch = 1 + ((serial++ % 5) - 2) * 0.012;
      if (currentGroup === "critical") {
        ambient.gain.setValueAtTime(ambientVolume * 0.25, context.currentTime);
        ambient.gain.exponentialRampToValueAtTime(
          Math.max(0.001, ambientVolume),
          context.currentTime + 0.5,
        );
      }
      for (const [fundamental, formant, delay, duration, end] of cue.voices ||
        []) {
        const oscillator = context.createOscillator(),
          filter = context.createBiquadFilter();
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(
          fundamental,
          context.currentTime + delay + offset,
        );
        oscillator.frequency.exponentialRampToValueAtTime(
          end,
          context.currentTime + delay + duration + offset,
        );
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(
          formant,
          context.currentTime + delay + offset,
        );
        filter.frequency.exponentialRampToValueAtTime(
          formant * 0.75,
          context.currentTime + delay + duration + offset,
        );
        if (filter.Q) filter.Q.value = 4;
        voice(oscillator, duration, delay + offset, filter, 0.009, "murmur");
      }
      for (const [
        frequency,
        duration,
        delay,
        type,
        gain = 0.04,
        end,
      ] of cue.notes || []) {
        const oscillator = context.createOscillator();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(
          frequency * pitch,
          context.currentTime + delay + offset,
        );
        if (end)
          oscillator.frequency.exponentialRampToValueAtTime(
            end,
            context.currentTime + delay + duration + offset,
          );
        voice(oscillator, duration, delay + offset, null, gain, currentGroup);
      }
      for (const texture of cue.textures || []) {
        const source = context.createBufferSource(),
          filter = context.createBiquadFilter();
        source.buffer = noise;
        filter.type = texture.filter || "lowpass";
        const at = context.currentTime + (texture.delay || 0) + offset;
        filter.frequency.setValueAtTime(texture.frequency, at);
        if (texture.end)
          filter.frequency.exponentialRampToValueAtTime(
            texture.end,
            at + texture.duration,
          );
        if (filter.Q) filter.Q.value = 0.7;
        voice(
          source,
          texture.duration,
          (texture.delay || 0) + offset,
          filter,
          texture.gain,
          currentGroup,
        );
      }
    },
  };
}
