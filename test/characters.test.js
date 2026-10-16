import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CHARACTERS,
  attackerCharacter,
  defenderCharacter,
  characterFlag,
} from "../src/data/characters.js";
test("all character designs participate on the correct side without changing unit classes", () => {
  const attack = new Set(),
    defense = new Set();
  for (let variant = 0; variant < 6; variant++) {
    for (const kind of [
      "basic",
      "fast",
      "heavy",
      "perfume",
      "armored",
      "sprinter",
    ])
      attack.add(attackerCharacter(kind, variant));
    for (const type of [
      "tent",
      "area",
      "odor",
      "speaker",
      "kitchen",
      "barrier",
      "base",
    ])
      defense.add(defenderCharacter(type, variant));
  }
  assert.equal(attack.size, 6);
  assert.equal(defense.size, 9);
  for (const id of attack) assert.equal(CHARACTERS[id].side, "attack");
  for (const id of defense) assert.equal(CHARACTERS[id].side, "defense");
  for (const actor of Object.values(CHARACTERS))
    assert.ok(actor.lines.length >= 2);
});

test("only selected characters carry flags, with correct designs for each side", () => {
  const defenderFlags = new Set();
  let flagCount = 0;
  for (const [id, actor] of Object.entries(CHARACTERS)) {
    const flag = characterFlag(id);
    if (!flag) continue;
    flagCount++;
    if (actor.side === "attack") assert.equal(flag, "spain");
    else defenderFlags.add(flag);
  }
  assert.equal(flagCount, 4);
  assert.deepEqual([...defenderFlags].sort(), ["palestine", "republic"]);
});
