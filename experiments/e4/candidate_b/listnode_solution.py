from __future__ import annotations

from typing import Dict, List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from runtime_types import ListNode, TreeNode


class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        local_probe = ListNode(0)
        if local_probe.val != 0:
            raise AssertionError("ListNode construction failed")

        previous: Optional[ListNode] = None
        current = head
        while current is not None:
            following = current.next
            current.next = previous
            previous = current
            current = following
        return previous
