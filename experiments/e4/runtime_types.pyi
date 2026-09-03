from __future__ import annotations


class ListNode:
    val: int
    next: ListNode | None
    def __init__(self, val: int = ..., next: ListNode | None = ...) -> None: ...


class TreeNode:
    val: int
    left: TreeNode | None
    right: TreeNode | None
    def __init__(
        self,
        val: int = ...,
        left: TreeNode | None = ...,
        right: TreeNode | None = ...,
    ) -> None: ...
