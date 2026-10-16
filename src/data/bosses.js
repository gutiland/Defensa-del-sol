// Ordinary boss rounds. The temporary test button can trigger one separately.
import { PLAZA_CAST } from "./plaza-cast.js";
export const BOSS_ROUNDS = [5, 12, 20];
export const BOSS_IDS = ["bossDani", "bossPedro", "bossSanti"];
export const BOSSES = {
  bossDani: {
    name: "Dani Desalojo · JEFE",
    character: "bossDani",
    cost: 210,
    hp: 624,
    speed: 30,
    damage: 35,
    icon: "★",
    role: "heavy",
    scale: 1.65,
    desc: "624 de aguante. Acelera a su escolta un 30 % en radio 150; al bajar de media vida, un 45 %. Mucho gimnasio; ningún consenso.",
  },
  bossPedro: {
    name: "Pedro del Cambio · JEFE",
    character: "bossPedro",
    cost: 200,
    hp: 468,
    speed: 45,
    damage: 26,
    icon: "★",
    role: "basic",
    scale: 1.5,
    desc: "468 de aguante. Alterna 4 s de protección del 65 % y 4 s de carrera. Promete ir despacio y cambia de ritmo.",
  },
  bossSanti: {
    name: "Santi de la Reconquista · JEFE",
    character: "bossSanti",
    cost: 200,
    hp: 552,
    speed: 36,
    damage: 30,
    icon: "★",
    role: "heavy",
    scale: 1.6,
    desc: "552 de aguante y armadura 8. Al bajar de media vida corre un 20 % más. Área, fuego y Contundencia ignoran su armadura.",
  },
};
for (const [id, boss] of Object.entries(BOSSES))
  boss.name = `${PLAZA_CAST.find((actor) => actor.id === id).name} · JEFE`;
export function bossWave(round, entries) {
  const bossIndex = { 5: 0, 12: 2, 20: 1 }[round];
  return (bossIndex === undefined ? BOSS_IDS : [BOSS_IDS[bossIndex]]).map(
    (kind, i) => ({
      kind,
      entry: (i * 3) % entries,
      at: i * 7,
    }),
  );
}
