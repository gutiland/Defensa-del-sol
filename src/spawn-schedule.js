// Space departures per street, without preventing units from catching up later.
export function spaceSpawns(spawns, gap = 0.95) {
  const next = new Map();
  return spawns
    .map((s) => ({ ...s }))
    .sort((a, b) => a.at - b.at)
    .map((s) => {
      s.at = Math.max(s.at, next.get(s.entry) ?? s.at);
      next.set(s.entry, s.at + gap);
      return s;
    })
    .sort((a, b) => a.at - b.at);
}
