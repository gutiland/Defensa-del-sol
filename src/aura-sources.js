// Keep references to live emitters; movement within the tick remains observable.
export function auraSources(game) {
  const bosses = [],
    runners = [],
    odors = [];
  for (const u of game.units) {
    if (u.hp <= 0) continue;
    if (u.kind === "bossDani") bosses.push(u);
    else if (u.kind === "fast") runners.push(u);
  }
  for (const b of game.buildings)
    if (b.hp > 0 && b.type === "odor") odors.push(b);
  return { bosses, runners, odors };
}
