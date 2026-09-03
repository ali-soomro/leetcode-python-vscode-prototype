# E4 harness contract: Candidate A

## Status

Candidate A is the selected source-template/harness direction.

Live LeetCode evidence:

- #20 Valid Parentheses: unchanged source ran and submitted successfully.
- #206 Reverse Linked List: unchanged source ran and submitted successfully.
- #104 Maximum Depth of Binary Tree: unchanged source ran and submitted successfully.

Candidate B is rejected: LeetCode's wrapper rejected its `from __future__ import annotations` line with `SyntaxError: from __future__ imports must occur at the beginning of the file`.

The selected contract remains provisional until the post-type-checking Pylance result is recorded and the missing/existing `typing` import reconciliation fixtures are added.

## Saved source template

The saved LeetCode solution is a normal Python module with:

1. a standard-library `typing` import containing every generic needed by the source (`Dict`, `List`, `Optional`, and later only other explicitly supported names);
2. uncommented LeetCode-style `ListNode` and/or `TreeNode` definitions when the copied starter requires them; and
3. the user's unchanged `class Solution` implementation.

It does not contain a `from __future__ import annotations` line, type-only imports from local runtime modules, or extension-only imports. The whole saved source is copied to LeetCode unchanged.

## Import reconciliation rule

The clipboard importer parses the source with the selected Python interpreter's `ast.parse` and then:

- finds existing `from typing import ...` declarations;
- determines which supported typing names occur in annotations;
- adds missing supported names to one canonical `from typing import ...` declaration, immediately after any legal module preamble; and
- preserves an existing typing declaration rather than adding a second one.

The importer rejects unsupported annotations instead of guessing a type/runtime model.

## Local loader behavior

Use normal `importlib` module execution:

1. create a module spec for the saved source;
2. create a module with `module_from_spec`;
3. register it in `sys.modules`; and
4. call `exec_module`.

Plain importlib execution is allowed. No platform globals are injected before execution. The saved source owns its local `ListNode`/`TreeNode` definitions.

## Runtime compatibility boundary

The local decoder may construct its own node objects. Candidate A is valid only because supported solutions interact with nodes through the LeetCode-compatible `val`, `next`, `left`, and `right` attributes. The E4 fixtures verify that candidate code can accept runtime-created inputs, construct local probe nodes in a method body, and return compatible values.

Supported only after their fixtures pass:

- primitive values and lists;
- `List`, `Optional`, and `Dict` annotations;
- `ListNode` and `TreeNode` values.

Unsupported structures remain outside the v0.1 contract.

## Evidence to retain

- Candidate A local runner: `python3 experiments/e4/run_local.py`.
- Pylance Problems-panel screenshots/output with type checking enabled.
- Visible LeetCode Run evidence for #20, #206, and #104.
- Explicit missing-import and starter-owned-import fixture results.
