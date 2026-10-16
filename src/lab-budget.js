import { Game, UNITS, ENTRIES } from "./engine.js";
import { normalWave } from "./data/waves.js";
import { campaignLevel } from "./data/campaign.js";
import { bossWave } from "./data/bosses.js";
import { STORY_EVENTS } from "./data/story-events.js";
import { bountyFor, ROUND_PROVISIONS } from "./data/progression.js";

export function labBudget(round) {
  if (!Number.isInteger(round) || round < 1 || round > 20)
    throw new RangeError("Ronda inválida");
  let budget = new Game().money;
  for (let previous = 1; previous < round; previous++) {
    const normal = normalWave(previous, ENTRIES.length);
    const army = [...normal];
    if (campaignLevel(previous).last === previous)
      army.push(...bossWave(previous, ENTRIES.length));
    const event = STORY_EVENTS[previous];
    if (event?.id === "rain") army.push({ kind: "basic" }, { kind: "basic" });
    if (event?.id === "october12") {
      const count = Math.ceil(normal.length * 0.25);
      for (let i = 0; i < count; i++)
        army.push(normal[Math.floor((i * normal.length) / count)]);
    }
    budget +=
      ROUND_PROVISIONS +
      army.reduce(
        (sum, unit) =>
          sum + bountyFor({ ...UNITS[unit.kind], kind: unit.kind }),
        0,
      );
  }
  return budget;
}
