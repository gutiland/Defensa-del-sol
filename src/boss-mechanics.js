// Gameplay cues deliberately separate from real quotations.
function protectionState(game, unit) {
  return {
    shield: unit.kind === "bossPedro" && game.time % 8 < 4,
    armor:
      unit.kind === "bossSanti"
        ? 8
        : unit.kind === "armored"
          ? 6
          : unit.kind === "heavy"
            ? 3
            : 0,
  };
}
export function bossState(game, unit, sources) {
  const cycle = game.time % 8;
  const desperate = unit.maxHp > 0 && unit.hp > 0 && unit.hp <= unit.maxHp / 2;
  return {
    ...protectionState(game, unit),
    phase:
      unit.kind === "bossPedro"
        ? cycle < 4
          ? "PROTEGIDO"
          : "CAMBIO DE RITMO"
        : desperate
          ? "ÚLTIMO EMPUJÓN"
          : "AVANZA",
    speed:
      unit.kind === "bossPedro" && cycle >= 4
        ? 1.65
        : desperate && unit.kind === "bossSanti"
          ? 1.2
          : (sources?.bosses || game.units).some(
                (b) =>
                  b.hp > 0 &&
                  b.hp <= b.maxHp / 2 &&
                  b.kind === "bossDani" &&
                  b.id !== unit.id &&
                  Math.hypot(b.x - unit.x, b.y - unit.y) < 150,
              )
            ? 1.45
            : (sources?.bosses || game.units).some(
                  (b) =>
                    b.hp > 0 &&
                    b.kind === "bossDani" &&
                    b.id !== unit.id &&
                    Math.hypot(b.x - unit.x, b.y - unit.y) < 150,
                )
              ? 1.3
              : 1,
  };
}
export function dealDamage(game, unit, amount, weapon = {}) {
  if (unit.hp <= 0) return 0;
  const state = protectionState(game, unit);
  const damage = Math.min(
    unit.hp,
    Math.max(
      amount * 0.2,
      amount -
        (weapon.piercing || weapon.fire || weapon.splash ? 0 : state.armor),
    ) * (state.shield ? 0.35 : 1),
  );
  unit.hp -= damage;
  unit.lastHit = game.time;
  unit.hitWeapon = weapon.type || (weapon.fire ? "molotov" : "stone");
  unit.hitContinuous = weapon.fire === true;
  unit.hitDirection = Math.sign(unit.x - (weapon.fromX ?? unit.x - 1)) || 1;
  if (weapon.sourceId !== undefined) {
    game.roundDamage ||= {};
    game.roundDamage[weapon.sourceId] =
      (game.roundDamage[weapon.sourceId] || 0) + damage;
  }
  return damage;
}
