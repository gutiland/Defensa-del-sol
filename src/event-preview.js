import { Game, SLOTS } from "./engine.js";
import { placementError } from "./placement.js";
import { STORY_EVENTS } from "./data/story-events.js";
import { STORY_SCENES } from "./data/story-scenes.js";

export const EVENT_PREVIEWS = [
  ...new Set([...Object.keys(STORY_EVENTS), ...Object.keys(STORY_SCENES)]),
]
  .map(Number)
  .sort((a, b) => a - b)
  .map((round) => ({
    round,
    title: STORY_EVENTS[round]?.title || STORY_SCENES[round].title,
    event: STORY_EVENTS[round] || null,
  }));

// Isolated defense instance: uses real choices and rules without campaign progress.
export class EventPreviewGame extends Game {
  constructor(round) {
    super("defense");
    if (!EVENT_PREVIEWS.some((item) => item.round === round))
      throw new RangeError("Evento no disponible");
    this.round = round;
    this.autoAdvance = false;
    this.base.invulnerable = true;
    const candidates = [...SLOTS];
    for (let y = 160; y <= 650; y += 45)
      for (let x = 120; x <= 900; x += 45) candidates.push({ x, y });
    for (const kind of [
      "tent",
      "tent",
      "speaker",
      "area",
      "kitchen",
      "odor",
      "barrier",
    ]) {
      const point = candidates.find(
        (p) => !placementError(this, p.x, p.y, kind),
      );
      if (point) this.command({ type: "build", kind, ...point });
    }
  }
  get money() {
    return Infinity;
  }
  set money(_) {
    /* Preview choices never require earning resources. */
  }
}
