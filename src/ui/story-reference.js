import { STORY_REFERENCES } from "../data/story-references.js";

export function appendStoryReference(document, root, round) {
  root.replaceChildren();
  const reference = STORY_REFERENCES[round];
  root.hidden = !reference;
  if (!reference) return;
  const link = document.createElement("a");
  link.textContent = `Noticia de referencia · ${reference.label}`;
  link.href = reference.source;
  link.title = reference.context;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  root.append(link);
}
