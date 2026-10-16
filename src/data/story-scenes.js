const camp = (text) => ({
  character: "spokesperson",
  name: "El campamento",
  text,
});
const boss = (character, name, text) => ({ character, name, text });
// Original dialogue for fictional caricatures, never presented as real quotations.
export const STORY_SCENES = {
  5: {
    title: "Derecho de admisión",
    lines: [
      boss(
        "bossDani",
        "El Portero",
        "¡Mi lista de invitados no incluye sacos de dormir!",
      ),
      camp(
        "¡La plaza no se vende! ¡Primero tendrás que pasar por la asamblea!",
      ),
    ],
  },
  9: {
    title: "Lluvia de opiniones",
    lines: [
      {
        character: "dread",
        name: "Comisión de meteorología",
        text: "¡Llueve! ¡Salvad las pancartas y el hummus!",
      },
      {
        character: "union",
        name: "Comisión de respuesta",
        text: "¡Se abre un turno para decidir quién sujeta la lona!",
      },
    ],
  },
  12: {
    title: "La reconquista de la curva",
    lines: [
      boss(
        "bossSanti",
        "El Capitán del Enfado",
        "¡Vengo a reconquistar la plaza, curva por curva!",
      ),
      camp("¡Pues coge número, que la comisión del plano aún no ha terminado!"),
    ],
  },
  20: {
    title: "Cambio de planes",
    lines: [
      boss(
        "bossPedro",
        "El Prorrogador",
        "Traía un plan para esta plaza. Ahora traigo otro.",
      ),
      camp("¡Menos cambios de guion y más soluciones para el alquiler!"),
    ],
  },
};
