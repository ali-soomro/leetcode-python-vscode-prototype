import assert from "node:assert/strict";
import test from "node:test";
import { normalizeStarterSource } from "./normalizeStarter";

test("adds pass to a blank LeetCode method scaffold", () => {
  assert.equal(
    normalizeStarterSource("class Solution:\n    def isValid(self, s: str) -> bool:\n"),
    "class Solution:\n    def isValid(self, s: str) -> bool:\n        pass\n"
  );
});

test("does not change a method that already has a body", () => {
  const source = "class Solution:\n    def isValid(self, s: str) -> bool:\n        return True\n";
  assert.equal(normalizeStarterSource(source), source);
});
