export const BANNER_TEXTS = {
  attack: [
    "MI PAPI PAGA",
    "SOY MI JEFE*",
    "ERA IRONÍA",
    "TODO LEGAL*",
    "FUENTE: MI CUÑAO",
  ],
  defense: [
    "HOY NO FÍO",
    "MUCHO TEXTO",
    "HUMMUS O CAOS",
    "NO ME DA LA VIDA",
    "LO VOTAMOS?",
  ],
};
export function bannerText(side, seed = 0) {
  const options = BANNER_TEXTS[side] || BANNER_TEXTS.defense;
  return options[Math.abs(Math.trunc(seed) || 0) % options.length];
}
