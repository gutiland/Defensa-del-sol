// Story chapters author the enemy progression without random stat changes.
import { STORY_CHAPTERS } from "./story.js";
import { campaignLevel } from "./campaign.js";
const chapters = [
  [
    "La primera noche",
    "La plaza monta el campamento. Llega el primer grupo de rasos.",
  ],
  [
    "Conexión en directo",
    "Los agitadores retransmiten y aceleran a sus compañeros.",
  ],
  [
    "La línea de pancartas",
    "Llegan pancartistas resistentes. Prepara impactos fuertes.",
  ],
  [
    "Visita de etiqueta",
    "Los perfumados son inmunes al daño del olor. Necesitas otras defensas.",
  ],
  ["El desalojo", "El Portero encabeza la ofensiva y acelera a su escolta."],
  [
    "Escudos en la curva",
    "Llegan blindados: pintura y fuego atraviesan su armadura.",
  ],
  [
    "La carrera del titular",
    "Los Ultrasprint buscan un hueco. Cubre el tramo final.",
  ],
  [
    "Servicio de urgencias",
    "El Socorrista de tertulia regenera su propia vida. Concentra disparos.",
  ],
  [
    "Noche de relevos",
    "Los grupos se mezclan por más accesos. La plaza aguanta otra noche.",
  ],
  [
    "Cambio de planes",
    "El cerco se estrecha. Prepara el campamento para el jefe de este nivel.",
  ],
  [
    "La resaca",
    "El campamento sigue en pie, pero los refuerzos conocen sus curvas.",
  ],
  [
    "Se acabó la paciencia",
    "El Indignado profesional corre y golpea más por debajo de media vida.",
  ],
  [
    "El cerco",
    "Corredores y resistentes se cubren. No dependas de una sola caseta.",
  ],
  [
    "Último aviso",
    "Los accesos se llenan. Refuerza la confluencia de caminos.",
  ],
  [
    "La reconquista",
    "Las escoltas vuelven con más refuerzos. Mantén cobertura en varios ramales.",
  ],
  [
    "La plaza no duerme",
    "Los seguidores vuelven por todas las calles tras los tres asaltos.",
  ],
  [
    "Cadena de mensajes",
    "La agitación acelera grupos mayores. Combina daño y control.",
  ],
  [
    "El penúltimo consenso",
    "Socorristas e indignados presionan juntos. Hace falta daño sostenido.",
  ],
  [
    "Antes de la cumbre",
    "La plaza espera el asalto final. Invierte las últimas provisiones.",
  ],
  [
    "La cumbre de los egos",
    "El Prorrogador llega como jefe final. Alterna protección y carrera: supera sus ventanas para ganar.",
  ],
];
const unlocks = [
  [1, "basic"],
  [2, "fast"],
  [3, "heavy"],
  [4, "perfume"],
  [6, "armored"],
  [7, "sprinter"],
  [8, "medic"],
  [12, "berserker"],
];
export const WAVES = chapters.map(([name, story], index) => {
  const round = index + 1;
  const roster = unlocks.filter(([at]) => at <= round).map(([, kind]) => kind);
  return {
    name: STORY_CHAPTERS[index].title,
    story: STORY_CHAPTERS[index].scene,
    hint: story,
    boss: round === campaignLevel(round).last,
    groups: roster.map((kind, i) => [
      kind,
      Math.ceil(
        (kind === "basic" ? 9 + index : 3 + Math.floor(index / 3)) *
          (1 + (campaignLevel(round).number - 1) * 0.15),
      ),
      (i * 3 + index * 2) % 11,
      i * 3.2,
      kind === "heavy" || kind === "armored"
        ? 1.25
        : Math.max(0.8, 1.05 - index * 0.01),
    ]),
  };
});
export function normalWave(round, entries) {
  const wave = WAVES[Math.min(round - 1, WAVES.length - 1)];
  const order = round === 1 ? [0, 1] : [0, 2, 5, 7, 4, 1, 6, 9, 8, 3, 10];
  const accesses = [
    ...new Set(
      order
        .slice(0, Math.min(entries, round + 1))
        .map((entry) => entry % entries),
    ),
  ];
  return wave.groups
    .flatMap(([kind, count, entry, at, spacing]) =>
      Array.from({ length: count }, (_, i) => ({
        kind,
        entry: accesses[(i + entry) % accesses.length],
        at: at + i * spacing,
      })),
    )
    .sort((a, b) => a.at - b.at);
}
