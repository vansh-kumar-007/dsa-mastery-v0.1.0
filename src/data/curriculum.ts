import { CurriculumModule } from '../types';

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 'mod-1-foundations',
    order: 1,
    title: 'Module 1: Python Memory & Big-O Foundations',
    level: 'Beginner',
    description:
      'Master asymptotic complexity (Big-O), CPython dynamic list memory layout, amortized O(1) appends, and pointer semantics before tackling interview patterns.',
    prerequisites: [],
    badgeColor: 'emerald',
    lessons: [
      {
        id: 'les-101-big-o',
        moduleId: 'mod-1-foundations',
        title: '1.1 Asymptotic Analysis & CPython List Internals',
        durationMin: 12,
        summary:
          'Understand how time and space scale with input size N, why Python list indexing is O(1), and why inserting at index 0 costs O(N).',
        timeComplexity: 'Access: O(1) | Append: O(1) amortized | Insert(0): O(N)',
        spaceComplexity: 'O(N) contiguous pointer array',
        keyTakeaways: [
          'CPython lists store contiguous arrays of pointers to PyObject values, giving O(1) random access by index.',
          'Appending over-allocates capacity (~1.125x growth factor), achieving O(1) amortized time.',
          'Inserting or popping at index 0 shifts all N-1 elements in memory, costing O(N) time—use collections.deque for O(1) left pops.',
        ],
        conceptMarkdown:
          'When analyzing Python algorithms, always account for the hidden cost of built-in operations. A `for` loop with `x in my_list` performs an `O(N)` linear scan, whereas `x in my_set` or `x in my_dict` computes a hash in `O(1)` average time.',
        pythonCode: `def analyze_prefix_averages(nums: list[int]) -> list[float]:
    """
    Computes running prefix averages in O(N) time and O(N) space
    by maintaining a single running_sum accumulator instead of slicing sum(nums[:i+1]).
    """
    running_sum = 0
    averages = []
    for idx, val in enumerate(nums):
        running_sum += val
        averages.append(round(running_sum / (idx + 1), 2))
    return averages`,
        dryRunArray: [10, 20, 30, 40],
        dryRunSteps: [
          {
            step: 1,
            codeLine: 6,
            variables: { running_sum: '0', averages: '[]' },
            explanation: 'Initialize accumulator running_sum = 0 and empty output list.',
            highlightIndices: [],
          },
          {
            step: 2,
            codeLine: 9,
            variables: { idx: '0', val: '10', running_sum: '10', averages: '[10.0]' },
            explanation: 'Process index 0: add 10 to running_sum (10), append 10 / 1 = 10.0 in O(1) amortized time.',
            highlightIndices: [0],
          },
          {
            step: 3,
            codeLine: 9,
            variables: { idx: '1', val: '20', running_sum: '30', averages: '[10.0, 15.0]' },
            explanation: 'Process index 1: add 20 to running_sum (30), append 30 / 2 = 15.0 without re-summing prefix.',
            highlightIndices: [0, 1],
          },
          {
            step: 4,
            codeLine: 9,
            variables: { idx: '2', val: '30', running_sum: '60', averages: '[10.0, 15.0, 20.0]' },
            explanation: 'Process index 2: add 30 to running_sum (60), append 60 / 3 = 20.0.',
            highlightIndices: [0, 1, 2],
          },
          {
            step: 5,
            codeLine: 11,
            variables: { idx: '3', val: '40', running_sum: '100', averages: '[10.0, 15.0, 20.0, 25.0]' },
            explanation: 'Process index 3: add 40 to running_sum (100), return final O(N) prefix averages.',
            highlightIndices: [0, 1, 2, 3],
          },
        ],
        quiz: {
          id: 'q-101',
          question:
            'What is the worst-case time complexity of executing `nums.pop(0)` inside a `while nums:` loop for a Python list of length N?',
          options: ['O(1)', 'O(N)', 'O(N log N)', 'O(N²)'],
          correctIndex: 3,
          explanation:
            'Each `nums.pop(0)` shifts the remaining k elements left in O(k) time. Repeating this N times yields N + (N-1) + ... + 1 = O(N²). Use `collections.deque.popleft()` for O(N) total time.',
        },
        linkedVisualizerAlgo: 'bubble-sort',
        linkedProblemId: 'prob-two-sum',
      },
    ],
  },
  {
    id: 'mod-2-arrays-pointers',
    order: 2,
    title: 'Module 2: Arrays, Two Pointers & Sliding Window',
    level: 'Beginner',
    description:
      'Eliminate nested O(N²) loops by coordinating converging left/right pointers and dynamic sliding windows over contiguous subarrays.',
    prerequisites: ['mod-1-foundations'],
    badgeColor: 'cyan',
    lessons: [
      {
        id: 'les-201-two-pointers',
        moduleId: 'mod-2-arrays-pointers',
        title: '2.1 Converging Two Pointers & In-Place Partitioning',
        durationMin: 15,
        summary:
          'Use opposite-end pointers (`left` and `right`) on sorted or symmetric sequences to reduce O(N²) pair searches to O(N) time and O(1) space.',
        timeComplexity: 'O(N) single pass',
        spaceComplexity: 'O(1) auxiliary pointers',
        keyTakeaways: [
          'When an array is sorted, comparing `nums[left] + nums[right]` against `target` eliminates an entire row or column of pairs in O(1) time.',
          'If the current sum is too small, increment `left` to increase the sum; if too large, decrement `right`.',
          'Each step moves `left` or `right` closer together, guaranteeing at most N comparisons.',
        ],
        conceptMarkdown:
          'Two Pointers transforms brute-force `O(N²)` pair checks into a monotonic `O(N)` walk. Because sorted order guarantees `nums[left] <= nums[left+1]` and `nums[right-1] <= nums[right]`, we never miss a valid pair when advancing one pointer inward.',
        pythonCode: `def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    """
    Finds 0-based indices [left, right] in a sorted array whose values sum to target.
    Runs in O(N) time and O(1) extra space.
    """
    left, right = 0, len(nums) - 1
    while left < right:
        curr_sum = nums[left] + nums[right]
        if curr_sum == target:
            return [left, right]
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]`,
        dryRunArray: [2, 5, 8, 11, 16],
        dryRunSteps: [
          {
            step: 1,
            codeLine: 6,
            variables: { target: '13', left: '0 (val=2)', right: '4 (val=16)' },
            explanation: 'Initialize left = 0 and right = 4 at opposite ends of sorted array.',
            highlightIndices: [0, 4],
          },
          {
            step: 2,
            codeLine: 8,
            variables: { target: '13', left: '0', right: '4', curr_sum: '18 (> 13)' },
            explanation: '2 + 16 = 18 > 13. Sum is too large, so decrement right to 3.',
            highlightIndices: [0, 4],
          },
          {
            step: 3,
            codeLine: 8,
            variables: { target: '13', left: '0 (val=2)', right: '3 (val=11)', curr_sum: '13 (== 13)' },
            explanation: '2 + 11 = 13 == target! Return indices [0, 3] in just 2 comparisons.',
            highlightIndices: [0, 3],
          },
        ],
        quiz: {
          id: 'q-201',
          question:
            'In a sorted array `nums`, if `nums[left] + nums[right] < target`, why is it safe to increment `left` without checking `(left, right - 1)`?',
          options: [
            'Because `nums[right - 1] <= nums[right]`, so `nums[left] + nums[right - 1]` would be even smaller than `target`.',
            'Because `left` always points to a negative integer.',
            'Because binary search already checked `right - 1`.',
            'It is not safe unless all numbers are prime.',
          ],
          correctIndex: 0,
          explanation:
            'Since the array is sorted in non-decreasing order, pairing `nums[left]` with any index smaller than `right` yields an even smaller sum, which still cannot reach `target`.',
        },
        linkedVisualizerAlgo: 'binary-search',
        linkedProblemId: 'prob-valid-palindrome',
      },
    ],
  },
  {
    id: 'mod-3-hashing-window',
    order: 3,
    title: 'Module 3: Hash Maps, Sets & Frequency Windowing',
    level: 'Beginner',
    description:
      'Trade O(N) auxiliary memory for O(1) average-case lookups to solve complement lookups, frequency counting, and duplicate detection in a single pass.',
    prerequisites: ['mod-1-foundations'],
    badgeColor: 'violet',
    lessons: [
      {
        id: 'les-301-hashmap-complement',
        moduleId: 'mod-3-hashing-window',
        title: '3.1 One-Pass Hash Map Complement Pattern',
        durationMin: 14,
        summary:
          'Use a Python `dict` to map seen values to their indices on the fly, solving unsorted pair-sum and subarray problems in O(N) time.',
        timeComplexity: 'O(N) average time',
        spaceComplexity: 'O(N) hash table entries',
        keyTakeaways: [
          'A Python `dict` is an open-addressed hash table with compact key insertion ordering.',
          'Checking `complement in seen` before inserting the current element prevents accidentally pairing an element with itself.',
          'This pattern generalizes to Prefix Sum + Hash Map for counting subarrays summing to K.',
        ],
        conceptMarkdown:
          'When an input array is **unsorted**, sorting it first takes `O(N log N)` time and scrambles original indices. Instead, storing each visited number in a hash map `seen[value] = index` lets us ask *"Have we already seen `target - num`?"* in `O(1)` time.',
        pythonCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    """
    One-pass hash map lookup for unsorted Two Sum.
    Time: O(N) | Space: O(N)
    """
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
        dryRunArray: [7, 2, 13, 11],
        dryRunSteps: [
          {
            step: 1,
            codeLine: 6,
            variables: { target: '9', seen: '{}' },
            explanation: 'Initialize empty dictionary `seen = {}`.',
            highlightIndices: [],
          },
          {
            step: 2,
            codeLine: 11,
            variables: { i: '0', num: '7', complement: '2', seen: '{7: 0}' },
            explanation: 'Index 0 (val=7): complement 9 - 7 = 2 not in seen. Store seen[7] = 0.',
            highlightIndices: [0],
          },
          {
            step: 3,
            codeLine: 10,
            variables: { i: '1', num: '2', complement: '7', seen: '{7: 0}', result: '[0, 1]' },
            explanation: 'Index 1 (val=2): complement 9 - 2 = 7 IS in seen at index 0! Return [0, 1].',
            highlightIndices: [0, 1],
          },
        ],
        quiz: {
          id: 'q-301',
          question:
            'Why do we check `if complement in seen:` BEFORE executing `seen[num] = i` in the one-pass Two Sum algorithm?',
          options: [
            'To avoid syntax errors in Python 3.',
            'To prevent using the same element twice when `target == 2 * num` (e.g., `num = 3, target = 6`).',
            'Because dictionaries cannot overwrite keys.',
            'To reduce space complexity from O(N) to O(1).',
          ],
          correctIndex: 1,
          explanation:
            'If we inserted `seen[num] = i` first and `target == 2 * num`, `complement in seen` would immediately match the current index `i` with itself.',
        },
        linkedVisualizerAlgo: 'insertion-sort',
        linkedProblemId: 'prob-two-sum',
      },
    ],
  },
  {
    id: 'mod-4-stacks-queues',
    order: 4,
    title: 'Module 4: Stacks, Monotonic Queues & Linked Lists',
    level: 'Intermediate',
    description:
      'Leverage Last-In-First-Out (LIFO) stacks for nested delimiter parsing, monotonic stacks for next-greater-element queries, and pointer manipulation.',
    prerequisites: ['mod-2-arrays-pointers'],
    badgeColor: 'amber',
    lessons: [
      {
        id: 'les-401-stacks-lifo',
        moduleId: 'mod-4-stacks-queues',
        title: '4.1 LIFO Stack Parsing & Bracket Validation',
        durationMin: 15,
        summary:
          'Understand why nested structures exhibit Last-In-First-Out symmetry and how a Python list acts as an O(1) amortized stack.',
        timeComplexity: 'O(N) single pass',
        spaceComplexity: 'O(N) stack depth',
        keyTakeaways: [
          'In nested expressions like `({[]})`, the most recently opened bracket must be the first one closed.',
          '`stack.append(x)` and `stack.pop()` both operate at the end of a Python list in O(1) amortized time.',
          'Always verify two conditions: every closing bracket matches the top of a non-empty stack, AND the stack is empty at the end.',
        ],
        conceptMarkdown:
          'Whenever a problem involves reversing recent history, validating nested syntax, or backtracking from the deepest state, a **Stack (LIFO)** is the natural data structure.',
        pythonCode: `def is_valid_parentheses(s: str) -> bool:
    """
    Validates balanced brackets (), {}, [] using a LIFO stack in O(N) time.
    """
    pairs = {')': '(', '}': '{', ']': '['}
    stack = []
    for ch in s:
        if ch in pairs:
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()
        else:
            stack.append(ch)
    return len(stack) == 0`,
        dryRunArray: [1, 2, 2, 1],
        dryRunSteps: [
          {
            step: 1,
            codeLine: 6,
            variables: { s: '"({[]})"', stack: '[]' },
            explanation: 'Start with an empty stack for input "({[]})".',
            highlightIndices: [],
          },
          {
            step: 2,
            codeLine: 13,
            variables: { ch: '"["', stack: '["(", "{", "["]' },
            explanation: 'Push opening brackets "(", "{", "[" onto the top of the stack.',
            highlightIndices: [0, 1],
          },
          {
            step: 3,
            codeLine: 11,
            variables: { ch: '"]"', popped: '"["', stack: '["(", "{"]' },
            explanation: 'Closing "]" matches top "["; pop it off. Repeat for "}" and ")".',
            highlightIndices: [2, 3],
          },
          {
            step: 4,
            codeLine: 14,
            variables: { stack: '[]', return: 'True' },
            explanation: 'All characters processed and stack is empty -> return True.',
            highlightIndices: [0, 1, 2, 3],
          },
        ],
        quiz: {
          id: 'q-401',
          question:
            'What would happen if `is_valid_parentheses` returned `True` at the end of the loop without checking `len(stack) == 0`?',
          options: [
            'Inputs with unclosed opening brackets like `"((("` would falsely return `True`.',
            'Inputs like `")"` would raise an IndexError.',
            'Time complexity would degrade to O(N²).',
            'Nothing; the stack is guaranteed to be empty.',
          ],
          correctIndex: 0,
          explanation:
            'An input consisting only of opening brackets like `"((("` never triggers a mismatch inside the loop, leaving unclosed brackets on the stack.',
        },
        linkedVisualizerAlgo: 'selection-sort',
        linkedProblemId: 'prob-valid-parentheses',
      },
    ],
  },
  {
    id: 'mod-5-sorting-binary-search',
    order: 5,
    title: 'Module 5: Sorting Mechanics & Binary Search on Answer Spaces',
    level: 'Intermediate',
    description:
      'Compare O(N²) elementary sorts against O(N log N) divide-and-conquer partitioning, and master O(log N) binary search without off-by-one bugs.',
    prerequisites: ['mod-2-arrays-pointers'],
    badgeColor: 'sky',
    lessons: [
      {
        id: 'les-501-binary-search',
        moduleId: 'mod-5-sorting-binary-search',
        title: '5.1 Invariant-Driven Binary Search & Divide-and-Conquer',
        durationMin: 16,
        summary:
          'Halve sorted search spaces in O(log N) comparisons by maintaining strict loop invariants over `[low, high]`.',
        timeComplexity: 'O(log N) comparisons',
        spaceComplexity: 'O(1) iterative',
        keyTakeaways: [
          'For N = 1,000,000,000 (1 billion) sorted items, Binary Search takes at most 30 comparisons (`log2(10^9) ≈ 29.89`).',
          'Use `mid = (low + high) // 2` and update `low = mid + 1` or `high = mid - 1` when searching closed intervals `[low, high]`.',
          'Always ensure the search space strictly shrinks on every iteration to prevent infinite loops.',
        ],
        conceptMarkdown:
          'Binary Search applies whenever a boolean predicate `P(x)` is **monotonic** across a range (all `False` followed by all `True`). By inspecting the midpoint `mid`, we discard half of the remaining candidates immediately.',
        pythonCode: `def binary_search(nums: list[int], target: int) -> int:
    """
    Classic closed-interval [low, high] Binary Search in O(log N) time.
    """
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
        dryRunArray: [3, 7, 12, 18, 24, 31, 45],
        dryRunSteps: [
          {
            step: 1,
            codeLine: 5,
            variables: { target: '31', low: '0', high: '6', mid: '3 (val=18)' },
            explanation: 'Search [0..6]: mid = 3 has value 18 < 31. Discard left half [0..3].',
            highlightIndices: [3],
          },
          {
            step: 2,
            codeLine: 11,
            variables: { target: '31', low: '4', high: '6', mid: '5 (val=31)' },
            explanation: 'Search [4..6]: mid = (4+6)//2 = 5 has value 31 == target! Return 5.',
            highlightIndices: [5],
          },
        ],
        quiz: {
          id: 'q-501',
          question:
            'In a closed-interval binary search `while low <= high:`, why must we set `low = mid + 1` instead of `low = mid` when `nums[mid] < target`?',
          options: [
            'Because `mid` has already been tested and is strictly less than `target`, and setting `low = mid` can cause an infinite loop when `low == high`.',
            'Because Python integers overflow otherwise.',
            'To make the algorithm run in O(1) time.',
            'Because `nums[mid + 1]` is guaranteed to equal `target`.',
          ],
          correctIndex: 0,
          explanation:
            'Since `nums[mid] != target`, `mid` cannot be the answer. If `low == high` and we set `low = mid`, the interval `[low, high]` never shrinks, causing an infinite loop.',
        },
        linkedVisualizerAlgo: 'binary-search',
        linkedProblemId: 'prob-binary-search',
      },
    ],
  },
  {
    id: 'mod-6-trees-graphs-dp',
    order: 6,
    title: 'Module 6: Trees, Graph Traversals (BFS/DFS) & Dynamic Programming',
    level: 'Advanced',
    description:
      'Traverse hierarchical trees and graphs using Queue-based BFS and recursive/stack DFS, and optimize overlapping subproblems with Dynamic Programming.',
    prerequisites: ['mod-4-stacks-queues', 'mod-5-sorting-binary-search'],
    badgeColor: 'rose',
    lessons: [
      {
        id: 'les-601-bfs-dfs-dp',
        moduleId: 'mod-6-trees-graphs-dp',
        title: '6.1 BFS Level-Order vs. DFS & Overlapping Subproblems',
        durationMin: 18,
        summary:
          'Compare Queue-driven Breadth-First Search (shortest path on unweighted graphs) with Stack/Recursive Depth-First Search and bottom-up DP.',
        timeComplexity: 'Traversal: O(V + E) | 1D DP: O(N)',
        spaceComplexity: 'O(V) queue/recursion stack',
        keyTakeaways: [
          'BFS uses a FIFO Queue (`collections.deque`) to explore nodes layer-by-layer, guaranteeing shortest paths in unweighted graphs.',
          'DFS uses a LIFO Stack (or recursion) to plunge to leaf nodes first—ideal for subtree aggregation, cycle detection, and backtracking.',
          'When recursive tree calls recompute identical states (like `fib(n-1) + fib(n-2)`), memoization or bottom-up DP reduces O(2^N) time to O(N).',
        ],
        conceptMarkdown:
          'Tree and Graph algorithms all share a simple skeleton: a **frontier** container (`Queue` for BFS, `Stack` for DFS) and a `visited` set. When states overlap and satisfy optimal substructure, **Dynamic Programming** caches subproblem results.',
        pythonCode: `def bfs_level_order(adj: dict[int, list[int]], start: int) -> list[int]:
    """
    Breadth-First Search (BFS) traversal order starting from `start`.
    Time: O(V + E) | Space: O(V)
    """
    visited = {start}
    queue = [start]
    order = []
    head = 0
    while head < len(queue):
        curr = queue[head]
        head += 1
        order.append(curr)
        for neighbor in adj.get(curr, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order`,
        dryRunArray: [1, 2, 3, 4, 5, 6, 7],
        dryRunSteps: [
          {
            step: 1,
            codeLine: 6,
            variables: { queue: '[1]', visited: '{1}', order: '[]' },
            explanation: 'Seed FIFO queue with root node 1 and mark 1 visited.',
            highlightIndices: [0],
          },
          {
            step: 2,
            codeLine: 13,
            variables: { curr: '1', queue: '[1, 2, 3]', order: '[1]' },
            explanation: 'Pop 1, enqueue its unvisited children 2 and 3 (Level 1).',
            highlightIndices: [0, 1, 2],
          },
          {
            step: 3,
            codeLine: 13,
            variables: { curr: '2, 3', queue: '[1, 2, 3, 4, 5, 6, 7]', order: '[1, 2, 3, 4, 5, 6, 7]' },
            explanation: 'Process Level 1 nodes (2, 3), enqueue Level 2 leaves (4, 5, 6, 7) in level-by-level order.',
            highlightIndices: [0, 1, 2, 3, 4, 5, 6],
          },
        ],
        quiz: {
          id: 'q-601',
          question:
            'Which traversal strategy guarantees finding the minimum number of edges between a source node and target node in an unweighted graph?',
          options: [
            'Depth-First Search (DFS)',
            'Breadth-First Search (BFS)',
            'Post-order Traversal',
            'Bubble Sort',
          ],
          correctIndex: 1,
          explanation:
            'BFS explores nodes in non-decreasing order of distance (level 0, level 1, level 2...), so the first time it reaches the target node is guaranteed to be via a shortest path.',
        },
        linkedVisualizerAlgo: 'tree-bfs-dfs',
        linkedProblemId: 'prob-climbing-stairs',
      },
    ],
  },
];
