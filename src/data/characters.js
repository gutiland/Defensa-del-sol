import { PLAZA_CAST } from "./plaza-cast.js";
// Political caricatures with original dialogue, not statements by their inspirations.
export const CHARACTERS = {
  micro: {
    name: "Vito del Micro",
    reference: "Vito Quiles",
    side: "attack",
    hair: "#302823",
    skin: "#cda58c",
    shirt: "#c7d5dd",
    beard: false,
    style: "quiff",
    lines: [
      "¡Asamblearios de los cojones, salid del plano!",
      "¡Mucho comité y poca puta vergüenza!",
      "¡Aparta, que me tapas el directo, pesado!",
    ],
  },
  viral: {
    name: "Al Visa",
    reference: "Alvise Pérez",
    side: "attack",
    hair: "#342c29",
    skin: "#c39c81",
    shirt: "#a69f8e",
    beard: true,
    style: "short",
    lines: [
      "¡Pancarteros de saldo, se os acaba el wifi!",
      "¡Vaya panda de comisarios de esterilla!",
      "¡Os sobra relato y os falta jabón para el ego!",
    ],
  },
  assembly: {
    name: "Pablo Asambleas",
    reference: "Pablo Iglesias",
    side: "defense",
    hair: "#3b302a",
    skin: "#caa48b",
    shirt: "#66566c",
    beard: true,
    style: "ponytail",
    lines: [
      "¡Facha de oferta, hasta tu bandera viene de China!",
      "¡Liberal de mis cojones, paga tú el megáfono!",
      "¡Cuñado, baja el brazo y sube el sueldo!",
    ],
  },
  reply: {
    name: "El del Último Zasca",
    reference: "Gabriel Rufián",
    side: "defense",
    hair: "#292827",
    skin: "#c19b81",
    shirt: "#929b9b",
    beard: true,
    style: "crop",
    lines: [
      "¡Patriota de sofá, que te lo monta el chófer!",
      "¡Privatiza la sombra y luego cobra suplemento!",
      "¡Mucho orden y ni respetas la cola, cuñado!",
    ],
  },
};
const extra = (name, side, style, accessory, shirt, lines, details = {}) => ({
  name,
  side,
  style,
  accessory,
  shirt,
  lines,
  reference: null,
  hair: "#38312a",
  skin: "#c5a187",
  beard: false,
  ...details,
});
Object.assign(CHARACTERS, {
  bossDani: extra(
    "Dani Desalojo",
    "attack",
    "bald",
    "muscles",
    "#303937",
    [
      "¡Mi lista de invitados no incluye sacos de dormir!",
      "¡Hasta el menú de pausa necesita derecho de admisión!",
    ],
    {
      reference: "Daniel Esteve (Dani Desokupa)",
      beard: true,
      faceWidth: 13,
      hair: "#4b3b2d",
    },
  ),
  bossPedro: extra(
    "Pedro del Cambio",
    "attack",
    "quiff",
    "tie",
    "#40659b",
    [
      "¡Mi plan definitivo admite prórrogas!",
      "¡Ese era el itinerario antes de la última reunión!",
    ],
    { reference: "Pedro Sánchez", faceWidth: 9, hair: "#77756a" },
  ),
  bossSanti: extra(
    "Santi de la Reconquista",
    "attack",
    "slick",
    "jacket",
    "#6c884b",
    [
      "¡Esta curva figuraba recta en mi programa!",
      "¡Exijo una frontera para cada rotonda!",
    ],
    {
      reference: "Santiago Abascal",
      beard: true,
      faceWidth: 12,
      hair: "#3a302a",
    },
  ),

  spokesperson: extra(
    "Lola de las Lonas",
    "defense",
    "bun",
    "megaphone",
    "#e87d45",
    [
      "¡La única caseta con alquiler congelado!",
      "¡La comisión de acogida necesita menos comisiones!",
    ],
    {
      reference: null,
      hair: "#686078",
      glasses: true,
      faceWidth: 10,
    },
  ),
  polo: extra(
    "Borja del Aval",
    "attack",
    "sidepart",
    "sweater",
    "#e5d5c0",
    [
      "¡La meritocracia empieza con tres pisos, pringados!",
      "¡Papi dice que esta plaza tiene potencial!",
    ],
    { faceWidth: 9 },
  ),
  gilet: extra(
    "Don Mercado",
    "attack",
    "balding",
    "briefcase",
    "#344b5c",
    [
      "¡Menos Estado! Salvo mi contrato público.",
      "¡La mano invisible os va a poner una multa!",
    ],
    { hair: "#8b8478", faceWidth: 12 },
  ),
  terrace: extra(
    "Manolo Terrazas",
    "attack",
    "bald",
    "sunglasses",
    "#c8b9a1",
    [
      "¡Esto con mi cuñado se arreglaba en dos tardes!",
      "¡A currar! Yo vigilo desde el bar.",
    ],
    { moustache: true, faceWidth: 13 },
  ),
  flag: extra(
    "Capitán Sobremesa",
    "attack",
    "slick",
    "flag",
    "#6f795e",
    [
      "¡La patria no se negocia! La factura sin IVA sí.",
      "¡Mucho derecho y poca mili de tertulia!",
    ],
    { moustache: true, faceWidth: 11 },
  ),
  dread: extra(
    "Rastas del Comité",
    "defense",
    "dreads",
    "scarf",
    "#827451",
    [
      "¡Cuñado, tu libertad lleva chófer!",
      "¡A mí no me manda nadie salvo las nueve comisiones!",
    ],
    { beard: true, faceWidth: 10 },
  ),
  tote: extra(
    "Eco de Asamblea",
    "defense",
    "bun",
    "tote",
    "#76836b",
    [
      "¡Tu patriotismo tiene más plástico que mi táper!",
      "¡Decrecimiento! Pero que no cierre mi cafetería.",
    ],
    { glasses: true, faceWidth: 9 },
  ),
  union: extra(
    "Paco Liberado",
    "defense",
    "balding",
    "vest",
    "#7b4942",
    [
      "¡Menos banderita y más pagar las horas, cabrón!",
      "¡Primero la clase obrera! Yo os represento sentado.",
    ],
    { moustache: true, faceWidth: 13, hair: "#97918a" },
  ),
  student: extra(
    "Máster en Pancartas",
    "defense",
    "undercut",
    "megaphone",
    "#45464f",
    [
      "¡Facha de saldo, tus argumentos vienen reenviados!",
      "¡No habrá paz hasta consensuar la tipografía!",
    ],
    { piercing: true, faceWidth: 9, hair: "#754c6b" },
  ),
});
CHARACTERS.saboteur = extra(
  "Inspector de Cremalleras",
  "attack",
  "balding",
  "briefcase",
  "#f0b647",
  [
    "¡Esta cremallera no cumple el reglamento!",
    "¡La lona necesita tres copias compulsadas!",
  ],
  { glasses: true, moustache: true, hair: "#66594d", faceWidth: 11 },
);
CHARACTERS.medic = {
  ...CHARACTERS.terrace,
  name: "Socorrista de tertulia",
  reference: "Personaje ficticio",
  shirt: "#3d997d",
  hair: "#d5ccb9",
  style: "short",
  beard: false,
  lines: [
    "¡Tengo receta para todo, menos para perder!",
    "¡La receta es seguir andando!",
  ],
};
CHARACTERS.berserker = {
  ...CHARACTERS.gilet,
  name: "Indignado profesional",
  reference: "Personaje ficticio",
  shirt: "#b13730",
  hair: "#221d1b",
  beard: true,
  style: "short",
  lines: [
    "¡Ahora sí que me habéis calentado!",
    "¡He venido con queja y sin paciencia!",
  ],
};
const wardrobe = {
  micro: "#74b9cb",
  viral: "#d94c42",
  assembly: "#9b77bc",
  reply: "#78b2a2",
  polo: "#eee0ab",
  gilet: "#5482a0",
  terrace: "#db9a60",
  flag: "#6b8286",
  dread: "#c5a15a",
  tote: "#9fc66c",
  union: "#c96d55",
  student: "#7775a6",
};
for (const [id, color] of Object.entries(wardrobe))
  CHARACTERS[id].shirt = color;
