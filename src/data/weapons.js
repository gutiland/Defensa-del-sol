export const TENT_WEAPONS = [
  { name: "Piedras", type: "stone", damage: 7, rate: 0.8 },
  { name: "Piedras grandes", type: "big-stone", damage: 12, rate: 0.9 },
  { name: "Botellas", type: "bottle", damage: 18, rate: 1 },
  {
    name: "Cócteles molotov",
    type: "molotov",
    damage: 23,
    rate: 1.3,
    fire: { radius: 45, dps: 4, duration: 4 },
  },
];
export const AREA_WEAPONS = [
  {
    name: "Bolas de pintura",
    type: "paintbomb",
    icon: "🟣",
    damage: 6,
    rate: 1.8,
    splash: 65,
  },
  {
    name: "Botes de pintura",
    type: "paintcan",
    icon: "🎨",
    damage: 10,
    rate: 1.8,
    splash: 65,
  },
  {
    name: "Petardos",
    type: "firecracker",
    icon: "🧨",
    damage: 14,
    rate: 1.8,
    splash: 65,
  },
  {
    name: "Granadas",
    type: "grenade",
    icon: "💥",
    damage: 16,
    rate: 1.8,
    splash: 65,
  },
];
export const EQUIPMENT = {
  speaker: [
    ["Megáfono", "📣"],
    ["Altavoces", "🔊"],
    ["Torre de sonido", "📡"],
  ],
  odor: [
    ["Ropa fermentada", "🧦"],
    ["Difusor", "🧪"],
    ["Ventilador de esencias", "🌀"],
  ],
  kitchen: [
    ["Hornillo", "🔥"],
    ["Olla comunitaria", "🍲"],
    ["Cocina de campaña", "🍳"],
  ],
  barrier: [
    ["Palés", "🪵"],
    ["Valla reforzada", "🛡"],
    ["Doble parapeto", "🚧"],
  ],
};
export const equipmentFor = (type, level) => {
  if (type === "area") return AREA_WEAPONS[level - 1];
  const item = EQUIPMENT[type]?.[level - 1];
  return item ? { name: item[0], icon: item[1] } : null;
};
export const maxLevel = (type) => (type === "tent" || type === "area" ? 4 : 3);
export const rangeFor = (building, definition) =>
  definition.range +
  (building.type === "speaker" && building.branch === "power" ? 30 : 0);
function baseWeapon(building, definition) {
  if (building.type === "area") return AREA_WEAPONS[building.level - 1];
  return building.type === "tent"
    ? TENT_WEAPONS[building.level - 1]
    : {
        name: "Megafonía",
        type: "sound",
        damage: definition.damage * building.level,
        rate: definition.rate,
      };
}

export function weaponFor(building, definition) {
  const weapon = { ...baseWeapon(building, definition) };
  if (weapon.fire) weapon.fire = { ...weapon.fire };
  if (
    building.branch === "rapid" &&
    (building.type === "tent" || building.type === "area")
  )
    weapon.rate *= building.type === "area" ? 0.7 : 0.65;
  if (building.branch === "power") {
    weapon.damage *=
      building.type === "speaker"
        ? 1.9
        : building.type === "area"
          ? 1.25
          : 1.55;
    weapon.piercing = true;
    if (weapon.splash) weapon.splash = 95;
    if (weapon.fire) {
      weapon.fire.radius = 65;
      weapon.fire.dps *= 1.5;
    }
  }
  return weapon;
}
