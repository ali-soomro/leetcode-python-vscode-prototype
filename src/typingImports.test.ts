import assert from "node:assert/strict";
import test from "node:test";
import { ParsedStarter } from "./models";
import { reconcileTypingImports } from "./typingImports";

const base: ParsedStarter = {
  methodName: "duplicate",
  parameters: [{ name: "nums", annotation: "List[int]" }],
  returnAnnotation: "List[int]",
  requiredTypingNames: ["List"],
  typingImports: [],
  insertionLine: 0,
};

test("adds missing typing imports before a Solution class", () => {
  const source = "class Solution:\n    def duplicate(self, nums: List[int]) -> List[int]:\n        return nums\n";
  assert.equal(reconcileTypingImports(source, base), `from typing import List\n${source}`);
});

test("merges missing names into one existing typing import", () => {
  const parsed: ParsedStarter = { ...base, requiredTypingNames: ["List", "Optional"], typingImports: [{ line: 1, endLine: 1, names: ["Dict"] }] };
  const source = "from typing import Dict\n\nclass Solution:\n    pass\n";
  assert.equal(reconcileTypingImports(source, parsed), "from typing import Dict, List, Optional\n\nclass Solution:\n    pass\n");
});
