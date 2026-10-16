import { projectY } from "../data/map.js";

export const roundIntensity = (round) =>
  Math.max(0, Math.min(1, (round - 1) / 19));
const random = (seed) => {
  const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
};
export function createBattleAtmosphere() {
  let previous = null,
    revision = null,
    time = 0,
    serial = 0,
    ambient = 0,
    particles = [],
    seen = new WeakSet();
  function emit(x, y, kind, count, intensity) {
    for (let i = 0; i < count && particles.length < 160; i++) {
      const seed = ++serial,
        a = random(seed) * Math.PI * 2,
        speed = 25 + random(seed + 1) * 80;
      particles.push({
        x,
        y,
        kind,
        at: time,
        life:
          kind === "paint"
            ? 4
            : kind === "paper"
              ? 3
              : 0.45 + random(seed + 2) * (0.5 + intensity),
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed * 0.5 - 20,
        seed,
      });
    }
  }
  return {
    advance(game, dt) {
      if (game !== previous || game.visualRevision !== revision) {
        previous = game;
        revision = game.visualRevision;
        time = 0;
        particles = [];
        seen = new WeakSet();
        ambient = 0;
      }
      time += Math.max(0, dt);
      particles = particles.filter((p) => time - p.at < p.life);
      const intensity = roundIntensity(game.round),
        count = 4 + Math.round(intensity * 7);
      for (const e of [...game.effects, ...game.deaths]) {
        if (seen.has(e)) continue;
        seen.add(e);
        const x = e.tx ?? e.x,
          y = projectY(e.ty ?? e.y);
        if (e.type === "splash") {
          emit(x, y, "paint", Math.max(2, count - 1), intensity);
          emit(x, y, "purple", count + 2, intensity);
        } else if (e.type === "impact" || e.type === "rubble" || e.character) {
          const weapon = e.weaponType || e.weapon;
          const kind =
            weapon === "molotov"
              ? "spark"
              : weapon === "bottle"
                ? "glass"
                : weapon === "paintbomb"
                  ? "purple"
                  : weapon === "odor"
                    ? "paint"
                    : "dust";
          emit(x, y, kind, count, intensity);
          if (intensity > 0.25 || kind === "spark")
            emit(x, y, "smoke", 1 + Math.round(intensity * 2), intensity);
        }
      }
      if (
        game.phase === "combat" &&
        !game.result &&
        game.units.length &&
        dt > 0
      ) {
        ambient += Math.max(0, dt);
        if (ambient > 0.45 - intensity * 0.25) {
          ambient = 0;
          emit(
            70 + random(++serial) * 860,
            200 + random(serial + 1) * 310,
            "paper",
            1,
            intensity,
          );
          if (game.time >= game.freezeUntil) {
            const moving = game.units.filter(
              (u) => u.hp > 0 && !u.blockedBy && u.cooldown <= 0,
            );
            for (
              let i = 0;
              i < Math.min(moving.length, 3 + Math.round(intensity * 5));
              i++
            ) {
              const u = moving[(serial + i * 7) % moving.length];
              emit(u.x, projectY(u.y) + 18, "dust", 1, intensity);
            }
          }
        }
      }
    },
    draw(ctx, air = false) {
      ctx.save();
      for (const p of particles) {
        if (air === (p.kind === "paint")) continue;
        const age = time - p.at,
          t = age / p.life;
        const x = p.x + p.vx * age,
          y =
            p.y +
            p.vy * age +
            (p.kind === "smoke" ? -15 * age : 22 * age * age);
        ctx.globalAlpha =
          (1 - t) * (p.kind === "smoke" ? 0.2 : p.kind === "paint" ? 0.4 : 0.8);
        if (p.kind === "smoke" || p.kind === "dust") {
          ctx.fillStyle = p.kind === "smoke" ? "#69705d" : "#cabd91";
          ctx.beginPath();
          ctx.ellipse(x, y, 3 + t * 15, 2 + t * 9, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.kind === "paint") {
          ctx.fillStyle = "#aa70ac";
          ctx.beginPath();
          ctx.ellipse(
            p.x + p.vx * 0.2,
            p.y + p.vy * 0.2,
            5 + random(p.seed) * 8,
            3 + random(p.seed) * 4,
            p.seed,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        } else {
          ctx.fillStyle = {
            paper: "#e5d6af",
            spark: "#ffd178",
            glass: "#bfe8df",
            purple: "#cb96ce",
          }[p.kind];
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(p.seed + age * 4);
          ctx.fillRect(
            -2,
            -1,
            p.kind === "paper" ? 8 : 4,
            p.kind === "paper" ? 4 : 2,
          );
          ctx.restore();
        }
      }
      ctx.restore();
    },
    get count() {
      return particles.length;
    },
  };
}
