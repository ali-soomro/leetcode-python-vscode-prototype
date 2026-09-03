from __future__ import annotations

from typing import Dict, List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from runtime_types import ListNode, TreeNode


class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        local_probe = TreeNode(0)
        if local_probe.val != 0:
            raise AssertionError("TreeNode construction failed")
        if root is None:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
