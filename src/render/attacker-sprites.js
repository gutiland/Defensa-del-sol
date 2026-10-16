import { drawCharacter } from "./characters.js";

// Bounded, renderer-local cache. Only ordinary walking poses are shared;
// hits, strikes, falls, frozen units and bosses retain their full live drawing.
export function createAttackerSprites(
  createCanvas = () => document.createElement("canvas"),
) {
  const frames = new Map();
  let budget = 0;
  return {
    beginFrame() {
      budget = 4;
    },
    draw(ctx, id, x, y, scale, time, role, pose) {
      if (id.startsWith("boss") || pose.hit || pose.release > 0) {
        drawCharacter(ctx, id, x, y, scale, time, role, pose);
        return;
      }
      const speed = !pose.moving
        ? 2
        : role === "sprinter"
          ? 17
          : role === "fast"
            ? 13
            : ["heavy", "armored"].includes(role)
              ? 5
              : 8;
      const phase = time + id.length * 0.37 + (pose.seed || 0) * 0.63;
      const frame = Math.floor(
        (((((phase * speed) / (Math.PI * 2)) % 1) + 1) % 1) * 16,
      );
      const variant =
        role === "heavy" ? Math.abs(Math.trunc(pose.seed || 0)) % 5 : 0;
      const prefix = `${id}:${role}:${variant}:${pose.moving ? "walk" : "still"}:${pose.talking ? "talk" : "quiet"}:`;
      const key = `${prefix}${frame}`;
      let image = frames.get(key);
      if (!image && budget > 0) {
        budget--;
        image = createCanvas();
        image.width = image.height = 128;
        const paint = image.getContext("2d");
        const sampleTime =
          (((frame + 0.5) / 16) * Math.PI * 2) / speed -
          id.length * 0.37 -
          variant * 0.63;
        drawCharacter(paint, id, 64, 72, 1, sampleTime, role, {
          moving: pose.moving,
          talking: pose.talking,
          seed: variant,
        });
        if (frames.size >= 256) frames.delete(frames.keys().next().value);
        frames.set(key, image);
      }
      // While warming the cache, reuse a neighbouring pose rather than
      // rebuilding hundreds of vector characters in the same frame.
      if (!image) {
        for (let offset = 1; offset < 16 && !image; offset++)
          image = frames.get(`${prefix}${(frame + offset) % 16}`);
      }
      if (image) {
        if (frames.has(key)) {
          frames.delete(key);
          frames.set(key, image);
        }
        ctx.drawImage(
          image,
          x - 64 * scale,
          y - 72 * scale,
          128 * scale,
          128 * scale,
        );
      } else drawCharacter(ctx, id, x, y, scale, time, role, pose);
    },
  };
}
