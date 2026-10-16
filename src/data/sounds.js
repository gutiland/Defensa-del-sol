// Material layers: tones [Hz, seconds, delay, wave, gain, endHz] and filtered noise textures.
export const SOUNDS = {
  deathBoing: { notes: [[480, 0.16, 0, "triangle", 0.04, 85]] },
  deathQuack: { notes: [[230, 0.11, 0, "sawtooth", 0.016, 65]] },
  deathSqueak: { notes: [[1050, 0.13, 0, "sine", 0.035, 180]] },
  fireBed: {
    textures: [
      {
        duration: 0.7,
        frequency: 800,
        end: 300,
        filter: "lowpass",
        gain: 0.009,
      },
      {
        duration: 0.025,
        delay: 0.15,
        frequency: 3200,
        filter: "highpass",
        gain: 0.008,
      },
      {
        duration: 0.035,
        delay: 0.4,
        frequency: 2500,
        filter: "highpass",
        gain: 0.006,
      },
    ],
  },
  multi: {
    notes: [
      [440, 0.09, 0, "triangle", 0.07],
      [554, 0.12, 0.07, "triangle", 0.065],
      [659, 0.18, 0.14, "triangle", 0.06],
    ],
    textures: [
      {
        duration: 0.13,
        frequency: 1400,
        end: 300,
        filter: "bandpass",
        gain: 0.025,
      },
    ],
  },
  bossClear: {
    notes: [
      [130, 0.22, 0, "sine", 0.08, 55],
      [392, 0.25, 0.16, "triangle", 0.06],
      [494, 0.25, 0.25, "triangle", 0.05],
      [587, 0.4, 0.34, "triangle", 0.05],
    ],
    textures: [
      {
        duration: 0.35,
        frequency: 1600,
        end: 150,
        filter: "lowpass",
        gain: 0.05,
      },
    ],
  },
  // Inarticulate puppet-like syllables; no words or impersonated recordings.
  murmurLow: {
    voices: [
      [105, 650, 0, 0.13, 135],
      [135, 1050, 0.17, 0.1, 95],
      [110, 750, 0.35, 0.16, 125],
    ],
  },
  murmurHigh: {
    voices: [
      [205, 1300, 0, 0.1, 250],
      [245, 1800, 0.14, 0.13, 180],
      [185, 1000, 0.34, 0.12, 220],
    ],
  },
  build: {
    notes: [
      [185, 0.065, 0, "sine", 0.075, 75],
      [240, 0.055, 0.11, "triangle", 0.045, 95],
      [165, 0.075, 0.23, "sine", 0.065, 65],
    ],
    textures: [
      {
        duration: 0.2,
        frequency: 1250,
        end: 450,
        filter: "bandpass",
        gain: 0.026,
        delay: 0.04,
      },
    ],
  },
  upgrade: {
    notes: [
      [240, 0.045, 0, "triangle", 0.055, 130],
      [270, 0.04, 0.08, "triangle", 0.05, 150],
      [185, 0.08, 0.18, "sine", 0.075, 65],
      [1200, 0.16, 0.24, "sine", 0.018],
    ],
    textures: [
      {
        duration: 0.12,
        frequency: 2200,
        filter: "bandpass",
        gain: 0.025,
        delay: 0.06,
      },
    ],
  },
  recruit: {
    notes: [
      [100, 0.07, 0, "sine", 0.045, 55],
      [130, 0.06, 0.09, "sine", 0.035, 65],
    ],
    textures: [
      { duration: 0.045, frequency: 550, filter: "lowpass", gain: 0.035 },
    ],
  },
  remove: {
    textures: [
      {
        duration: 0.24,
        frequency: 1000,
        end: 300,
        filter: "bandpass",
        gain: 0.04,
      },
      {
        duration: 0.05,
        frequency: 400,
        filter: "lowpass",
        gain: 0.04,
        delay: 0.19,
      },
    ],
  },
  error: {
    notes: [
      [110, 0.08, 0, "triangle"],
      [95, 0.1, 0.1, "triangle"],
    ],
  },
  throw: {
    textures: [
      {
        duration: 0.11,
        frequency: 1900,
        end: 500,
        filter: "bandpass",
        gain: 0.022,
      },
    ],
  },
  stone: {
    notes: [
      [165, 0.065, 0, "sine", 0.085, 48],
      [430, 0.024, 0.005, "triangle", 0.025, 210],
    ],
    textures: [
      {
        duration: 0.065,
        frequency: 1000,
        end: 260,
        filter: "lowpass",
        gain: 0.06,
      },
    ],
  },
  heavyStone: {
    notes: [[110, 0.13, 0, "sine", 0.095, 32]],
    textures: [
      {
        duration: 0.14,
        frequency: 800,
        end: 180,
        filter: "lowpass",
        gain: 0.075,
      },
      {
        duration: 0.05,
        frequency: 1400,
        filter: "bandpass",
        gain: 0.023,
        delay: 0.06,
      },
    ],
  },
  bottle: {
    notes: [
      [1720, 0.075, 0, "sine", 0.021],
      [2540, 0.11, 0.012, "sine", 0.018],
      [3610, 0.065, 0.025, "sine", 0.014],
      [4680, 0.045, 0.044, "sine", 0.009],
    ],
    textures: [
      { duration: 0.18, frequency: 2700, filter: "highpass", gain: 0.065 },
      {
        duration: 0.055,
        frequency: 4200,
        filter: "highpass",
        gain: 0.027,
        delay: 0.09,
      },
    ],
  },
  splash: {
    notes: [[95, 0.13, 0, "sine", 0.06, 42]],
    textures: [
      {
        duration: 0.22,
        frequency: 900,
        end: 180,
        filter: "lowpass",
        gain: 0.085,
      },
      {
        duration: 0.08,
        frequency: 1500,
        filter: "bandpass",
        gain: 0.027,
        delay: 0.06,
      },
    ],
  },
  fire: {
    notes: [
      [1800, 0.07, 0, "sine", 0.018],
      [2780, 0.05, 0.015, "sine", 0.012],
    ],
    textures: [
      { duration: 0.09, frequency: 2800, filter: "highpass", gain: 0.05 },
      {
        duration: 0.65,
        frequency: 1700,
        end: 170,
        filter: "lowpass",
        gain: 0.085,
        delay: 0.055,
      },
      {
        duration: 0.025,
        frequency: 3400,
        filter: "highpass",
        gain: 0.022,
        delay: 0.19,
      },
      {
        duration: 0.03,
        frequency: 2700,
        filter: "highpass",
        gain: 0.02,
        delay: 0.34,
      },
      {
        duration: 0.035,
        frequency: 3900,
        filter: "highpass",
        gain: 0.018,
        delay: 0.48,
      },
    ],
  },
  sound: {
    notes: [
      [260, 0.13, 0, "sawtooth", 0.013, 220],
      [520, 0.12, 0.015, "sine", 0.012, 440],
    ],
    textures: [
      { duration: 0.1, frequency: 1700, filter: "bandpass", gain: 0.018 },
    ],
  },
  wood: {
    notes: [
      [195, 0.06, 0, "triangle", 0.065, 80],
      [315, 0.035, 0.012, "sine", 0.025, 155],
    ],
    textures: [
      { duration: 0.055, frequency: 750, filter: "bandpass", gain: 0.05 },
    ],
  },
  hit: {
    notes: [[115, 0.075, 0, "sine", 0.065, 45]],
    textures: [
      { duration: 0.055, frequency: 450, filter: "lowpass", gain: 0.045 },
    ],
  },
  kill: {
    textures: [
      {
        duration: 0.12,
        frequency: 800,
        end: 220,
        filter: "lowpass",
        gain: 0.032,
      },
      {
        duration: 0.055,
        frequency: 1250,
        filter: "bandpass",
        gain: 0.016,
        delay: 0.05,
      },
    ],
  },
  assembly: {
    notes: [
      [220, 0.15, 0, "sine"],
      [330, 0.15, 0.1, "sine"],
      [440, 0.22, 0.2, "sine"],
    ],
  },
  wave: {
    notes: [
      [196, 0.12, 0, "triangle"],
      [294, 0.15, 0.12, "triangle"],
    ],
  },
  clear: {
    notes: [
      [392, 0.12, 0, "sine"],
      [494, 0.12, 0.1, "sine"],
      [587, 0.22, 0.2, "sine"],
    ],
  },
  victory: {
    notes: [
      [392, 0.16, 0, "triangle"],
      [494, 0.16, 0.13, "triangle"],
      [587, 0.16, 0.26, "triangle"],
      [784, 0.32, 0.4, "sine"],
    ],
  },
  defeat: {
    notes: [
      [294, 0.2, 0, "triangle"],
      [220, 0.2, 0.18, "triangle"],
      [147, 0.35, 0.36, "sine"],
    ],
  },
};
