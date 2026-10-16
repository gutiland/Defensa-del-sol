import { pathToFileURL } from "node:url";
import { Game, BUILDINGS, ENTRIES } from "../src/engine.js";
import { placementError } from "../src/placement.js";
import { maxLevel } from "../src/data/weapons.js";

const routePoints = ENTRIES.flatMap((entry) => entry.route);
const candidates = [];
for (let y = 100; y <= 660; y += 32)
  for (let x = 120; x <= 880; x += 32) candidates.push({ x, y });

export function preparedCamp(count, round = 20) {
  const game = new Game();
  game.round = round;
  game.defendedWaves = round - 1;
  game.money = 100000;
  while (game.base.level < maxLevel("tent"))
    game.command({ type: "upgrade", id: "base" });
  game.command({ type: "specialize", id: "base", branch: "power" });
  for (let i = 0; i < count; i++) {
    const kind = i % 6 === 4 ? "speaker" : i % 6 === 5 ? "area" : "tent";
    const range = BUILDINGS[kind].range;
    const point = candidates
      .filter((p) => !placementError(game, p.x, p.y, kind))
      .map((p) => ({
        ...p,
        score: routePoints.filter(
          (r) => Math.hypot(r.x - p.x, r.y - p.y) < range,
        ).length,
      }))
      .sort((a, b) => b.score - a.score)[0];
    if (
      !point ||
      !game.command({ type: "build", kind, x: point.x, y: point.y })
    )
      throw Error("Campamento sin espacio");
    const b = game.buildings.at(-1);
    while (b.level < maxLevel(kind))
      game.command({ type: "upgrade", id: b.id });
    game.command({
      type: "specialize",
      id: b.id,
      branch: kind === "speaker" ? "rapid" : "power",
    });
  }
  game.money = 0;
  game.command({ type: "ready" });
  return game;
}

export function checkCamp(count, round = 20) {
  const game = preparedCamp(count, round);
  let steps = 0;
  while (!game.result && game.phase === "combat" && steps++ < 24000)
    game.tick(0.05);
  return {
    count,
    round,
    result: game.result || (game.phase === "build" ? "survived" : "timeout"),
    base: Math.ceil(game.base.hp),
    kills: game.kills,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  for (const count of [12, 19, 20, 24, 32])
    console.log(JSON.stringify(checkCamp(count)));
