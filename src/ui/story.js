import { appendStoryReference } from "./story-reference.js";
import { STORY_CHAPTERS } from "../data/story.js";
import { chapterCast } from "../data/plaza-cast.js";
import { drawCharacter } from "../render/characters.js";
import { STORY_EVENTS } from "../data/story-events.js";
import { readStorage } from "../preferences.js";
import { validAwards } from "../data/awards.js";

const views = new WeakMap();
export function renderStory(game, document) {
  const root = document.getElementById("story-chapter");
  root.hidden = game.mode !== "defense" || game.sandbox;
  if (root.hidden) return;
  const previous = views.get(root);
  const completed = Math.min(game.defendedWaves || 0, STORY_CHAPTERS.length);
  const available = Math.min(
    STORY_CHAPTERS.length,
    Math.max(1, completed, game.round),
  );
  const reportCount = game.reports?.length || 0;
  const choice = game.storyChoices?.[game.round];
  if (
    previous?.game === game &&
    previous.round === game.round &&
    previous.completed === completed &&
    previous.available === available &&
    previous.reportCount === reportCount &&
    previous.choice === choice &&
    previous.phase === game.phase
  ) {
    return;
  }
  root.replaceChildren();
  const make = (tag, text) => {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    return element;
  };
  const archive = make("details"),
    summary = make("summary", "Diario de la plaza"),
    card = make("div");
  function show(index) {
    const chapter = STORY_CHAPTERS[index];
    if (!chapter) return;
    card.replaceChildren();
    card.append(
      make("h3", `${index + 1}. ${chapter.title}`),
      make("p", chapter.scene),
      make("blockquote", `${chapter.speaker}: «${chapter.line}»`),
    );
    if (chapter.aside) card.append(make("p", chapter.aside));
    const report = game.reports?.find((r) => r.round === index + 1);
    if (report) {
      const recap = make(
        "p",
        `${report.kills} bajas · +${report.earned} provisiones · ${report.lostHealth ? `Base: −${report.lostHealth}` : "¡Sin daños!"} · Destacada: ${report.star}`,
      );
      recap.className = "round-recap";
      card.append(recap);
    }
    const unlocked = readStorage("sol-medals-v1");
    const awards = [
      ...new Set([...(game.awards || []), ...validAwards(unlocked)]),
    ];
    const goals = [
      ["Ni un rasguño", "Termina una ronda sin daños en la base"],
      ["Coro de diez", "Encadena diez bajas con menos de 2 s entre ellas"],
      ["Plaza diversa", "Termina con cinco tipos de caseta"],
      ["La plaza resiste", "Derrota a los tres jefes"],
    ];
    card.append(
      make(
        "p",
        awards.length ? `★ ${awards.join(" · ")}` : "Medallas de la plaza",
      ),
    );
    const nextGoal = goals.find(([name]) => !awards.includes(name));
    if (nextGoal) card.append(make("small", `Reto opcional: ${nextGoal[1]}.`));
    if (awards.includes("Coro de diez")) card.className = "golden-recap";
    else card.className = "";
    const event = STORY_EVENTS[index + 1];
    if (event) {
      card.append(make("p", `Evento: ${event.title}. ${event.summary}`));
      const choice = event.options.find(
        (option) =>
          option.id === (game.storyChoices?.[index + 1] || event.default),
      );
      card.append(
        make("p", `Decisión: ${choice.label}. ${choice.description}`),
      );
    }
    const reference = make("p");
    appendStoryReference(document, reference, index + 1);
    card.append(reference);
    for (const actor of chapterCast(index + 1)) {
      const cameo = make("div");
      cameo.className = "story-cameo";
      const portrait = make("canvas");
      portrait.width = 110;
      portrait.height = 115;
      portrait.setAttribute("aria-hidden", "true");
      const ctx = portrait.getContext?.("2d");
      if (ctx)
        drawCharacter(ctx, actor.id, 56, 78, 1.2, 0, actor.role, {
          moving: false,
        });
      const words = make("div");
      words.append(
        make("strong", actor.name),
        make("blockquote", `«${actor.entrance}»`),
      );
      cameo.append(portrait, words);
      card.append(cameo);
    }
    if (chapter.context || chapter.material.length) {
      const sources = make("details");
      sources.append(make("summary", "Pancartas y procedencia"));
      if (chapter.context) sources.append(make("p", chapter.context));
      for (const item of chapter.material) {
        const entry = make("p");
        entry.append(
          make("strong", `«${item.text}»`),
          make("span", ` — ${item.source}. ${item.context}`),
        );
        sources.append(entry);
      }
      card.append(sources);
    }
  }
  archive.open =
    previous?.game !== game ||
    previous.round !== game.round ||
    (game.phase === "combat" && previous.phase !== "combat") ||
    completed > previous.completed ||
    previous.archive.open;
  archive.ontoggle = () => {
    summary.textContent = `Diario de la plaza · Ronda ${available}`;
    summary.setAttribute(
      "aria-label",
      `${archive.open ? "Minimizar" : "Abrir"} diario de la plaza, ronda ${available}`,
    );
  };
  archive.ontoggle();
  archive.append(summary, card);
  root.append(archive);
  views.set(root, {
    game,
    round: game.round,
    completed,
    available,
    reportCount,
    choice,
    phase: game.phase,
    archive,
  });
  show(available - 1);
}
