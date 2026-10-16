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
