import { test } from "node:test";
import assert from "node:assert/strict";
import { focusDialogStart } from "../src/ui/dialog-focus.js";

test("dialog focus cannot leave a reused modal scrolled halfway down", () => {
  const dialog = { scrollTop: 380, scrollLeft: 20 };
  let options;
  const heading = {
    setAttribute(name, value) {
      assert.equal(name, "tabindex");
      assert.equal(value, "-1");
    },
    focus(value) {
      options = value;
      dialog.scrollTop = 240;
    },
  };
  focusDialogStart(dialog, heading);
  assert.deepEqual(options, { preventScroll: true });
  assert.equal(dialog.scrollTop, 0);
  assert.equal(dialog.scrollLeft, 0);
  focusDialogStart(dialog, null);
  assert.equal(dialog.scrollTop, 0);
});
