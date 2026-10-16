import { COPY } from "./copy.js";
import { BUILDINGS } from "./catalog.js";

export function tutorialStep(game, state = {}, seen = new Set()) {
  if (
    !game ||
    game.mode !== "defense" ||
    game.sandbox ||
    game.result ||
    game.round > 5
  )
    return null;
  const { placing, kind, selected } = state;
  const step = (id, title, text, target) =>
    seen.has(id) ? null : { id, title, text, target };
  if (game.round === 1 && !seen.has("defenses"))
    return step(
      "defenses",
      "Estas son tus defensas",
      "Elige una caseta aquí y colócala fuera del camino, cerca de donde pasan los enemigos. Solo la barricada va sobre el camino.",
      "#shop",
    );
  if (placing && BUILDINGS[kind])
    return step(
      `place-${kind}`,
      BUILDINGS[kind].name,
      `${COPY.buildingHelp[kind]} ${kind === "barrier" ? "Toca un punto del camino para colocarla." : "Toca un hueco libre FUERA del camino. Verde permite colocar; rojo indica un obstáculo."}`,
      "#board",
    );
  if (selected !== null && selected !== undefined && game.phase === "build")
    return step(
      "upgrade",
      "Aquí mejoras tu caseta",
      "↑ compra el siguiente nivel. El número indica el coste en provisiones. Las otras dos mejoras son especialidades: elige solo una. ⓘ explica sus efectos.",
      "#selection",
    );
  if (game.phase === "combat") {
    if (game.units.length >= 3 && !seen.has("ability"))
      return step(
        "ability",
        "Detén a los atacantes",
        "Pulsa la mano o Q para detenerlos durante 3 segundos. La Asamblea tarda 25 segundos en recargarse: úsala cerca de tus defensas.",
        "#ability",
      );
    return step(
      "combat",
      "Disparan automáticamente",
      "No tienes que apuntar. Tus casetas atacan al enemigo más avanzado dentro de su alcance. Ⅱ pausa para pensar y 1× cambia la velocidad.",
      "#pause",
    );
  }
  if (game.round === 1 && game.buildings.length)
    return step(
      "start",
      "Empieza cuando estés listo",
      "Este botón inicia la oleada. Antes puedes poner más casetas o deshacer la última con ↶. Cada baja y ronda superada da provisiones para ampliar el campamento.",
      "#action",
    );
  if (game.round === 2)
    return step(
      "resources",
      "Vigila estos contadores",
      "Aquí ves el nivel y la ronda, las provisiones para construir y la vida de la base. Si la base llega a cero, pierdes. Toca tus casetas para mejorarlas.",
      ".stats",
    );
  if (game.round === 3)
    return step(
      "roles",
      "Combina defensas",
      "Radio ralentiza; Lanzamiento golpea grupos; Eau daña sin ralentizar. La cocina no dispara: genera provisiones al final de cada ronda. Su función aparece en cada tarjeta.",
      "#shop",
    );
  if (game.round === 4)
    return step(
      "diary",
      "El diario explica los eventos",
      "Ábrelo para ver lo que pasa en esta ronda. Los eventos pueden cambiar el combate y ofrecer decisiones que cuestan provisiones.",
      "#story-chapter",
    );
  if (game.round === 5)
    return step(
      "boss",
      "Llega el primer jefe",
      "Prepara casetas y mejoras antes de iniciar. Usa la Asamblea para retenerlo bajo el fuego. Si ganas, conservas el campamento en el siguiente nivel.",
      "#action",
    );
  return null;
}
