// Permanent, mutually exclusive specializations; ordinary weapon levels remain available.
export const BRANCHES = {
  tent: {
    rapid: ["Cadencia", "Reduce el intervalo entre disparos un 35 %", 55],
    power: [
      "Contundencia",
      "+55 % daño, ignora armadura y potencia el fuego",
      65,
    ],
  },
  area: {
    rapid: ["Bombardeo", "Reduce el intervalo entre disparos un 30 %", 65],
    power: ["Gran salpicadura", "Radio 95 y +25 % daño", 70],
  },
  speaker: {
    rapid: ["Coro", "La ralentización en área dura 3 s en vez de 1,5 s", 60],
    power: ["Abucheo", "+90 % daño y +30 alcance", 45],
  },
  odor: {
    rapid: ["Difusión", "+45 radio de olor", 50],
    power: ["Concentrado", "+2 de daño por segundo de olor", 55],
  },
  kitchen: {
    rapid: ["Comedor", "+15 provisiones al terminar cada ronda", 50],
    power: ["Catering", "Produce 2 provisiones cada 5 s de combate", 65],
  },
  barrier: {
    rapid: ["Refuerzo", "+240 resistencia máxima", 40],
    power: [
      "Autorreparación",
      "Recupera 12 de vida/s tras 2 s sin recibir golpes",
      50,
    ],
  },
};
export const canDefend = (game) =>
  !game.result &&
  (game.phase === "build" ||
    (game.mode === "defense" && game.phase === "combat"));
export const ROUND_PROVISIONS = 45;
export const bountyFor = (unit) =>
  unit.scale
    ? 35
    : {
        basic: 3,
        fast: 4,
        heavy: 8,
        perfume: 5,
        armored: 7,
        sprinter: 4,
        medic: 6,
        saboteur: 6,
        berserker: 8,
      }[unit.kind] || 3;
export const totalRounds = (game) => (game?.mode === "defense" ? 20 : 8);
