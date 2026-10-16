export class PerformanceSamples {
  constructor(limit = 300) {
    this.limit = limit;
    this.frames = [];
  }
  add(frame, simulation, render) {
    this.frames.push({ frame, simulation, render });
    if (this.frames.length > this.limit) this.frames.shift();
  }
  summary() {
    const percentile = (key, p) => {
      const values = this.frames.map((f) => f[key]).sort((a, b) => a - b);
      return values.length
        ? values[
            Math.min(
              values.length - 1,
              Math.max(0, Math.ceil(values.length * p) - 1),
            )
          ]
        : 0;
    };
    return {
      samples: this.frames.length,
      fps: this.frames.length
        ? 1000 /
          (this.frames.reduce((n, f) => n + f.frame, 0) / this.frames.length)
        : 0,
      frameP95: percentile("frame", 0.95),
      simulationP95: percentile("simulation", 0.95),
      renderP50: percentile("render", 0.5),
      renderP95: percentile("render", 0.95),
    };
  }
}
