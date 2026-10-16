import { Game, BUILDINGS, ENTRIES } from "../src/engine.js";
import { placementError } from "../src/placement.js";
import { maxLevel } from "../src/data/weapons.js";
const maxBuildings = Number(
  process.argv
    .find((arg) => arg.startsWith("--max-buildings="))
    ?.split("=")[1] || Infinity,
);
const onlyStrategy = process.argv
  .find((arg) => arg.startsWith("--strategy="))
  ?.split("=")[1];

// Scripted buyers are a balance diagnostic, not a replacement for human play.
const samples = ENTRIES.flatMap((entry) =>
  entry.route.flatMap((point, index, points) => {
    const before = index ? points[index - 1] : entry;
    const length = Math.hypot(point.x - before.x, point.y - before.y);
    return Array.from(
      { length: Math.max(1, Math.ceil(length / 25)) },
      (_, i) => {
        const t = (i + 1) / Math.max(1, Math.ceil(length / 25));
        return {
          x: before.x + (point.x - before.x) * t,
          y: before.y + (point.y - before.y) * t,
        };
      },
    );
  }),
);
const candidates = [];
for (let x = 120; x <= 880; x += 40)
  for (let y = 100; y <= 660; y += 40) candidates.push({ x, y });
const ranked = Object.fromEntries(
  ["tent", "area", "odor", "kitchen"].map((kind) => [
    kind,
    candidates
      .map((p) => ({
        ...p,
        score: samples.reduce(
          (n, s) =>
            n +
            (Math.hypot(p.x - s.x, p.y - s.y) < (BUILDINGS[kind].range || 185)
              ? 1
              : 0),
          0,
        ),
      }))
      .sort((a, b) => b.score - a.score),
  ]),
);

function buy(game, strategy) {
  if (strategy === "none") return;
  if (strategy === "base") {
    game.command({ type: "upgrade", id: "base" });
    return;
  }
  if (strategy !== "area") {
    const tower = game.buildings.find(
      (b) => b.type === "tent" && b.level < maxLevel(b.type),
    );
    if (tower && game.command({ type: "upgrade", id: tower.id })) return;
  }
  let kind = strategy === "area" ? "area" : "tent";
  if (strategy === "mixed" && game.buildings.length % 3 === 2) kind = "area";
  if (
    strategy === "kitchen" &&
    !game.buildings.some((b) => b.type === "kitchen")
  )
    kind = "kitchen";
  if (strategy === "odor" && !game.buildings.some((b) => b.type === "odor"))
    kind = "odor";
  if (game.money < BUILDINGS[kind].cost) return;
  if (game.buildings.length >= maxBuildings) return;
  const place = ranked[kind].find((p) => !placementError(game, p.x, p.y, kind));
  if (place) game.command({ type: "build", kind, x: place.x, y: place.y });
}

for (const strategy of [
  "none",
  "base",
  "tent",
  "area",
  "mixed",
  "kitchen",
  "odor",
]) {
  if (onlyStrategy && strategy !== onlyStrategy) continue;
  const game = new Game(),
    waves = [];
  let steps = 0;
  while (!game.result && steps < 180000) {
    if (steps % 15 === 0) buy(game, strategy);
    if (game.phase === "build") {
      for (let i = 0; i < 20; i++) buy(game, strategy);
      waves.push({
        round: game.round,
        base: Math.ceil(game.base.hp),
        money: game.money,
        buildings: game.buildings.length,
      });
      game.command({ type: "ready" });
    }
    game.tick(1 / 60);
    steps++;
  }
  console.log(
    JSON.stringify({
      mode: "defense",
      strategy,
      result: game.result,
      round: game.round,
      base: Math.ceil(game.base.hp),
      kills: game.kills,
      seconds: Math.round(steps / 60),
      waves,
    }),
  );
}

for (const strategy of [
  "basic",
  "fast",
  "heavy",
  "perfume",
  "combined",
  "savePedro",
]) {
  if (process.argv.includes("--defense-only")) break;
  const game = new Game("attack");
  let steps = 0;
  while (!game.result && steps < 180000) {
    if (game.phase === "attack") {
      if (strategy === "savePedro") {
        if (game.command({ type: "recruit", kind: "bossPedro", entry: 0 })) {
          while (game.command({ type: "recruit", kind: "basic", entry: 0 })) {}
        } else game.command({ type: "recruit", kind: "basic", entry: 0 });
      } else {
        const kinds =
          strategy === "combined"
            ? ["heavy", "fast", "basic", "basic"]
            : [strategy];
        let i = 0;
        while (
          game.command({
            type: "recruit",
            kind: kinds[i % kinds.length],
            entry: 0,
          })
        )
          i++;
        while (game.command({ type: "recruit", kind: "basic", entry: 0 })) {}
      }
      if (!game.command({ type: "ready" })) break;
    }
    game.tick(1 / 60);
    steps++;
  }
  console.log(
    JSON.stringify({
      mode: "attack",
      strategy,
      result: game.result,
      round: game.round,
      base: Math.ceil(game.base.hp),
      kills: game.kills,
      seconds: Math.round(steps / 60),
    }),
  );
}
