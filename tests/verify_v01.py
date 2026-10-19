#!/usr/bin/env python3
"""Automated V0.1 Release Verification Suite for DSA Mastery."""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

REQUIRED_DOCS = [
    "PROJECT_PLAN.md",
    "TASKS.md",
    "DECISIONS.md",
    "CHANGELOG.md",
    "README.md",
    "DEPLOYMENT.md",
]

def check_docs():
    for doc in REQUIRED_DOCS:
        p = os.path.join(ROOT, doc)
        assert os.path.isfile(p) and os.path.getsize(p) > 200, f"Missing or empty {doc}"
    print("[PASS] 6/6 Mandatory Project Management Documents verified.")

def check_curriculum():
    p = os.path.join(ROOT, "src/data/curriculum.ts")
    text = open(p).read()
    mod_ids = re.findall(r"id:\s*'(mod-\d+-[^']+)'", text)
    les_ids = re.findall(r"id:\s*'(les-\d+-[^']+)'", text)
    assert len(mod_ids) >= 6, f"Expected >=6 modules, got {len(mod_ids)}"
    assert len(les_ids) >= 6, f"Expected >=6 lessons, got {len(les_ids)}"
    print(f"[PASS] Curriculum verified: {len(mod_ids)} modules, {len(les_ids)} interactive lessons.")

def check_problems():
    p = os.path.join(ROOT, "src/data/problems.ts")
    text = open(p).read()
    solutions = re.findall(r"solutionCode:\s*`([^`]+)`", text)
    assert len(solutions) == 8, f"Expected 8 problems, found {len(solutions)}"
    ns = {}
    for sol in solutions:
        exec(sol, ns)
    assert ns["two_sum"]([2, 7, 11, 15], 9) == [0, 1]
    assert ns["is_valid_parentheses"]("({[]})") is True
    assert ns["is_valid_parentheses"]("([)]") is False
    assert ns["binary_search"]([-1, 0, 3, 5, 9, 12], 9) == 4
    assert ns["is_palindrome_array"]([1, 4, 7, 4, 1]) is True
    assert ns["max_subarray"]([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6
    assert ns["climb_stairs"](5) == 8
    assert ns["coin_change"]([1, 2, 5], 11) == 3
    assert ns["trap_rain_water"]([0,1,0,2,1,0,1,3,2,1,2,1]) == 6
    print("[PASS] 8/8 Python DSA practice problems & reference solutions verified.")

if __name__ == "__main__":
    check_docs()
    check_curriculum()
    check_problems()
    print("ALL V0.1 RELEASE VERIFICATION CHECKS PASSED!")
