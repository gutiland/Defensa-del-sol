// Original satire. News references and editorial notes live in docs/satire.md.
export const COPY = {
  modes: {
    defense: "PIOJOSOS · COMITÉ DE RESISTENCIA",
    attack: "FACHAS · JUNTA DE RECONQUISTA",
    local: "DOS ESPAÑAS · UN SOLO RATÓN",
  },
  phase: {
    combat: "España se rompe. El alquiler, no.",
    attack: "Organiza la indignación de bien",
    build: "Okupa espacio. Convoca otra comisión.",
  },
  shop: { build: "URBANISMO ASAMBLEARIO", attack: "BOLSA DE PATRIOTAS" },
  mealLines: [
    "¡A comer! Reparto horizontal; yo pruebo primero.",
    "¡Táper para todos! La austeridad se sirve sin pan.",
    "¡Se abre el comedor! La dieta del diputado va aparte.",
    "¡A la mesa! El recorte hoy se lo lleva la tortilla.",
  ],
  buildingSummary: {
    tent: "🎯 Daño individual",
    area: "💥 Daño en área",
    speaker: "🐌 Ralentiza en área",
    odor: "☁ Daño continuo",
    kitchen: "🍲 +15/nivel/ronda",
    barrier: "🛡 Bloquea el camino",
  },
  buildingHelp: {
    tent: "Ataca a un enemigo. Mejora de piedras a botellas y molotov con fuego en el suelo.",
    area: "Daño en área: bolas de pintura → botes → petardos → granadas. Ideal contra grupos.",
    speaker:
      "Ralentiza en área y hace algo de daño. Da más tiempo para disparar a las otras casetas.",
    odor: "Daña continuamente en su nube. No ralentiza; no se acumula y los perfumados son inmunes.",
    kitchen:
      "Genera 15 provisiones por nivel al terminar cada ronda. No ataca.",
    barrier: "Va sobre el camino y bloquea hasta que la destruyen. No ataca.",
  },
  buildingDetails: {
    tent: "Piedras → botellas → molotov. Prioriza al más avanzado.",
    area: "Bolas → botes → petardos → granadas. Golpea grupos.",
    speaker: "−55 % velocidad durante 1,5 s. Apoya a las otras casetas.",
    odor: "No frena ni se acumula. Perfumados inmunes.",
    kitchen: "No ataca. Cobra al acabar la ronda; mejora para ganar más.",
    barrier: "Sobre el camino. No ataca; retiene hasta que la rompen.",
  },
  help: {
    combat:
      "Combate automático: hoy los piojosos curran y los fachas avanzan sin chófer. Espera al final de la oleada.",
    attack:
      "Marca una o varias calles y pulsa unidades para reclutar. Cada nuevo recluta se reparte por turnos entre las calles marcadas. Cambiar calles no mueve los ya reclutados: hasta la patria necesita logística.",
    build:
      "Elige una construcción y pulsa un hueco libre. Mejorar una tienda exige pulsarla: por una vez, la comisión sirve para algo.",
  },
  action: {
    combat: "Negociando a cartonazos…",
    handoff: "Pasar el marrón a la derecha →",
    attack: "Sacar la España de paseo →",
    build: "Que empiece la crispación →",
  },
  status: {
    attack: "Marca varias calles: la patria no cabe en un carril",
    build: "Construye libremente: el PGOU está en asamblea",
  },
  undo: "Rectificar sin dimitir",
  queue: (n) => `${n} patriotas fichados. La paguita ahora se llama incentivo.`,
  live: (units, pending) =>
    `${units} dando la chapa · ${pending} esperando su minuto de odio`,
  selection: (name, level, hp, max) =>
    `${name} · Cargo nivel ${level} · Aguante ${hp}/${max}. Más estructura que autocrítica.`,
  upgrade: (cost) => `Crear otro cargo · ${cost} ◈`,
  noMoney:
    "No hay provisiones. Ni la paguita ni la bajada de impuestos han llegado.",
  placement: {
    invalid: "Ni el catastro entiende esa posición.",
    outside: "Dentro de la plaza: el resto ya lo tiene un fondo.",
    landmark:
      "Deja libre el monumento y el acceso: hasta el postureo necesita sitio.",
    overlap:
      "Demasiado cerca. Ni la comuna comparte tanto ni el mercado lo regula todo.",
  },
  result: {
    attackTitle: "¡Reconquista con gastos de gestión!",
    defenseTitle: "¡Resiste la república de las lonas!",
    attackLossTitle: "Mucho «a por ellos». Poco llegar.",
    defenseLossTitle: "La asamblea pierde el suelo.",
    attackLoss:
      "Ocho rondas y ni una tienda desalojada. El cuñado culpa al Gobierno; tú prueba otros accesos y unidades.",
    defenseLoss:
      "Cayó la tienda central. La comisión de autocrítica propone una comisión. Refuerza el campamento en la próxima partida.",
    attack: (round) =>
      `Victoria atacante en la ronda ${round}. El de la bandera exige orden y deja el cartón tirado. Libertad para él; fianza para el siguiente.`,
    defense: (round) =>
      `Victoria defensora en la ronda ${round}. El anticapitalista abre una comisión de donaciones y se reserva la tienda con mejores vistas.`,
  },
  buildings: {
    tent: {
      name: "Chalet del proletariado",
      desc: "Cuatro niveles: piedras, piedras grandes, botellas y molotov con fuego en el suelo. Contra la propiedad privada, salvo esta primera residencia.",
    },
    speaker: {
      name: "Radio Asamblea Libre",
      desc: "Ralentiza un 55 % durante 1,5 s a todos en radio 150 y causa 2 de daño por nivel. Odia los monopolios; lleva seis horas monopolizando el micro.",
    },
    kitchen: {
      name: "Ministerio del táper",
      desc: "+15 provisiones por nivel y ronda. Reparto horizontal; el portavoz repite por responsabilidad institucional.",
    },
    barrier: {
      name: "Línea roja de quita y pon",
      desc: "Bloquea el camino hasta que la destruyen. No ataca: su única ofensiva es poner límites.",
    },
  },
  units: {
    basic: {
      name: "Cuñado de orden",
      desc: "70 de aguante · velocidad 44. Pide mano dura desde una silla plegable. Primero España; aparcar en doble fila, también.",
    },
    fast: {
      name: "Patriota de fibra óptica",
      desc: "46 de aguante · velocidad 92. Su directo acelera un 25 % a aliados cercanos, salvo otros agitadores. Reenvía antes de leer.",
    },
    heavy: {
      name: "Liberal de ventanilla",
      desc: "175 de aguante · velocidad 27. Quiere un Estado mínimo con una subvención máxima. La paguita del otro sí le molesta.",
    },
  },
  headlines: [
    [
      "La asamblea pide vivienda digna. El portavoz quiere despacho.",
      "El patriota pide fronteras. Su patrimonio prefiere no tenerlas.",
    ],
    [
      "El piojoso combate el rentismo y subalquila la esterilla.",
      "El facha defiende la familia: dos avalistas y tres nóminas.",
    ],
    [
      "Comisión urgente de vivienda: falta acordar quién levanta acta.",
      "Solución del cuñado: más oferta. De tertulianos ya vamos sobrados.",
    ],
    [
      "Revolución horizontal; el megáfono siempre lo lleva el mismo.",
      "Libertad de mercado hasta que el bar cambia de dueño.",
    ],
  ],
};

