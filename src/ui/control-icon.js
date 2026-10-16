// Keep the control node stable so updates preserve focus and hover.
export function controlIcon(button, symbol, label) {
  button.textContent = symbol;
  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
  button.setAttribute("data-icon-control", "true");
}
