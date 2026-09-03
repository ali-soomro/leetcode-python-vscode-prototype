from typing import Dict, List, Optional


class ListNode:
    def __init__(self, val: int = 0, next: Optional["ListNode"] = None):
        self.val = val
        self.next = next


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
