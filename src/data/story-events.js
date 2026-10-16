import { STORY_REFERENCES } from "./story-references.js";

export const STORY_EVENTS = {
  17: {
    ...STORY_REFERENCES[17],
    id: "station-closure",
    title: "Metro de Sol: cierre temporal",
    summary:
      "Se cierra temporalmente el acceso al Metro de Sol, no Cercanías. En esta ronda ficticia, todos los atacantes entran por Preciados. Puedes regular el acceso para retrasar su llegada 12 segundos.",
    default: "detour",
    wholeRound: true,
    scene: {
      title: "Metro de Sol cerrado: toca dar la vuelta",
      lines: [
        {
          character: "micro",
          name: "El del Plano Corto",
          text: "¡El Metro de Sol está cerrado! La tertulia pasa a circular en superficie.",
        },
        {
          character: "spokesperson",
          name: "El campamento",
          text: "Por favor, dejen salir antes de abrir otro turno de palabra.",
        },
      ],
    },
    options: [
      {
        id: "detour",
        label: "Asumir desvíos · gratis",
        description:
          "Todos los atacantes llegan por Preciados. Se mantienen su cantidad y la separación mínima entre salidas.",
        cost: 0,
      },
      {
        id: "signpost",
        label: "Regular el acceso · 180 provisiones",
        description:
          "Todos siguen entrando por Preciados, pero llegan 12 segundos más tarde. No cambia su cantidad, vida, daño ni velocidad.",
        cost: 180,
      },
    ],
  },
  4: {
    id: "tent-dispute",
    title: "Esta tienda está ocupada",
    summary:
      "Una visitante reclama una tienda del campamento. Decide cómo resolver la discusión.",
    default: "debate",
    wholeRound: true,
    ...STORY_REFERENCES[4],
    scene: {
      title: "La tienda tiene visita",
      lines: [
        {
          character: "tote",
          name: "La visitante",
          text: "He dejado la bolsa dentro. Ahora esta tienda tiene arraigo.",
        },
        {
          character: "spokesperson",
          name: "El campamento",
          text: "Pues vamos a tener que reunir a la comisión de cremalleras.",
        },
      ],
    },
    options: [
      {
        id: "debate",
        label: "Debatir · gratis",
        description:
          "Una tienda del proletariado no dispara durante toda esta ronda. Se recupera al terminar.",
        cost: 0,
      },
      {
        id: "mediate",
        label: "Resolver ocupación · 80 provisiones",
        description:
          "Si hay una tienda afectada, paga 80 provisiones para que todas puedan atacar desde el inicio.",
        cost: 80,
      },
    ],
  },
  9: {
    ...STORY_REFERENCES[9],
    id: "rain",
    title: "La lona no era impermeable",
    summary:
      "Llueve toda la ronda: olor con un 50 % menos de daño, molotov e incendios con un 40 % menos, resbalones de 6 de vida y dos rasos extra. Las cubiertas solo protegen la cadencia.",
    default: "endure",
    duration: 20,
    options: [
      {
        id: "endure",
        label: "Aguantar · gratis",
        description:
          "Las defensas disparan un 20 % más despacio durante los primeros 20 s. La producción no cambia. Olor y molotov pierden daño toda la ronda.",
        cost: 0,
      },
      {
        id: "cover",
        label: "Cubrir casetas · 100 provisiones",
        description: "Conserva la cadencia habitual. La lluvia sigue reduciendo el daño de olor y molotov durante toda la ronda.",
        cost: 100,
      },
    ],
  },
  15: {
    id: "october12",
    title: "12-O: la plaza se tensa",
    summary:
      "Episodio ficticio inspirado en la tensión del 12 de octubre. Llegan refuerzos por varios accesos; no representa actuaciones de personas concretas.",
    default: "hold",
    duration: 0,
    ...STORY_REFERENCES[15],
    scene: {
      title: "12-O: tensión en la plaza",
      lines: [
        {
          character: "micro",
          name: "El del Plano Corto",
          text: "Hay gente llegando por varias calles. Esto ya tiene plano general.",
        },
        {
          character: "spokesperson",
          name: "El campamento",
          text: "Menos corrillo y más repartir la defensa. Que nadie deje un acceso sin cubrir.",
        },
      ],
    },
    options: [
      {
        id: "hold",
        label: "Cerrar filas · gratis",
        description:
          "Refuerzos adicionales: un 25 % más de atacantes normales repartidos por los accesos.",
        cost: 0,
      },
      {
        id: "organize",
        label: "Organizar accesos · 150 provisiones",
        description:
          "Los mismos refuerzos llegan 10 s más tarde, dando tiempo para despejar los primeros grupos.",
        cost: 150,
      },
    ],
  },
};
export function storyEventFor(game) {
  return game.mode === "defense" && (!game.sandbox || game.campaignTest)
    ? STORY_EVENTS[game.round]
    : null;
}
