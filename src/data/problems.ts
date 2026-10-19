import { PracticeProblem } from '../types';

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  {
    id: 'prob-two-sum',
    number: 1,
    title: 'Pair Target Lookup (Two Sum)',
    difficulty: 'Easy',
    topic: 'Hash Map',
    pattern: 'Complement Lookup',
    summary: 'Find two distinct indices in an array whose values add up to a target integer in O(N) time.',
    description:
      'Given an array of integers `nums` and an integer `target`, return the 0-based indices `[i, j]` (`i < j`) of the two numbers such that `nums[i] + nums[j] == target`. You may assume that each input has a single valid pair, and you may not use the same element twice.',
    constraints: [
      '2 <= len(nums) <= 10^4',
      '-10^9 <= nums[i], target <= 10^9',
      'Target time complexity: O(N) | Target space complexity: O(N)',
    ],
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'nums[0] + nums[1] == 2 + 7 == 9, so return [0, 1].',
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'nums[1] + nums[2] == 2 + 4 == 6.',
      },
    ],
    functionName: 'two_sum',
    starterCode: `def two_sum(nums, target):
    # Write your O(N) hash map solution below:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    solutionCode: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    hints: [
      'A nested loop checks every pair in O(N²) time. Can you remember elements you have already visited?',
      'For each number `num` at index `i`, the value needed to reach `target` is `complement = target - num`.',
      'Store `seen[num] = i` in a Python dictionary and check `if complement in seen:` before inserting.',
    ],
    optimalTime: 'O(N)',
    optimalSpace: 'O(N)',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    leetcodeTitle: 'LeetCode #1 — Two Sum',
    testCases: [
      { id: 'ts-1', inputDisplay: 'nums = [2, 7, 11, 15], target = 9', argsJson: '[[2, 7, 11, 15], 9]', expectedJson: '[0, 1]' },
      { id: 'ts-2', inputDisplay: 'nums = [3, 2, 4], target = 6', argsJson: '[[3, 2, 4], 6]', expectedJson: '[1, 2]' },
      { id: 'ts-3', inputDisplay: 'nums = [3, 3], target = 6', argsJson: '[[3, 3], 6]', expectedJson: '[0, 1]' },
      { id: 'ts-4', inputDisplay: 'nums = [-4, 1, 8, 5], target = 1', argsJson: '[[-4, 1, 8, 5], 1]', expectedJson: '[0, 3]', isHidden: true },
    ],
  },
  {
    id: 'prob-valid-parentheses',
    number: 2,
    title: 'Balanced Delimiter Validator',
    difficulty: 'Easy',
    topic: 'Stacks',
    pattern: 'LIFO Stack',
    summary: 'Verify whether a string of nested brackets (), {}, [] is properly balanced and closed in order.',
    description:
      'Given a string `s` containing only the characters `(`, `)`, `{`, `}`, `[` and `]`, return `True` if the input string is valid, or `False` otherwise. Open brackets must be closed by the same type of bracket in the correct LIFO order.',
    constraints: ['1 <= len(s) <= 10^4', 's consists only of parentheses characters "()[]{}"'],
    examples: [
      { input: 's = "({[]})"', output: 'True', explanation: 'Every opening bracket is closed in reverse LIFO order.' },
      { input: 's = "([)]"', output: 'False', explanation: 'The inner "[" is closed after ")" which violates nesting.' },
    ],
    functionName: 'is_valid_parentheses',
    starterCode: `def is_valid_parentheses(s):
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
    solutionCode: `def is_valid_parentheses(s):
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
    hints: [
      'Push every opening bracket onto a stack list.',
      'When you see a closing bracket, check if the stack is non-empty and its top element (`stack[-1]`) matches.',
      'Return `len(stack) == 0` after the loop so unclosed brackets return `False`.',
    ],
    optimalTime: 'O(N)',
    optimalSpace: 'O(N)',
    leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
    leetcodeTitle: 'LeetCode #20 — Valid Parentheses',
    testCases: [
      { id: 'vp-1', inputDisplay: 's = "()"', argsJson: '["()"]', expectedJson: 'true' },
      { id: 'vp-2', inputDisplay: 's = "()[]{}"', argsJson: '["()[]{}"]', expectedJson: 'true' },
      { id: 'vp-3', inputDisplay: 's = "(]"', argsJson: '["(]"]', expectedJson: 'false' },
      { id: 'vp-4', inputDisplay: 's = "({[]})"', argsJson: '["({[]})"]', expectedJson: 'true', isHidden: true },
    ],
  },
  {
    id: 'prob-binary-search',
    number: 3,
    title: 'Sorted Array Target Search',
    difficulty: 'Easy',
    topic: 'Binary Search',
    pattern: 'Divide & Conquer',
    summary: 'Locate the index of a target integer in a sorted array in O(log N) comparisons.',
    description:
      'Given an array of integers `nums` sorted in ascending order and an integer `target`, write a function `binary_search(nums, target)` to search for `target`. If `target` exists, return its 0-based index; otherwise, return `-1`.',
    constraints: ['1 <= len(nums) <= 10^4', 'All integers in nums are unique and sorted in ascending order.'],
    examples: [
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', output: '4' },
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', output: '-1' },
    ],
    functionName: 'binary_search',
    starterCode: `def binary_search(nums, target):
    low = 0
    high = len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
    solutionCode: `def binary_search(nums, target):
    low = 0
    high = len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
    hints: [
      'Initialize `low = 0` and `high = len(nums) - 1`.',
      'Compute `mid = (low + high) // 2` on each iteration of `while low <= high:`.',
      'Adjust `low = mid + 1` or `high = mid - 1` depending on how `nums[mid]` compares to `target`.',
    ],
    optimalTime: 'O(log N)',
    optimalSpace: 'O(1)',
    leetcodeUrl: 'https://leetcode.com/problems/binary-search/',
    leetcodeTitle: 'LeetCode #704 — Binary Search',
    testCases: [
      { id: 'bs-1', inputDisplay: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', argsJson: '[[-1, 0, 3, 5, 9, 12], 9]', expectedJson: '4' },
      { id: 'bs-2', inputDisplay: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', argsJson: '[[-1, 0, 3, 5, 9, 12], 2]', expectedJson: '-1' },
      { id: 'bs-3', inputDisplay: 'nums = [5], target = 5', argsJson: '[[5], 5]', expectedJson: '0' },
    ],
  },
  {
    id: 'prob-valid-palindrome',
    number: 4,
    title: 'Two-Pointer Array Reversal & Symmetry',
    difficulty: 'Easy',
    topic: 'Two Pointers',
    pattern: 'Converging Pointers',
    summary: 'Use converging left and right pointers to check if an integer sequence is a palindrome in O(1) extra space.',
    description:
      'Given a list of integers `nums`, return `True` if the sequence reads the same forward and backward, and `False` otherwise, using O(1) extra memory via two pointers.',
    constraints: ['1 <= len(nums) <= 10^5', 'Space complexity must be O(1).'],
    examples: [
      { input: 'nums = [1, 4, 7, 4, 1]', output: 'True' },
      { input: 'nums = [1, 2, 3, 1]', output: 'False' },
    ],
    functionName: 'is_palindrome_array',
    starterCode: `def is_palindrome_array(nums):
    left = 0
    right = len(nums) - 1
    while left < right:
        if nums[left] != nums[right]:
            return False
        left += 1
        right -= 1
    return True`,
    solutionCode: `def is_palindrome_array(nums):
    left = 0
    right = len(nums) - 1
    while left < right:
        if nums[left] != nums[right]:
            return False
        left += 1
        right -= 1
    return True`,
    hints: [
      'Place `left = 0` at the start and `right = len(nums) - 1` at the end.',
      'Compare `nums[left]` and `nums[right]` while `left < right`.',
    ],
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
    leetcodeTitle: 'LeetCode #167 — Two Pointers Reference',
    testCases: [
      { id: 'pal-1', inputDisplay: 'nums = [1, 4, 7, 4, 1]', argsJson: '[[1, 4, 7, 4, 1]]', expectedJson: 'true' },
      { id: 'pal-2', inputDisplay: 'nums = [1, 2, 3, 1]', argsJson: '[[1, 2, 3, 1]]', expectedJson: 'false' },
      { id: 'pal-3', inputDisplay: 'nums = [42]', argsJson: '[[42]]', expectedJson: 'true' },
    ],
  },
  {
    id: 'prob-max-subarray',
    number: 5,
    title: 'Maximum Contiguous Subarray Sum (Kadane)',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    pattern: "Kadane's Algorithm",
    summary: 'Find the contiguous non-empty subarray with the largest sum in a single O(N) pass.',
    description:
      'Given an integer array `nums`, find the contiguous non-empty subarray which has the largest sum and return its sum. At each element `x`, decide whether to extend the previous subarray sum (`curr_sum + x`) or start fresh at `x`.',
    constraints: ['1 <= len(nums) <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      {
        input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        output: '6',
        explanation: 'The subarray [4, -1, 2, 1] has the largest sum 6.',
      },
      { input: 'nums = [5, 4, -1, 7, 8]', output: '23' },
    ],
    functionName: 'max_subarray',
    starterCode: `def max_subarray(nums):
    curr_sum = nums[0]
    best_sum = nums[0]
    for i in range(1, len(nums)):
        num = nums[i]
        curr_sum = max(num, curr_sum + num)
        best_sum = max(best_sum, curr_sum)
    return best_sum`,
    solutionCode: `def max_subarray(nums):
    curr_sum = nums[0]
    best_sum = nums[0]
    for i in range(1, len(nums)):
        num = nums[i]
        curr_sum = max(num, curr_sum + num)
        best_sum = max(best_sum, curr_sum)
    return best_sum`,
    hints: [
      'If the running subarray sum `curr_sum` becomes negative, adding it to the next number only makes the next sum smaller.',
      'Maintain `curr_sum = max(num, curr_sum + num)` and `best_sum = max(best_sum, curr_sum)`.',
    ],
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/',
    leetcodeTitle: 'LeetCode #53 — Maximum Subarray',
    testCases: [
      { id: 'ms-1', inputDisplay: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', argsJson: '[[-2, 1, -3, 4, -1, 2, 1, -5, 4]]', expectedJson: '6' },
      { id: 'ms-2', inputDisplay: 'nums = [1]', argsJson: '[[1]]', expectedJson: '1' },
      { id: 'ms-3', inputDisplay: 'nums = [5, 4, -1, 7, 8]', argsJson: '[[5, 4, -1, 7, 8]]', expectedJson: '23' },
      { id: 'ms-4', inputDisplay: 'nums = [-5, -2, -9]', argsJson: '[[-5, -2, -9]]', expectedJson: '-2', isHidden: true },
    ],
  },
  {
    id: 'prob-climbing-stairs',
    number: 6,
    title: 'Staircase Distinct Ways (1D DP)',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    pattern: 'Fibonacci State Transition',
    summary: 'Count distinct ways to reach step N taking 1 or 2 steps at a time using O(1) space DP.',
    description:
      'You are climbing a staircase with `n` steps. Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
    constraints: ['1 <= n <= 45', 'Target time: O(N) | Target space: O(1)'],
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 or 2.' },
      { input: 'n = 5', output: '8', explanation: 'Ways follow 1, 2, 3, 5, 8.' },
    ],
    functionName: 'climb_stairs',
    starterCode: `def climb_stairs(n):
    if n <= 2:
        return n
    prev2 = 1
    prev1 = 2
    for _ in range(3, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    return prev1`,
    solutionCode: `def climb_stairs(n):
    if n <= 2:
        return n
    prev2 = 1
    prev1 = 2
    for _ in range(3, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    return prev1`,
    hints: [
      'To reach step `i`, your last move was either a 1-step from `i - 1` or a 2-step from `i - 2`.',
      'Therefore `ways(i) = ways(i - 1) + ways(i - 2)`. Track only the last two values for O(1) space.',
    ],
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
    leetcodeTitle: 'LeetCode #70 — Climbing Stairs',
    testCases: [
      { id: 'cs-1', inputDisplay: 'n = 2', argsJson: '[2]', expectedJson: '2' },
      { id: 'cs-2', inputDisplay: 'n = 3', argsJson: '[3]', expectedJson: '3' },
      { id: 'cs-3', inputDisplay: 'n = 5', argsJson: '[5]', expectedJson: '8' },
      { id: 'cs-4', inputDisplay: 'n = 10', argsJson: '[10]', expectedJson: '89', isHidden: true },
    ],
  },
  {
    id: 'prob-coin-change',
    number: 7,
    title: 'Minimum Coins for Target Amount',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    pattern: 'Unbounded Knapsack DP',
    summary: 'Compute the fewest coins needed to make up a target amount using bottom-up tabulation.',
    description:
      'You are given an integer array `coins` representing coin denominations and an integer `amount`. Return the fewest number of coins needed to make up `amount`. If that amount cannot be made up by any combination of the coins, return `-1`.',
    constraints: ['1 <= len(coins) <= 12', '0 <= amount <= 10^4'],
    examples: [
      { input: 'coins = [1, 2, 5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1 (3 coins).' },
      { input: 'coins = [2], amount = 3', output: '-1' },
    ],
    functionName: 'coin_change',
    starterCode: `def coin_change(coins, amount):
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                if dp[a - c] + 1 < dp[a]:
                    dp[a] = dp[a - c] + 1
    if dp[amount] > amount:
        return -1
    return dp[amount]`,
    solutionCode: `def coin_change(coins, amount):
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                if dp[a - c] + 1 < dp[a]:
                    dp[a] = dp[a - c] + 1
    if dp[amount] > amount:
        return -1
    return dp[amount]`,
    hints: [
      'Create a DP array `dp` of size `amount + 1` initialized to `amount + 1` (acting as infinity), with `dp[0] = 0`.',
      'For each sub-amount `a` from `1` to `amount`, try every coin `c`: if `a >= c`, update `dp[a] = min(dp[a], dp[a - c] + 1)`.',
    ],
    optimalTime: 'O(amount * len(coins))',
    optimalSpace: 'O(amount)',
    leetcodeUrl: 'https://leetcode.com/problems/coin-change/',
    leetcodeTitle: 'LeetCode #322 — Coin Change',
    testCases: [
      { id: 'cc-1', inputDisplay: 'coins = [1, 2, 5], amount = 11', argsJson: '[[1, 2, 5], 11]', expectedJson: '3' },
      { id: 'cc-2', inputDisplay: 'coins = [2], amount = 3', argsJson: '[[2], 3]', expectedJson: '-1' },
      { id: 'cc-3', inputDisplay: 'coins = [1], amount = 0', argsJson: '[[1], 0]', expectedJson: '0' },
    ],
  },
  {
    id: 'prob-trapping-rain-water',
    number: 8,
    title: 'Elevation Map Rain Water Trapping',
    difficulty: 'Hard',
    topic: 'Two Pointers',
    pattern: 'Prefix/Suffix Boundary Pointers',
    summary: 'Compute how many units of rainwater can be trapped between elevation bars in O(N) time and O(1) space.',
    description:
      'Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.',
    constraints: ['1 <= len(height) <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: '6 units of rainwater are trapped between the elevation peaks.',
      },
      { input: 'height = [4,2,0,3,2,5]', output: '9' },
    ],
    functionName: 'trap_rain_water',
    starterCode: `def trap_rain_water(height):
    if not height:
        return 0
    left = 0
    right = len(height) - 1
    left_max = height[left]
    right_max = height[right]
    water = 0
    while left < right:
        if left_max <= right_max:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]
    return water`,
    solutionCode: `def trap_rain_water(height):
    if not height:
        return 0
    left = 0
    right = len(height) - 1
    left_max = height[left]
    right_max = height[right]
    water = 0
    while left < right:
        if left_max <= right_max:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]
    return water`,
    hints: [
      'Water trapped at any index `i` is bounded by `min(max_left[i], max_right[i]) - height[i]`.',
      'With two pointers `left` and `right`, whichever side has the smaller running maximum (`left_max <= right_max`) determines the bottleneck height for that side immediately in O(1) space.',
    ],
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)',
    leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/',
    leetcodeTitle: 'LeetCode #42 — Trapping Rain Water',
    testCases: [
      { id: 'tr-1', inputDisplay: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', argsJson: '[[0,1,0,2,1,0,1,3,2,1,2,1]]', expectedJson: '6' },
      { id: 'tr-2', inputDisplay: 'height = [4,2,0,3,2,5]', argsJson: '[[4,2,0,3,2,5]]', expectedJson: '9' },
      { id: 'tr-3', inputDisplay: 'height = [2,0,2]', argsJson: '[[2,0,2]]', expectedJson: '2' },
    ],
  },
];
