// Hand-authored schematic coordinates. Gameplay coordinates stay stable.
export const projectY = (y) => 120 + y * 0.66;
export const unprojectY = (y) => (y - 120) / 0.66;
export const METRO_ACCESS = Object.freeze({ x: 405, y: 264 });
export const STREETS = [
  {
    name: "ARENAL",
    from: [-30, 365],
    to: [150, 345],
    label: [54, 342],
    width: 45,
  },
  {
    name: "MAYOR",
    from: [-20, 535],
    to: [175, 480],
    label: [65, 522],
    width: 48,
  },
  {
    name: "PRECIADOS",
    from: [175, -20],
    to: [330, 218],
    label: [211, 117],
    width: 40,
  },
  {
    name: "CARMEN",
    from: [390, -20],
    to: [440, 193],
    label: [388, 88],
    width: 32,
  },
  {
    name: "MONTERA",
    from: [680, -20],
    to: [626, 213],
    label: [688, 107],
    width: 40,
  },
  {
    name: "ALCALÁ",
    from: [1030, 202],
    to: [850, 345],
    label: [944, 245],
    width: 60,
  },
  {
    name: "CARRERA DE SAN JERÓNIMO",
    from: [1030, 551],
    to: [830, 475],
    label: [869, 546],
    width: 48,
  },
  {
    name: "CARRETAS",
    from: [605, 710],
    to: [596, 510],
    label: [633, 648],
    width: 38,
  },
  {
    name: "ESPOZ Y MINA",
    from: [793, 710],
    to: [742, 509],
    label: [805, 625],
    width: 28,
  },
  {
    name: "CORREO",
    from: [302, 710],
    to: [318, 512],
    label: [277, 651],
    width: 25,
  },
  {
    name: "VICTORIA",
    from: [980, 710],
    via: [[915, 507]],
    to: [830, 475],
    label: [949, 623],
    width: 26,
  },
];
