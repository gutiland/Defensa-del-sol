import { Game, BUILDINGS, UNITS } from "./engine.js";
import { WAVES } from "./data/waves.js";
import { LEVELS } from "./data/campaign.js";
import { maxLevel } from "./data/weapons.js";
import { readStorage, writeStorage } from "./preferences.js";
import { validAwards } from "./data/awards.js";
import { STORY_EVENTS } from "./data/story-events.js";
import { placementError } from "./placement.js";
const KEY = "sol-campaign-v1";
const finite = (n, min = 0, max = 1e9) =>
  Number.isFinite(n) && n >= min && n <= max;
function validBuilding(b, base = false) {
  return (
    b &&
    Object.hasOwn(BUILDINGS, b.type) &&
    (base
      ? b.id === "base"
      : Number.isInteger(b.id) && b.id > 0 && b.id < 1e9) &&
    finite(b.x, -100, 1500) &&
    finite(b.y, -100, 1500) &&
    finite(b.hp) &&
    finite(b.maxHp, 1, 10000) &&
    b.hp <= b.maxHp &&
    Number.isInteger(b.level) &&
    b.level >= 1 &&
    b.level <= maxLevel(b.type) &&
    (!b.branch || ["rapid", "power"].includes(b.branch)) &&
    (b.production === undefined || finite(b.production, 0, 5)) &&
    (!base || b.type === "tent") &&
    (b.refundable === undefined || typeof b.refundable === "boolean")
  );
}
export function saveCampaign(game) {
  if (
    game.mode === "defense" &&
    !game.sandbox &&
    game.autoAdvance !== false &&
    game.awards?.length
  ) {
    const previous = readStorage("sol-medals-v1");
    const medals = [
      ...new Set([
        ...(Array.isArray(previous) ? validAwards(previous) : []),
        ...validAwards(game.awards),
      ]),
    ];
    if (JSON.stringify(previous) !== JSON.stringify(medals))
      writeStorage("sol-medals-v1", medals);
  }
  if (
    game.mode !== "defense" ||
    game.sandbox ||
    game.phase !== "build" ||
    game.result ||
    game.autoAdvance === false
  )
    return false;
  const fields = [
    "round",
    "money",
    "base",
    "buildings",
    "nextId",
    "nextUnitId",
    "nextVisualId",
    "defendedWaves",
    "kills",
    "earned",
    "storyChoices",
    "discoveredEnemies",
    "reports",
    "awards",
    "bestChain",
    "bossesDefeated",
    "defeatedBossKinds",
  ];
  const state = Object.fromEntries(fields.map((key) => [key, game[key]]));
  return writeStorage(KEY, { version: 1, state });
}
export function loadCampaign() {
  const data = readStorage(KEY),
    s = data?.state;
  if (
    data?.version !== 1 ||
    !s ||
    !Number.isInteger(s.round) ||
    !finite(s.round, 1, 20) ||
    !finite(s.money) ||
    !validBuilding(s.base, true) ||
    !Array.isArray(s.buildings) ||
    s.buildings.length > 300 ||
    !s.buildings.every((b) => validBuilding(b))
  )
    return null;
  if (
    s.discoveredEnemies !== undefined &&
    (!Array.isArray(s.discoveredEnemies) ||
      s.discoveredEnemies.length > Object.keys(UNITS).length ||
      new Set(s.discoveredEnemies).size !== s.discoveredEnemies.length ||
      !s.discoveredEnemies.every(
        (kind) => typeof kind === "string" && Object.hasOwn(UNITS, kind),
      ))
  )
    return null;
  const ids = s.buildings.map((b) => b.id);
  if (
    new Set(ids).size !== ids.length ||
    !Number.isInteger(s.nextId) ||
    s.nextId <= Math.max(0, ...ids)
  )
    return null;
  for (const field of [
    "nextUnitId",
    "nextVisualId",
    "defendedWaves",
    "kills",
    "earned",
    "bestChain",
    "bossesDefeated",
  ])
    if (!finite(s[field]) || !Number.isInteger(s[field])) return null;
  if (
    s.defendedWaves !== s.round - 1 ||
    !Array.isArray(s.reports) ||
    s.reports.length > 20 ||
    !Array.isArray(s.awards) ||
    s.awards.length > 4 ||
    validAwards(s.awards).length !== s.awards.length ||
    !s.storyChoices ||
    typeof s.storyChoices !== "object" ||
    Array.isArray(s.storyChoices) ||
    Object.keys(s.storyChoices).length > Object.keys(STORY_EVENTS).length
  )
    return null;
  const game = new Game("defense");
  game.discoveredEnemies = s.discoveredEnemies || [
    ...new Set([
      ...WAVES.slice(0, s.round - 1).flatMap((wave) =>
        wave.groups.map(([kind]) => kind),
      ),
      ...LEVELS.filter((level) => level.last < s.round).map(
        (level) => level.boss,
      ),
    ]),
  ];
  if (s.base.x !== game.base.x || s.base.y !== game.base.y) return null;
  for (const [round, option] of Object.entries(s.storyChoices)) {
    if (
      !Object.hasOwn(STORY_EVENTS, round) ||
      Number(round) > s.round ||
      !STORY_EVENTS[round].options.some((o) => o.id === option)
    )
      return null;
  }
  for (const field of [
    "round",
    "money",
    "nextId",
    "nextUnitId",
    "nextVisualId",
    "defendedWaves",
    "kills",
    "earned",
    "bestChain",
    "bossesDefeated",
  ])
    game[field] = s[field];
  const copyBuilding = (b) =>
    Object.fromEntries(
      [
        "id",
        "type",
        "x",
        "y",
        "level",
        "hp",
        "maxHp",
        "branch",
        "refundable",
        "production",
      ]
        .filter((key) => b[key] !== undefined)
        .map((key) => [key, b[key]]),
    );
  game.base = { ...copyBuilding(s.base), cooldown: 0 };
  game.buildings = [];
  for (const b of s.buildings) {
    if (placementError(game, b.x, b.y, b.type)) return null;
    game.buildings.push({ ...copyBuilding(b), cooldown: 0 });
  }
  game.storyChoices = Object.fromEntries(
    Object.entries(s.storyChoices).filter(
      ([r, v]) => /^\d+$/.test(r) && typeof v === "string",
    ),
  );
  game.reports = s.reports
    .filter(
      (r) =>
        r &&
        finite(r.round, 1, 20) &&
        finite(r.kills) &&
        finite(r.earned) &&
        finite(r.lostHealth) &&
        typeof r.star === "string" &&
        r.star.length <= 120 &&
        (r.bestChain === undefined || finite(r.bestChain)),
    )
    .map((r) => ({
      round: r.round,
      kills: r.kills,
      earned: r.earned,
      lostHealth: r.lostHealth,
      star: r.star,
      bestChain: r.bestChain || 0,
    }));
  game.awards = validAwards(s.awards);
  game.defeatedBossKinds = Array.isArray(s.defeatedBossKinds)
    ? [
        ...new Set(
          s.defeatedBossKinds.filter((kind) =>
            ["bossDani", "bossSanti", "bossPedro"].includes(kind),
          ),
        ),
      ]
    : [];
  game.bossesDefeated = game.defeatedBossKinds.length;
  return game;
}

export function rememberEnemyIntroduction(game, kind) {
  if (
    game.mode !== "defense" ||
    game.sandbox ||
    game.autoAdvance === false ||
    !Object.hasOwn(UNITS, kind)
  )
    return;
  if (!game.discoveredEnemies.includes(kind)) game.discoveredEnemies.push(kind);
  const checkpoint = readStorage(KEY);
  if (checkpoint?.version !== 1 || checkpoint.state?.round !== game.round)
    return;
  // Keep the preparation checkpoint intact; only persist the presentation history.
  checkpoint.state.discoveredEnemies = [...game.discoveredEnemies];
  writeStorage(KEY, checkpoint);
}
