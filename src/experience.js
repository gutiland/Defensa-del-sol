import { BUILDINGS } from "./data/catalog.js";

export function beginRoundReport(game) {
  game.roundStart = {
    hp: game.base.hp,
    kills: game.kills,
    earned: game.earned,
  };
  game.roundDamage = {};
  game.chain = { count: 0, at: -100, reward: 0 };
}
export function recordDefeat(game, unit, reward) {
  const chain = game.chain || { count: 0, at: -100, reward: 0 };
  const together = game.time - chain.at <= 2;
  game.chain = {
    count: together ? chain.count + 1 : 1,
    at: game.time,
    reward: (together ? chain.reward : 0) + reward,
  };
  game.bestChain = Math.max(game.bestChain || 0, game.chain.count);
  if (unit.kind.startsWith("boss")) {
    game.defeatedBossKinds = [
      ...new Set([...(game.defeatedBossKinds || []), unit.kind]),
    ];
    game.bossesDefeated = game.defeatedBossKinds.length;
  }
}
export function finishRoundReport(game) {
  const start = game.roundStart || { hp: game.base.hp, kills: 0, earned: 0 };
  const best = Object.entries(game.roundDamage || {}).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const building =
    best &&
    [game.base, ...game.buildings].find((b) => String(b.id) === best[0]);
  const report = {
    round: game.round,
    kills: game.kills - start.kills,
    earned: game.earned - start.earned,
    lostHealth: Math.max(0, Math.ceil(start.hp - game.base.hp)),
    star: building ? BUILDINGS[building.type].name : "El campamento",
    bestChain: game.bestChain || 0,
  };
  game.reports = [...(game.reports || []), report].slice(-20);
  const awards = new Set(game.awards || []);
  if (report.lostHealth === 0) awards.add("Ni un rasguño");
  if ((game.bestChain || 0) >= 10) awards.add("Coro de diez");
  if (new Set(game.buildings.map((b) => b.type)).size >= 5)
    awards.add("Plaza diversa");
  if ((game.bossesDefeated || 0) >= 3) awards.add("La plaza resiste");
  game.awards = [...awards];
  return report;
}
