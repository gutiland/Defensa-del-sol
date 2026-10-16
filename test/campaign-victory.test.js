import { test } from "node:test";
import assert from "node:assert/strict";
import {
  runStrategy,
  EXAMPLE_STRATEGY,
} from "../scripts/campaign-strategies.js";

test("a campaign with earned provisions, economy and control can complete all twenty rounds", () => {
  const result = runStrategy(EXAMPLE_STRATEGY);
  assert.equal(result.result, "defense");
  assert.equal(result.round, 20);
  assert.equal(result.rounds.length, 20);
  assert.ok(result.base > 0);
  assert.ok(result.improved >= 20);
  assert.ok(result.casts > 0);
  assert.ok(result.rounds.every((round) => round.money >= 0));
  assert.ok(
    result.actions.every(({ command }) =>
      ["build", "upgrade", "specialize", "ability", "ready"].includes(
        command.type,
      ),
    ),
  );
});
