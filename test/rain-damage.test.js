import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.js";
import { stereotypeState } from "../src/stereotypes.js";
import { resolveProjectiles, burnGround } from "../src/combat.js";
import { TENT_WEAPONS } from "../src/data/weapons.js";

test("rain halves strongest odor damage for the whole wave, including covered tents, and dry weather restores it", () => {
  for (const option of ["endure", "cover"]) {
    const game = new Game();
    game.round = 9;
    game.command({ type: "story-choice", option });
    game.command({ type: "ready" });
    game.time = 30;
    game.buildings = [1, 2].map((id) => ({
      id,
      type: "odor",
      x: 0,
      y: 0,
      hp: 100,
      level: 3,
      branch: "power",
    }));
    const unit = { kind: "basic", x: 0, y: 0 };
    assert.equal(stereotypeState(game, unit).dps, 3);
    assert.equal(stereotypeState(game, { ...unit, kind: "perfume" }).dps, 0);
    game.storyEvent = null;
    assert.equal(stereotypeState(game, unit).dps, 6);
  }
});

test("rain reduces molotov impact and non-stacking fire, leaving other projectiles and weapon definitions intact", () => {
  const original = structuredClone(TENT_WEAPONS);
  for (const rain of [false, true]) {
    for (const weapon of TENT_WEAPONS) {
      const game = new Game();
      game.storyEvent = rain ? { id: "rain" } : null;
      const unit = { id: 1, kind: "basic", x: 0, y: 0, hp: 100 };
      game.units = [unit];
      game.projectiles = [{ targetId: 1, tx: 0, ty: 0, weapon, life: 0.1 }];
      resolveProjectiles(game, 0.1);
      const multiplier = rain && weapon.type === "molotov" ? 0.6 : 1;
      assert.ok(Math.abs(100 - unit.hp - weapon.damage * multiplier) < 1e-8);
      if (weapon.fire) {
        const hp = unit.hp;
        game.fires.push({ ...game.fires[0] });
        burnGround(game, 1);
        assert.ok(Math.abs(hp - unit.hp - weapon.fire.dps * multiplier) < 1e-8);
        const wetHp = unit.hp;
        game.storyEvent = null;
        burnGround(game, 1);
        assert.ok(Math.abs(wetHp - unit.hp - weapon.fire.dps) < 1e-8);
      }
    }
  }
  assert.deepEqual(TENT_WEAPONS, original);
});
