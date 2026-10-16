// Guidance follows the real game state; it never changes combat or prices.
export function tutorialStep(
  game,
  { placing = false, selected = null, usedAbility = false } = {},
) {
  if (
    !game ||
    game.mode !== "defense" ||
    game.sandbox ||
    game.result ||
    game.round > 5
  )
    return null;
  const lesson = (icon, title, text, target) => ({
    icon,
    title,
    text,
    target,
    round: game.round,
  });
  if (game.phase === "combat") {
    if (game.round === 5)
      return lesson(
        "★",
        "Examen: el primer jefe",
        "Combina casetas y mejoras. Usa la Asamblea cuando se acerque a la base; puedes construir durante el combate.",
        "#ability",
      );
    if (!usedAbility && game.units.length >= 3)
      return lesson(
        "✋",
        "Frena la oleada",
        "Pulsa la mano o Q: la Asamblea detiene a todos durante 3 segundos. Después necesita 25 segundos de recarga.",
        "#ability",
      );
    return lesson(
      "▶",
      "Tus casetas disparan solas",
      "Protege la caseta central. Cada baja da provisiones; puedes seguir construyendo y mejorando. Espacio pausa y 1× cambia la velocidad.",
      "#pause",
    );
  }
  if (game.round === 1) {
    if (!game.buildings.length)
      return placing
        ? lesson(
            "⛺",
            "Coloca tu primera caseta",
            "Pulsa una zona libre junto al camino: verde permite construir y rojo indica un obstáculo. Los enemigos siguen las rutas hasta la base.",
            "#board",
          )
        : lesson(
            "⛺",
            "Elige una defensa",
            "Selecciona una caseta de proyectiles en el catálogo. Cuesta provisiones: consulta tu caja arriba. El objetivo es que la base sobreviva.",
            "#shop",
          );
    return lesson(
      "▶",
      "Prepara la primera ronda",
      "Puedes añadir otra caseta. Si te equivocas, ↶ deshace la última colocación antes de empezar. Cuando estés listo, pulsa «Que empiece la crispación».",
      "#action",
    );
  }
  if (game.round === 2 && !game.buildings.some((b) => b.level > 1))
    return lesson(
      "↑",
      "Mejora una caseta",
      selected !== null
        ? "Pulsa ↑ en el panel de la caseta. El número indica el coste; una mejora aumenta su potencia. Las dos especialidades son alternativas permanentes."
        : "Pulsa una caseta construida para abrir sus mejoras. También puedes mejorar la base. Reserva provisiones para ampliar el campamento.",
      selected !== null ? "#selection" : "#board",
    );
  if (game.round === 3 && !game.buildings.some((b) => b.type === "speaker"))
    return lesson(
      "📣",
      "Combina funciones",
      "La radio ralentiza en área: colócala donde cubra un tramo largo. Las casetas de proyectiles dañan y el Comité de Lanzamiento golpea grupos. Mira sus alcances al seleccionarlas.",
      "#shop",
    );
  if (game.round === 4)
    return lesson(
      "🪧",
      "Caminos y decisiones",
      "Las barricadas van SOBRE el camino: bloquean, pero no atacan. Las demás casetas van fuera. Lee el evento del diario y elige teniendo en cuenta tus provisiones.",
      "#story-chapter",
    );
  if (game.round === 5)
    return lesson(
      "★",
      "Prepara al campamento",
      "Llega el primer jefe. Mejora tus defensas y cubre el tramo final. Casetas y mejoras se conservan al pasar al nivel 2, donde sube la dificultad.",
      "#shop",
    );
  return lesson(
    "✓",
    "Listo para continuar",
    "Amplía el campamento cerca del recorrido y consulta el diario. Las defensas apuntan al enemigo más avanzado que tengan a alcance. Inicia la ronda cuando estés listo.",
    "#action",
  );
}