for (const [index, actor] of PLAZA_CAST.entries()) {
  const existing = CHARACTERS[actor.id];
  const model = existing || CHARACTERS[actor.template];
  CHARACTERS[actor.id] = {
    ...model,
    name: actor.name,
    side: actor.side,
    trait: actor.trait,
    signature: actor.signature,
    entrance: actor.entrance,
    storyRole: actor.role,
    chapter: actor.chapter,
    ...(!existing
      ? {
          reference: null,
          quotes: undefined,
          lines: [actor.entrance, actor.signature],
          faceWidth: 9 + (index % 4),
          hair: ["#3e3028", "#82735f", "#292a29", "#715b44"][index % 4],
          shirt: ["#657d71", "#ae754f", "#926783", "#6688a0", "#9e914f"][
            index % 5
          ],
        }
      : {}),
  };
}
Object.assign(CHARACTERS.wordkeeper, {
  style: "bun",
  hair: "#8a4935",
  shirt: "#a66077",
  accessory: "turnList",
});
Object.assign(CHARACTERS.hummus, {
  style: "balding",
  beard: true,
  glasses: false,
  hair: "#63503d",
  shirt: "#b5aa58",
  faceWidth: 13,
  accessory: "hummusBowl",
});
export const TENT_DEFENDERS = ["reply", "tote"];
const defenders = {
  area: ["student"],
  odor: ["dread"],
  speaker: ["assembly", "wordkeeper"],
  tent: TENT_DEFENDERS,
  kitchen: ["hummus"],
  barrier: ["union", "student"],
  base: ["spokesperson"],
};
export const attackerCharacter = (kind, variant = 0) =>
  ({
    basic: "polo",
    fast: "micro",
    heavy: "gilet",
    perfume: "terrace",
    armored: "flag",
    sprinter: "viral",
  })[kind] || kind;
export const defenderCharacter = (type, variant = 0) =>
  defenders[type][variant % defenders[type].length];
const tentResidents = new WeakMap();
export function buildingDefender(building) {
  if (building.id === "base") return defenderCharacter("base");
  if (building.type !== "tent")
    return defenderCharacter(building.type, building.id);
  if (!tentResidents.has(building))
    tentResidents.set(
      building,
      TENT_DEFENDERS[Math.floor(Math.random() * TENT_DEFENDERS.length)],
    );
  return tentResidents.get(building);
}

export function characterFlag(id) {
  return (
    { flag: "spain", polo: "spain", student: "palestine", union: "republic" }[
      id
    ] || null
  );
}
