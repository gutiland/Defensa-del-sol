import { Game, BUILDINGS, ENTRIES } from "../src/engine.js";
import { placementError } from "../src/placement.js";
import { maxLevel } from "../src/data/weapons.js";
import { pathToFileURL } from "node:url";

const samples = ENTRIES.flatMap((entry) => entry.route);
const grid = [];
for (let y = 110; y <= 650; y += 32)
  for (let x = 120; x <= 880; x += 32) grid.push({ x, y });
const ranks = Object.fromEntries(
  Object.entries(BUILDINGS).map(([kind, d]) => [
    kind,
    grid
      .map((p) => ({
        ...p,
        score: samples.reduce(
          (sum, s) =>
            sum + (Math.hypot(p.x - s.x, p.y - s.y) < (d.range || 150) ? 1 : 0),
          0,
        ),
      }))
      .sort((a, b) => b.score - a.score),
  ]),
);

export function runStrategy(config) {
  const game = new Game();
  const actions = [],
    rounds = [];
  let casts = 0;
  function command(c) {
    if (!game.command(c)) return false;
    actions.push({
      round: game.round,
      time: +game.time.toFixed(2),
      command: c,
    });
    return true;
  }
  function build(kind) {
    if (game.money < BUILDINGS[kind].cost) return false;
    if (kind !== "speaker") {
      const p = ranks[kind].find((p) => !placementError(game, p.x, p.y, kind));
      return !!p && command({ type: "build", kind, x: p.x, y: p.y });
    }
    const points = ranks[kind].filter(
      (p) => !placementError(game, p.x, p.y, kind),
    );
    if (kind === "speaker")
      points.sort((a, b) => {
        const overlap = (p) =>
          game.buildings.filter(
            (b) =>
              b.type === "speaker" && Math.hypot(p.x - b.x, p.y - b.y) < 130,
          ).length;
        return b.score - overlap(b) * 50 - (a.score - overlap(a) * 50);
      });
    const p = points[0];
    return !!p && command({ type: "build", kind, x: p.x, y: p.y });
  }
  function improve(b) {
    if (b.level < maxLevel(b.type))
      return command({ type: "upgrade", id: b.id });
    if (!b.branch)
      return command({
        type: "specialize",
        id: b.id,
        branch:
          b.type === "kitchen" || b.type === "speaker"
            ? "rapid"
            : config.branch,
      });
    return false;
  }
  function buy() {
    const tents = game.buildings.filter((b) => b.type === "tent");
    const radios = game.buildings.filter((b) => b.type === "speaker");
    const kitchens = game.buildings.filter((b) => b.type === "kitchen");
    if (tents.length < config.opening) return build("tent");
    if (!radios.length) return build("speaker");
    const first = tents.find((b) => b.level < config.earlyLevel);
    if (first) return improve(first);
    if (
      game.round >= config.economyAt &&
      game.round <= 12 &&
      kitchens.length < config.kitchens
    )
      return build("kitchen");
    const kitchen = kitchens.find((b) => b.level < 3 || !b.branch);
    if (kitchen) return improve(kitchen);
    if (radios.length < Math.ceil(tents.length / config.radioEvery))
      return build("speaker");
    if (config.base && (game.base.level < 4 || !game.base.branch))
      return improve(game.base);
    const pending = game.buildings.find(
      (b) =>
        ["tent", "area"].includes(b.type) &&
        (b.level < maxLevel(b.type) || !b.branch),
    );
    if (pending && improve(pending)) return true;
    if (pending && game.money < 65) return false;
    const kind =
      config.areaEvery &&
      tents.length &&
      tents.length % config.areaEvery === 0 &&
      game.buildings.at(-1)?.type !== "area"
        ? "area"
        : "tent";
    return build(kind);
  }
  let steps = 0;
  while (!game.result && steps < 180000) {
    if (game.phase === "build") {
      for (let i = 0; i < 300 && buy(); i++);
      rounds.push({
        round: game.round,
        base: Math.ceil(game.base.hp),
        money: game.money,
        buildings: game.buildings.length,
      });
      command({ type: "ready" });
    }
    if (steps % 15 === 0) buy();
    if (
      game.phase === "combat" &&
      game.time >= game.abilityReadyAt &&
      game.units.filter(
        (u) => Math.hypot(u.x - game.base.x, u.y - game.base.y) < 220,
      ).length >= 4
    )
      if (command({ type: "ability" })) casts++;
    game.tick(1 / 60);
    steps++;
  }
  return {
    config,
    result: game.result || "timeout",
    round: game.round,
    base: Math.ceil(game.base.hp),
    buildings: game.buildings.length,
    improved: game.buildings.filter((b) => b.level > 1).length,
    casts,
    rounds,
    actions,
  };
}

export const EXAMPLE_STRATEGY = {
  opening: 2,
  kitchens: 2,
  earlyLevel: 2,
  economyAt: 3,
  radioEvery: 4,
  areaEvery: 4,
  branch: "power",
  base: false,
};

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  if (process.argv.includes("--example")) {
    const { actions, ...result } = runStrategy(EXAMPLE_STRATEGY);
    console.log(
      JSON.stringify(
        { ...result, openingActions: actions.filter((a) => a.round === 1) },
        null,
        2,
      ),
    );
  } else {
    for (const opening of [1, 2, 3])
      for (const kitchens of [0, 2, 4])
        for (const earlyLevel of [2, 3]) {
          const result = runStrategy({
            opening,
            kitchens,
            earlyLevel,
            economyAt: 3,
            radioEvery: 4,
            areaEvery: 4,
            branch: "power",
            base: false,
          });
          const { actions, rounds, ...summary } = result;
          console.log(JSON.stringify(summary));
        }
  }
}
