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
    bossHealth: 1.4,
  },
  {
    number: 3,
    name: "La batalla del decreto",
    first: 13,
    last: 20,
    boss: "bossPedro",
    bossHealth: 2,
  },
];
export const campaignLevel = (round) =>
  LEVELS.find((level) => round <= level.last) || LEVELS.at(-1);
export const levelRound = (round) => round - campaignLevel(round).first + 1;
