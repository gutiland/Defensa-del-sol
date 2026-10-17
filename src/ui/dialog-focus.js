// Opening a reused dialog must never inherit a previous scroll position.
export function focusDialogStart(dialog, heading) {
  heading?.setAttribute?.("tabindex", "-1");
  heading?.focus?.({ preventScroll: true });
  dialog.scrollTop = 0;
  dialog.scrollLeft = 0;
}
