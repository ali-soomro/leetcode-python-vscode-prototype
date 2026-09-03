import assert from "node:assert/strict";
import test from "node:test";
import { parseStarter } from "./pythonAst";

test("parses a copied LeetCode-style Solution signature with bare typing names", async () => {
  const parsed = await parseStarter(
    "python3",
    "class Solution:\n    def duplicate(self, nums: List[int], index: int) -> Optional[List[int]]:\n        return nums + nums\n"
  );
  assert.equal(parsed.methodName, "duplicate");
  assert.deepEqual(parsed.parameters, [
    { name: "nums", annotation: "List[int]" },
    { name: "index", annotation: "int" },
  ]);
  assert.equal(parsed.returnAnnotation, "Optional[List[int]]");
  assert.deepEqual(parsed.requiredTypingNames, ["List", "Optional"]);
  assert.deepEqual(parsed.typingImports, []);
});

test("rejects ambiguous Solution classes", async () => {
  await assert.rejects(
    parseStarter("python3", "class Solution:\n    def first(self):\n        pass\n    def second(self):\n        pass\n"),
    /exactly one public method/
  );
});
