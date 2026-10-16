import { storyEventFor } from "./data/story-events.js";

export function chooseStoryEvent(game, optionId) {
  const event = storyEventFor(game);
  if (
    !event ||
    game.phase !== "build" ||
    game.result ||
    game.storyChoices[game.round]
  )
    return false;
  const option = event.options.find((item) => item.id === optionId);
  if (!option) return false;
  const hasTent = game.buildings.some((b) => b.type === "tent" && b.hp > 0);
  const cost = event.id === "tent-dispute" && !hasTent ? 0 : option.cost;
  if (game.money < cost) return false;
  game.money -= cost;
  game.storyChoices[game.round] = optionId;
  return true;
}
export function beginStoryEvent(game) {
  game.storyEvent = null;
  const event = storyEventFor(game);
  if (!event) return;
  const choice = game.storyChoices[game.round] || event.default;
  if (event.id === "tent-dispute" && choice === "debate") {
    const tent = game.buildings
      .filter((b) => b.type === "tent" && b.hp > 0)
      .sort((a, b) => a.id - b.id)[0];
    if (tent)
      game.storyEvent = {
        id: event.id,
        title: "Tienda en debate",
        buildingId: tent.id,
        until: 0,
        wholeRound: true,
      };
  } else if (event.id === "rain") {
    game.storyEvent = {
      id: event.id,
      title: "Lonas mojadas",
      until: event.duration,
      intervalMultiplier: choice === "cover" ? 1 : 1.25,
    };
    const basic = game.pending.filter((u) => u.kind === "basic");
    for (let i = 0; i < 2; i++)
      if (basic.length) {
        const source = basic[Math.floor((i * basic.length) / 2)];
        game.pending.push({ ...source, at: source.at + 3 });
      }
  } else if (event.id === "october12") {
    const normal = game.pending.filter((u) => !u.kind.startsWith("boss"));
    const count = Math.ceil(normal.length * 0.25);
    for (let i = 0; i < count; i++) {
      const source = normal[Math.floor((i * normal.length) / count)];
      if (source)
        game.pending.push({
          ...source,
          at: source.at + 4 + (choice === "organize" ? 10 : 0),
        });
    }
    game.storyEvent = {
      id: event.id,
      title: "Refuerzos del 12-O",
      until: 0,
      extra: count,
    };
  }
}
export const eventBlocksBuilding = (game, b) =>
  game.storyEvent?.buildingId === b.id &&
  (game.storyEvent.wholeRound || game.time < game.storyEvent.until);
export const eventShotInterval = (game) =>
  game.storyEvent?.id === "rain" && game.time < game.storyEvent.until
    ? game.storyEvent.intervalMultiplier
    : 1;
