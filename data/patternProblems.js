const PATTERN_PROBLEMS = [
  {
    id: "two-sum-ii",
    title: "Two Sum II - Sorted Array Pair",
    problemStatement: "Given a 1-indexed array of integers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.",
    difficulty: "Easy",
    pattern: "Two Pointers",
    clues: [
      { id: "c1", text: "Array is sorted in non-decreasing order", detectedSignal: "●●●●●" },
      { id: "c2", text: "Target sum of exactly two elements", detectedSignal: "●●●●" },
      { id: "c3", text: "Requires O(1) auxiliary space limit", detectedSignal: "●●●" }
    ],
    hints: [
      "Since the array is sorted, what happens to the sum if you increment the smaller pointer?",
      "If the sum of current pair is greater than the target, which element MUST be reduced?"
    ],
    options: [
      { id: "hashing", name: "Hashing (Hash Map)", isCorrect: false, feedback: "Possible in O(N) space, but it ignores the key fact that the array is already sorted." },
      { id: "two-pointers", name: "Two Pointers", isCorrect: true, feedback: "Good choice. The array is sorted, so we can use its ordering to eliminate possibilities in O(1) space." },
      { id: "bfs", name: "Breadth-First Search (BFS)", isCorrect: false, feedback: "BFS is designed for graphs/matrices shortest paths, not array pair matching." },
      { id: "recursion", name: "Recursion / Backtracking", isCorrect: false, feedback: "Generates unnecessary subsets and takes exponential time." }
    ],
    correctPattern: "Two Pointers",
    explanation: "The array is sorted, so we can place L at index 0 and R at the last index. If numbers[L] + numbers[R] > target, decrementing R predictably reduces the sum."
  },
  {
    id: "max-subarray-sum-k",
    title: "Maximum Sum Subarray of Size K",
    problemStatement: "Given an array of positive integers and a positive integer K, find the maximum sum of any contiguous subarray of size K.",
    difficulty: "Easy",
    pattern: "Sliding Window",
    clues: [
      { id: "c1", text: "Contiguous subarray segment", detectedSignal: "●●●●●" },
      { id: "c2", text: "Fixed window size K", detectedSignal: "●●●●" },
      { id: "c3", text: "Overlapping sum calculations", detectedSignal: "●●●" }
    ],
    hints: [
      "When moving from subarray [0..K-1] to [1..K], which element leaves and which element enters?",
      "Can we recompute the sum in O(1) instead of recalculating all K elements?"
    ],
    options: [
      { id: "sliding-window", name: "Sliding Window", isCorrect: true, feedback: "Good choice. Maintain a running window sum of size K by adding the incoming element and subtracting the outgoing element." },
      { id: "binary-search", name: "Binary Search", isCorrect: false, feedback: "Binary search requires a monotonic search space. Contiguous windows don't offer a half-space elimination property here." },
      { id: "prefix-sum", name: "Prefix Sum", isCorrect: false, feedback: "Prefix sums work in O(N), but Sliding Window achieves O(1) extra space without allocating a prefix array." },
      { id: "stack", name: "Monotonic Stack", isCorrect: false, feedback: "Monotonic stacks are for next greater/smaller element queries, not fixed window sums." }
    ],
    correctPattern: "Sliding Window",
    explanation: "Since the window size K is contiguous and fixed, sliding the window right by 1 index adds numbers[i] and subtracts numbers[i-K] in O(1) time per step."
  },
  {
    id: "contains-duplicate",
    title: "Contains Duplicate in Unsorted Array",
    problemStatement: "Given an unsorted integer array nums, return true if any value appears at least twice in the array, and false if every element is distinct.",
    difficulty: "Easy",
    pattern: "Hashing",
    clues: [
      { id: "c1", text: "Unsorted array with random order", detectedSignal: "●●●●" },
      { id: "c2", text: "Fast membership / lookup query", detectedSignal: "●●●●●" },
      { id: "c3", text: "O(N) time constraint preferred", detectedSignal: "●●●" }
    ],
    hints: [
      "What data structure gives O(1) average time complexity for checking whether an item was seen before?",
      "Could we trade a small amount of extra space for speed?"
    ],
    options: [
      { id: "two-pointers", name: "Two Pointers", isCorrect: false, feedback: "Two pointers requires sorted data to know which direction to move pointers predictably." },
      { id: "hashing", name: "Hashing (Hash Set)", isCorrect: true, feedback: "Good choice. Inserting each element into a Hash Set allows checking duplicates in O(1) average time." },
      { id: "dfs", name: "Depth-First Search (DFS)", isCorrect: false, feedback: "DFS is for tree/graph traversals, not simple array lookup." },
      { id: "prefix-sum", name: "Prefix Sum", isCorrect: false, feedback: "Prefix sums accumulate totals, which does not help with uniqueness checking." }
    ],
    correctPattern: "Hashing",
    explanation: "A Hash Set allows us to record previously seen numbers and query existence in O(1) average time, achieving an O(N) overall solution."
  },
  {
    id: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    problemStatement: "Given an integer array nums sorted in ascending order (with distinct values) that is rotated at an unknown pivot, find the index of a given target in O(log N) time.",
    difficulty: "Medium",
    pattern: "Binary Search",
    clues: [
      { id: "c1", text: "Sorted array cut/rotated into two sorted halves", detectedSignal: "●●●●●" },
      { id: "c2", text: "O(log N) time requirement", detectedSignal: "●●●●●" },
      { id: "c3", text: "At least one half [L..M] or [M..R] is always normally sorted", detectedSignal: "●●●●" }
    ],
    hints: [
      "Any midpoint M divides the rotated array such that AT LEAST ONE half is completely sorted.",
      "Check if the target falls within the bounds of the sorted half to eliminate 50% of elements."
    ],
    options: [
      { id: "binary-search", name: "Binary Search", isCorrect: true, feedback: "Good choice. By identifying which half of the array is normally sorted, we can eliminate half the search space in O(log N)." },
      { id: "two-pointers", name: "Two Pointers", isCorrect: false, feedback: "Two Pointers takes O(N) linear time, failing the O(log N) requirement." },
      { id: "bfs", name: "BFS Traversal", isCorrect: false, feedback: "BFS is unnecessary for linear array searching." },
      { id: "stack", name: "Monotonic Stack", isCorrect: false, feedback: "Stacks process elements sequentially and cannot provide O(log N) random access bounds." }
    ],
    correctPattern: "Binary Search",
    explanation: "Even after rotation, one half of the array divided by midpoint M is guaranteed to be strictly sorted. We check if target lies within that half to halve the range."
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses Matching",
    problemStatement: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid (open brackets must be closed by the same type in correct LIFO order).",
    difficulty: "Easy",
    pattern: "Stack",
    clues: [
      { id: "c1", text: "Nested structural matching", detectedSignal: "●●●●●" },
      { id: "c2", text: "Last-In, First-Out (LIFO) closure order", detectedSignal: "●●●●●" },
      { id: "c3", text: "Immediate match required for most recent open bracket", detectedSignal: "●●●●" }
    ],
    hints: [
      "When you encounter a closing bracket ')', which open bracket should it match?",
      "Which data structure remembers the most recently added item first?"
    ],
    options: [
      { id: "stack", name: "Stack", isCorrect: true, feedback: "Good choice. Push opening brackets onto a stack; when a closing bracket appears, pop and verify it matches the top." },
      { id: "sliding-window", name: "Sliding Window", isCorrect: false, feedback: "Substrings with parentheses depend on nesting depth, not fixed contiguous boundaries." },
      { id: "hashing", name: "Hash Set", isCorrect: false, feedback: "A set loses track of character order and nesting depth." },
      { id: "dfs", name: "Depth-First Search", isCorrect: false, feedback: "While recursive call stacks behave like stacks, an explicit stack data structure is cleaner and faster here." }
    ],
    correctPattern: "Stack",
    explanation: "Parentheses rules enforce that the most recently opened bracket must be closed first (LIFO). A stack perfectly models this behavior."
  },
  {
    id: "range-sum-query",
    title: "Immutable Range Sum Query",
    problemStatement: "Given an integer array nums, handle multiple queries of calculating the sum of elements between indices left and right inclusive in O(1) time per query.",
    difficulty: "Easy",
    pattern: "Prefix Sum",
    clues: [
      { id: "c1", text: "Multiple sum queries over fixed array", detectedSignal: "●●●●●" },
      { id: "c2", text: "O(1) time per query requirement", detectedSignal: "●●●●●" },
      { id: "c3", text: "Sum(left..right) = Prefix[right+1] - Prefix[left]", detectedSignal: "●●●●" }
    ],
    hints: [
      "Instead of summing numbers from left to right on every query, can we precompute cumulative totals?",
      "How can total sum from 0 to R minus total sum from 0 to L-1 give the range sum?"
    ],
    options: [
      { id: "prefix-sum", name: "Prefix Sum", isCorrect: true, feedback: "Good choice. Precomputing a cumulative prefix sum array allows answering range queries in O(1) time." },
      { id: "two-pointers", name: "Two Pointers", isCorrect: false, feedback: "Summing elements between two pointers on each query would take O(N) per query." },
      { id: "binary-search", name: "Binary Search", isCorrect: false, feedback: "Binary search helps find indices, not compute range totals in O(1)." },
      { id: "bfs", name: "BFS", isCorrect: false, feedback: "Graph traversal is irrelevant for simple array range sums." }
    ],
    correctPattern: "Prefix Sum",
    explanation: "By precalculating CumulativeSum[i] = nums[0] + ... + nums[i], any range sum [L..R] is evaluated instantly as CumulativeSum[R] - CumulativeSum[L-1]."
  },
  {
    id: "shortest-path-binary-matrix",
    title: "Shortest Path in Binary Matrix",
    problemStatement: "Given an N x N binary matrix grid, return the length of the shortest clear path from top-left (0,0) to bottom-right (N-1,N-1) moving in 8 directions.",
    difficulty: "Medium",
    pattern: "BFS",
    clues: [
      { id: "c1", text: "Unweighted grid / equal-cost step transitions", detectedSignal: "●●●●●" },
      { id: "c2", text: "Shortest path / minimum steps requirement", detectedSignal: "●●●●●" },
      { id: "c3", text: "Level-by-level radial expansion", detectedSignal: "●●●●" }
    ],
    hints: [
      "Which graph traversal explores all neighbor cells at distance 1 before moving to distance 2?",
      "Does BFS or DFS guarantee finding the shortest path first in unweighted grids?"
    ],
    options: [
      { id: "bfs", name: "Breadth-First Search (BFS)", isCorrect: true, feedback: "Good choice. BFS explores nodes level by level (layer by layer), guaranteeing the shortest path in unweighted graphs." },
      { id: "dfs", name: "Depth-First Search (DFS)", isCorrect: false, feedback: "DFS explores deep paths first and might find a very long roundabout path before finding the shortest one." },
      { id: "two-pointers", name: "Two Pointers", isCorrect: false, feedback: "Two pointers is for linear 1D arrays, not 2D grid graphs." },
      { id: "sliding-window", name: "Sliding Window", isCorrect: false, feedback: "Sliding window works on contiguous 1D subsegments, not 2D matrix paths." }
    ],
    correctPattern: "BFS",
    explanation: "In an unweighted grid where each move costs 1 step, Breadth-First Search radiates outward in concentric circles, ensuring the first arrival at the destination is optimal."
  },
  {
    id: "number-of-islands",
    title: "Number of Islands in 2D Grid",
    problemStatement: "Given an m x n 2D binary grid representing a map of '1's (land) and '0's (water), return the number of islands (connected land cells horizontally or vertically).",
    difficulty: "Medium",
    pattern: "DFS",
    clues: [
      { id: "c1", text: "Connected components traversal", detectedSignal: "●●●●●" },
      { id: "c2", text: "Need to visit and mark all reachable land cells", detectedSignal: "●●●●" },
      { id: "c3", text: "Grid state mutation (sinking land '1' -> '0')", detectedSignal: "●●●" }
    ],
    hints: [
      "When you discover a land cell '1', how can you recursively visit all adjacent land cells until the entire island is marked?",
      "Can we sink (change '1' to '0') visited cells to avoid counting them again?"
    ],
    options: [
      { id: "dfs", name: "Depth-First Search (DFS)", isCorrect: true, feedback: "Good choice. Recursively exploring as deep as possible Marks all connected land cells of one island before starting the next." },
      { id: "binary-search", name: "Binary Search", isCorrect: false, feedback: "Grids with irregular land masses lack monotonicity for binary search." },
      { id: "prefix-sum", name: "Prefix Sum", isCorrect: false, feedback: "Prefix sums accumulate numbers, but islands are irregular connected shapes." },
      { id: "stack", name: "Monotonic Stack", isCorrect: false, feedback: "Not designed for 2D connectivity exploration." }
    ],
    correctPattern: "DFS",
    explanation: "DFS naturally traverses connected components. Once a '1' is found, DFS recursively sinks all connected land cells, allowing us to increment island count by 1."
  }
];

module.exports = PATTERN_PROBLEMS;