export function applyStaticCopy(document) {
  const entries = {
    ".brand small": "Dos Españas. La misma fianza.",
    "#restart": "Repetir elecciones",
    "#intro .eyebrow": "CRISPACIÓN CON PRESUPUESTO LIMITADO",
    "#intro h1": "La calle es de todos. El alquiler, de cuatro.",
    "#intro > p":
      "Piojosos con comité de bienvenida. Fachas con comité de expulsión. Construye, recluta y demuestra que tu bando administra el desastre mejor.",
    '[data-mode="defense"] b': "⛺ Piojoso con hipoteca moral",
    '[data-mode="defense"] span':
      "Historia: defiende veinte oleadas. Abajo el sistema; arriba el doble techo de la tienda.",
    '[data-mode="attack"] b': "🚩 Facha de fin de semana",
    '[data-mode="attack"] span':
      "Recluta y elige calle. Recupera la plaza antes de que empiece la tertulia.",
    '[data-mode="local"] b': "🤝 Pacto de inconvivencia",
    '[data-mode="local"] span':
      "Dos jugadores por turnos. Uno monta el chiringuito; el otro quiere heredarlo.",
    "#intro .note":
      "Individual y duelo local disponibles. Las salas online siguen en promesa electoral.",
    "#phaseTitle": "Reparto de suelo y de culpas",
    ".map-caption > span:first-child":
      "PUERTA DEL SOL · SUELO PÚBLICO, EGO PRIVADO",
    "#status": COPY.status.build,
    "#shopLabel": COPY.shop.build,
    "#ordersTitle": "Tu turno de salvar España",
    "aside > .note":
      "Movimiento y combate automáticos: trabajan sin convocar asamblea ni pedir un asesor. Tú decides qué construir y desplegar.",
    "#result > .eyebrow": "ESCRUTINIO SIN AUTÓCRITICA",
    "#again": "Repetir hasta que salga lo mío",
  };
  for (const [selector, text] of Object.entries(entries)) {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
  }
  const labels = ["LEGISLATURA", "DINERO NEGRO", "EL ATICO"];
  document.querySelectorAll(".stats > span").forEach((element, i) => {
    element.firstChild.textContent = labels[i] + " ";
  });
}
