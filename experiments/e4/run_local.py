from __future__ import annotations

import importlib.util
import sys
from pathlib import Path
from types import ModuleType

from runtime_types import TreeNode, ListNode, list_from_values, values_from_list


ROOT = Path(__file__).parent


def load_candidate_a(path: Path, module_name: str) -> ModuleType:
    spec = importlib.util.spec_from_file_location(module_name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot create a module spec for {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    spec.loader.exec_module(module)
    return module


def load_candidate_b(path: Path, module_name: str) -> ModuleType:
    spec = importlib.util.spec_from_file_location(module_name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot create a module spec for {path}")
    module = importlib.util.module_from_spec(spec)
    module.__dict__.update({"ListNode": ListNode, "TreeNode": TreeNode})
    sys.modules[module_name] = module
    spec.loader.exec_module(module)
    return module


def check_candidate(candidate: str, loader) -> None:
    base = ROOT / candidate

    primitive = loader(base / "primitive_solution.py", f"{candidate}_primitive")
    assert primitive.Solution().isValid("()[]{}") is True
    assert primitive.Solution().isValid("([)]") is False

    linked = loader(base / "listnode_solution.py", f"{candidate}_listnode")
    answer = linked.Solution().reverseList(list_from_values([1, 2, 3, 4, 5]))
    assert values_from_list(answer) == [5, 4, 3, 2, 1]

    tree = loader(base / "treenode_solution.py", f"{candidate}_treenode")
    tree_input = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
    assert tree.Solution().maxDepth(tree_input) == 3


if __name__ == "__main__":
    check_candidate("candidate_a", load_candidate_a)
    check_candidate("candidate_b", load_candidate_b)
    print("E4 local loader checks passed for candidates A and B")
