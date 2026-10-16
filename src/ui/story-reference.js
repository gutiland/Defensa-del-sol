import { STORY_REFERENCES } from "../data/story-references.js";

export function appendStoryReference(document, root, round) {
  root.replaceChildren();
  root.className = "story-reference";
  const reference = STORY_REFERENCES[round];
  root.hidden = !reference;
  if (!reference) return;
  const link = document.createElement("a");
  link.textContent = `Contexto periodístico · ${reference.label}`;
  link.href = reference.source;
  link.title = reference.context;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  root.append(link);
  const note = document.createElement("small");
  note.textContent = ` ${reference.context} Las acciones y los diálogos de esta escena son inventados.`;
  root.append(note);
}
