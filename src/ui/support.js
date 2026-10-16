import { SUPPORT } from "../data/support.js";

export function supportUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === "buy.stripe.com" &&
      !url.port &&
      !url.username &&
      !url.password &&
      /^\/[A-Za-z0-9_]+$/.test(url.pathname) &&
      !url.search &&
      !url.hash
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function mountSupport(document, configuration = SUPPORT) {
  const url = supportUrl(configuration.url);
  for (const id of ["intro-support", "result-support"]) {
    const root = document.getElementById(id);
    if (!root) continue;
    root.replaceChildren();
    const action = document.createElement(url ? "a" : "button"),
      description = document.createElement("small");
    action.className = "support-button";
    action.textContent = configuration.label;
    if (url) {
      action.href = url;
      action.target = "_blank";
      action.rel = "noopener noreferrer";
      action.setAttribute(
        "aria-label",
        `${configuration.label} · aportación voluntaria mediante Stripe en otra pestaña`,
      );
      description.textContent =
        "¿Te ha gustado Acampada Sol? Tu aportación ayuda a seguir desarrollando este juego y a crear más juegos y productos como este, incluidos proyectos de mayor alcance. Aportar es opcional: puedes seguir jugando gratis.";
    } else {
      action.type = "button";
      action.disabled = true;
      description.textContent =
        "El apoyo económico todavía no está disponible.";
    }
    root.append(action, description);
  }
}
