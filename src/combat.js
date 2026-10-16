import { dealDamage } from "./boss-mechanics.js";
import { rainDamageMultiplier } from "./rain.js";
export function resolveProjectiles(game, dt) {
  for (const projectile of game.projectiles) {
    projectile.life -= dt;
    if (projectile.life > 1e-9) continue;
    const target = game.units.find(
      (unit) => unit.id === projectile.targetId && unit.hp > 0,
    );
    if (projectile.weapon.splash) {
      for (const unit of game.units) {
        if (
          unit.hp > 0 &&
          Math.hypot(unit.x - projectile.tx, unit.y - projectile.ty) <=
            projectile.weapon.splash
        ) {
          dealDamage(
            game,
            unit,
            projectile.weapon.damage *
              rainDamageMultiplier(game, projectile.weapon.type),
            projectile.weapon,
          );
        }
      }
    } else if (target) {
      dealDamage(
        game,
        target,
        projectile.weapon.damage *
          rainDamageMultiplier(game, projectile.weapon.type),
        projectile.weapon,
      );
    }
    game.effects.push({
      type: projectile.weapon.splash ? "splash" : "impact",
      weaponType: projectile.weapon.type,
      radius: projectile.weapon.splash,
      x: projectile.tx,
      y: projectile.ty,
      tx: projectile.tx,
      ty: projectile.ty,
      life: 0.32,
      duration: 0.32,
    });
    if (projectile.weapon.fire) {
      const fire = projectile.weapon.fire;
      game.fires.push({
        x: projectile.tx,
        y: projectile.ty,
        radius: fire.radius,
        dps: fire.dps,
        life: fire.duration,
        duration: fire.duration,
        sourceId: projectile.weapon.sourceId,
      });
    }
  }
  game.projectiles = game.projectiles.filter(
    (projectile) => projectile.life > 1e-9,
  );
}
export function burnGround(game, dt) {
  for (const unit of game.units) {
    // Overlapping pools use the strongest burn rather than multiplying damage.
    let strongest = null,
      damage = 0;
    for (const fire of game.fires) {
      if (Math.hypot(unit.x - fire.x, unit.y - fire.y) > fire.radius) continue;
      const amount =
        fire.dps *
        Math.min(dt, fire.life) *
        rainDamageMultiplier(game, "molotov");
      if (amount > damage) {
        damage = amount;
        strongest = fire;
      }
    }
    if (damage > 0)
      dealDamage(game, unit, damage, {
        fire: true,
        type: "molotov",
        sourceId: strongest.sourceId,
      });
  }
  game.fires = game.fires.filter((fire) => (fire.life -= dt) > 1e-9);
}

export function strikeTarget(game, unit, target) {
  if (unit.cooldown > 0 || target.hp <= 0) return;
  if (!target.invulnerable)
    target.hp -=
      unit.damage *
      (unit.kind === "berserker" && unit.hp < unit.maxHp / 2 ? 1.5 : 1);
  target.lastHit = game.time;
  unit.lastStrike = game.time;
  unit.cooldown = 1;
  game.effects.push({
    type: "impact",
    material: target.type === "barrier" ? "wood" : "cloth",
    x: unit.x,
    y: unit.y,
    tx: target.x,
    ty: target.y,
    life: 0.32,
    duration: 0.32,
  });
}
