export function readStorage(key, maxLength = 512000) {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    return typeof raw === "string" && raw.length <= maxLength
      ? JSON.parse(raw)
      : null;
  } catch {
    return null;
  }
}
export function writeStorage(key, value) {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
    return !!globalThis.localStorage;
  } catch {
    return false;
  }
}
const saved = readStorage("sol-preferences-v1", 2048) || {};
export const preferences = {
  flashes: saved.flashes !== false,
  reducedMotion:
    typeof saved.reducedMotion === "boolean"
      ? saved.reducedMotion
      : !!globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  quality: saved.quality === "low" ? "low" : "auto",
  effectsVolume: Number.isFinite(saved.effectsVolume)
    ? Math.max(0, Math.min(1, saved.effectsVolume))
    : 1,
  ambientVolume: Number.isFinite(saved.ambientVolume)
    ? Math.max(0, Math.min(1, saved.ambientVolume))
    : 0.5,
};
export function mountExperienceSettings(document) {
  const root = document.querySelector?.(".board-toolbar");
  if (!root) return;
  const details = document.createElement("details"),
    summary = document.createElement("summary");
  details.className = "experience-settings";
  summary.textContent = "Imagen y mezcla";
  details.append(summary);
  for (const [key, title] of [
    ["flashes", "Destellos de impacto"],
    ["reducedMotion", "Movimiento reducido"],
    ["quality", "Efectos ligeros"],
    ["effectsVolume", "Efectos"],
    ["ambientVolume", "Ambiente"],
  ]) {
    const label = document.createElement("label"),
      input = document.createElement("input");
    label.textContent = title;
    const range = key.endsWith("Volume");
    input.type = range ? "range" : "checkbox";
    if (range) {
      input.min = "0";
      input.max = "100";
      input.value = String(preferences[key] * 100);
    } else
      input.checked =
        key === "quality" ? preferences.quality === "low" : preferences[key];
    input.setAttribute("aria-label", title);
    input.oninput = () => {
      preferences[key] = range
        ? Number(input.value) / 100
        : key === "quality"
          ? input.checked
            ? "low"
            : "auto"
          : input.checked;
      writeStorage("sol-preferences-v1", preferences);
    };
    label.append(input);
    details.append(label);
  }
  root.append(details);
}
