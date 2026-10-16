export const buildingScale = (b) =>
  (b.id === "base" ? 0.58 : 0.44) + (b.level - 1) * 0.1;
export const hasDefender = (b) =>
  b.id === "base" ||
  (Number.isInteger(b.id) && b.id % 2 === 1);
