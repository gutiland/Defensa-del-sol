let notice = null;
export function showFeedback(game, text, now = performance.now()) {
  notice = { game, text, until: now + 3500 };
}
export function clearFeedback(game) {
  if (notice?.game === game) notice = null;
}
export function currentFeedback(game, now = performance.now()) {
  return notice?.game === game && notice.until > now ? notice.text : null;
}
