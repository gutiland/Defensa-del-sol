export const LEVELS = [
  {
    number: 1,
    name: "La primera resistencia",
    first: 1,
    last: 5,
    boss: "bossDani",
    bossHealth: 1,
  },
  {
    number: 2,
    name: "El cerco",
    first: 6,
    last: 12,
    boss: "bossSanti",
    bossHealth: 4,
  },
  {
    number: 3,
    name: "La batalla del decreto",
    first: 13,
    last: 20,
    boss: "bossPedro",
    bossHealth: 14,
  },
];
export const campaignLevel = (round) =>
  LEVELS.find((level) => round <= level.last) || LEVELS.at(-1);
export const levelRound = (round) => round - campaignLevel(round).first + 1;

export function campaignPressure(round) {
  const level = campaignLevel(round);
  const progress = Math.max(
    0,
    Math.min(1, (round - level.first) / (level.last - level.first)),
  );
  if (level.number === 1)
    return { health: 1, speed: 1, damage: 1, groupSpacing: 3.2 };
  if (level.number === 2)
    return {
      health: 1.5 + progress * 1.5,
      speed: 1.04 + progress * 0.06,
      damage: 1.1 + progress * 0.25,
      groupSpacing: 2.6,
    };
  return {
    health: 3.6 + progress * 2.9,
    speed: 1.12 + progress * 0.1,
    damage: 1.4 + progress * 0.35,
    groupSpacing: 2.1,
  };
}
