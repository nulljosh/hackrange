#!/usr/bin/env python3
"""LeetCode track. One function per problem, each the lazy correct solution, with an assert-based
self-check at the bottom. Run it: python3 -I leetcode/solutions.py. No framework, no network.

The point is the same as the rest of the dojo: do it yourself first, then compare. These are here so
the benchmark has something to score and so a stuck solve has a reference.
"""
from collections import Counter


def two_sum(nums, target):
    # One pass, a hash of value -> index. O(n).
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []


def valid_parentheses(s):
    # Push openers, pop and match on closers. A stack is the whole trick.
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for c in s:
        if c in pairs:
            if not stack or stack.pop() != pairs[c]:
                return False
        else:
            stack.append(c)
    return not stack


def merge_two_lists(a, b):
    # Lists stand in for linked lists here; merge two sorted sequences in one pass.
    out, i, j = [], 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    return out + a[i:] + b[j:]


def max_profit(prices):
    # Track the lowest price so far and the best gain against it. One pass.
    low, best = float("inf"), 0
    for p in prices:
        low = min(low, p)
        best = max(best, p - low)
    return best


def contains_duplicate(nums):
    return len(set(nums)) != len(nums)


def group_anagrams(words):
    # Key each word by its sorted letters; anagrams collide on the same key.
    groups = {}
    for w in words:
        groups.setdefault("".join(sorted(w)), []).append(w)
    return sorted(sorted(g) for g in groups.values())


def longest_substring(s):
    # Longest substring without a repeat: a sliding window and the last index of each char.
    last, start, best = {}, 0, 0
    for i, c in enumerate(s):
        if c in last and last[c] >= start:
            start = last[c] + 1
        last[c] = i
        best = max(best, i - start + 1)
    return best


def top_k_frequent(nums, k):
    return [n for n, _ in Counter(nums).most_common(k)]


SOLVERS = [
    ("Two Sum", lambda: two_sum([2, 7, 11, 15], 9) == [0, 1] and two_sum([3, 3], 6) == [0, 1]),
    ("Valid Parentheses", lambda: valid_parentheses("()[]{}") and not valid_parentheses("(]")),
    ("Merge Two Sorted Lists", lambda: merge_two_lists([1, 2, 4], [1, 3, 4]) == [1, 1, 2, 3, 4, 4]),
    ("Best Time to Buy/Sell", lambda: max_profit([7, 1, 5, 3, 6, 4]) == 5 and max_profit([7, 6, 5]) == 0),
    ("Contains Duplicate", lambda: contains_duplicate([1, 2, 3, 1]) and not contains_duplicate([1, 2, 3])),
    ("Group Anagrams", lambda: group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"]) ==
        [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]),
    ("Longest Substring", lambda: longest_substring("abcabcbb") == 3 and longest_substring("bbbbb") == 1),
    ("Top K Frequent", lambda: sorted(top_k_frequent([1, 1, 1, 2, 2, 3], 2)) == [1, 2]),
]


def run():
    rows = []
    for name, check in SOLVERS:
        try:
            ok = bool(check())
        except Exception:
            ok = False
        rows.append((name, ok))
    return rows


if __name__ == "__main__":
    bad = 0
    for name, ok in run():
        print(f"[{'PASS' if ok else 'FAIL'}] {name}")
        bad += not ok
    print(f"\n{len(SOLVERS) - bad}/{len(SOLVERS)} correct")
    raise SystemExit(1 if bad else 0)
