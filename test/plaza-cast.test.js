import { test } from "node:test";
import assert from "node:assert/strict";
import { PLAZA_CAST, chapterCast } from "../src/data/plaza-cast.js";
import { CHARACTERS, defenderCharacter } from "../src/data/characters.js";
import { DEFAULT_ROLES } from "../src/data/roles.js";
import { BOSS_QUOTES } from "../src/data/quotes.js";
test("the complete cast has renderable identities and appears once across the twenty story chapters", () => {
  assert.equal(PLAZA_CAST.length, 8);
  const appearances = Array.from({ length: 20 }, (_, i) =>
    chapterCast(i + 1),
  ).flat();
  assert.equal(new Set(appearances.map((a) => a.id)).size, 8);
  assert.equal(appearances.length, 8);
  for (const actor of PLAZA_CAST) {
    assert.equal(CHARACTERS[actor.id].name, actor.name);
    assert.equal(DEFAULT_ROLES[actor.id], actor.role);
    assert.ok(CHARACTERS[actor.id].lines.length >= 2);
  }
  for (const [id, quotes] of Object.entries(BOSS_QUOTES)) {
    assert.equal(CHARACTERS[id].quotes, undefined);
    assert.ok(
      CHARACTERS[id].lines.every((line) =>
        quotes.every((quote) => quote.text !== line),
      ),
      "archived quotations must not become fictional combat dialogue",
    );
  }
});
test("new camp personalities stay on the defending side and do not vary attacker class identities", () => {
  const actors = new Set();
  for (const type of ["tent", "speaker", "kitchen", "area"])
    for (let i = 0; i < 20; i++) {
      const id = defenderCharacter(type, i);
      actors.add(id);
      assert.equal(CHARACTERS[id].side, "defense");
    }
  for (const id of ["wordkeeper", "hummus"]) assert.ok(actors.has(id));
});
