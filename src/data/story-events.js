import { STORY_REFERENCES } from "./story-references.js";

export const STORY_EVENTS = {
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
        label: "Resolver ocupación · 40 provisiones",
        description:
          "Si hay una tienda afectada, paga 40 provisiones para que todas puedan atacar desde el inicio.",
        cost: 40,
      },
    ],
  },
  9: {
    ...STORY_REFERENCES[9],
    id: "rain",
    title: "La lona no era impermeable",
    summary:
      "Llueve toda la ronda: suelo mojado, resbalones de 6 de vida y dos rasos extra. Las cubiertas protegen la cadencia, no el suelo.",
    default: "endure",
    duration: 20,
    options: [
      {
        id: "endure",
        label: "Aguantar · gratis",
        description:
          "Las defensas disparan un 20 % más despacio durante los primeros 20 s. El olor y la producción no cambian.",
        cost: 0,
      },
      {
        id: "cover",
        label: "Cubrir casetas · 20 provisiones",
        description: "Conserva la cadencia habitual durante esta ronda.",
        cost: 20,
      },
    ],
  },
  15: {
    id: "october12",
    title: "12-O: la plaza se tensa",
    summary:
      "Inspirado en la jornada del 12 de octubre. Llegan refuerzos por varios accesos.",
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
        label: "Organizar accesos · 25 provisiones",
        description:
          "Los mismos refuerzos llegan 10 s más tarde, dando tiempo para despejar los primeros grupos.",
        cost: 25,
      },
    ],
  },
};
export function storyEventFor(game) {
  return game.mode === "defense" && !game.sandbox
    ? STORY_EVENTS[game.round]
    : null;
}
