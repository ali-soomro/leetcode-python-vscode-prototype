# E4 runbook

E4 gates the extension. It must prove that a single Python solution file is:

1. Pylance-clean;
2. executable under the documented local loader; and
3. accepted unchanged by LeetCode's Python editor when run on a visible case.

The reproducible local fixtures are in `experiments/e4/`.

Current outcome: Candidate A passed the unchanged live Run checks for #20, #206, and #104. Candidate B is rejected because LeetCode's wrapper rejects its future import. The selected Candidate A contract is documented in [e4-harness-contract.md](e4-harness-contract.md); Pylance and typing-import evidence remain required before E4 closes.

## Local check

```sh
python3 experiments/e4/run_local.py
```

This executes the following fixtures for Candidate A (inline node classes) and Candidate B (pre-seeded module globals):

- Valid Parentheses (primitive result);
- Reverse Linked List (`ListNode` input, body-level `ListNode()` construction, node result);
- Maximum Depth of Binary Tree (`TreeNode` input, body-level `TreeNode()` construction).

Candidate B must be loaded through `load_candidate_b`; it pre-seeds `ListNode` and `TreeNode` before `exec_module`. A normal import is not an acceptable Candidate B test.

## Pylance check

Open `experiments/e4/` as a VS Code folder, select the same Python interpreter, and inspect the Problems panel for every candidate source. Record whether Pylance reports undefined names for:

```text
List, Optional, Dict, ListNode, TreeNode
```

The extension source model must also reconcile copied starters that either omit or already include `from typing import ...`; these two fixture shapes must be added before E4 is declared passed.

## Live paste check

Use LeetCode's **Run** button only; do not submit.

For each candidate, paste the complete saved file without removing or adding lines, then run:

| Fixture | Problem | Visible input | Expected output |
| --- | --- | --- | --- |
| Primitive | 20 — Valid Parentheses | `"()[]{}"` | `true` |
| ListNode | 206 — Reverse Linked List | `[1,2,3,4,5]` | `[5,4,3,2,1]` |
| TreeNode | 104 — Maximum Depth of Binary Tree | `[3,9,20,null,null,15,7]` | `3` |

Record all failures verbatim, including the environment that failed: Pylance, local loader, or LeetCode.

## Result record

Use this table in the E4 evidence issue/PR:

| Candidate | Fixture | Pylance clean | Local run | Unchanged LeetCode run | Failure/evidence |
| --- | --- | --- | --- | --- | --- |
| A | Primitive |  |  |  |  |
| A | ListNode |  |  |  |  |
| A | TreeNode |  |  |  |  |
| A | bare `List[int]` starter |  |  |  |  |
| A | starter-owned typing import |  |  |  |  |
| B | Primitive |  |  |  |  |
| B | ListNode |  |  |  |  |
| B | TreeNode |  |  |  |  |
| B | bare `List[int]` starter |  |  |  |  |
| B | starter-owned typing import |  |  |  |  |

## Required E4 output

The winning candidate must have a committed harness contract that states:

- exact saved-source preamble;
- normal import versus bootstrap loader behavior;
- globals injected before `exec_module`;
- guaranteed `typing` names and missing/existing import reconciliation;
- supported node types and unsupported types;
- source-mapping behavior; and
- links to Pylance, local-run, and live-paste evidence.

If no candidate passes all three environments for a claimed type, remove that type from scope or stop the project before building the extension runtime.
