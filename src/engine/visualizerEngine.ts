import { AlgoId, AlgorithmMeta, VisualizerFrame, GraphNodeState, GraphEdgeState } from '../types';

export const ALGORITHMS_META: Record<AlgoId, AlgorithmMeta> = {
  'bubble-sort': {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'Sorting',
    timeBest: 'O(N)',
    timeAvg: 'O(N²)',
    timeWorst: 'O(N²)',
    spaceWorst: 'O(1)',
    stable: true,
    summary:
      'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are out of order. An early-exit flag stops in O(N) if already sorted.',
    pythonCode: [
      'def bubble_sort(arr: list[int]) -> list[int]:',
      '    n = len(arr)',
      '    for i in range(n):',
      '        swapped = False',
      '        for j in range(0, n - i - 1):',
      '            if arr[j] > arr[j + 1]:',
      '                arr[j], arr[j + 1] = arr[j + 1], arr[j]',
      '                swapped = True',
      '        if not swapped: break',
      '    return arr',
    ],
  },
  'insertion-sort': {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'Sorting',
    timeBest: 'O(N)',
    timeAvg: 'O(N²)',
    timeWorst: 'O(N²)',
    spaceWorst: 'O(1)',
    stable: true,
    summary:
      'Builds a sorted prefix one element at a time by shifting larger elements right and inserting the key into its correct position.',
    pythonCode: [
      'def insertion_sort(arr: list[int]) -> list[int]:',
      '    for i in range(1, len(arr)):',
      '        key = arr[i]',
      '        j = i - 1',
      '        while j >= 0 and arr[j] > key:',
      '            arr[j + 1] = arr[j]',
      '            j -= 1',
      '        arr[j + 1] = key',
      '    return arr',
    ],
  },
  'selection-sort': {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'Sorting',
    timeBest: 'O(N²)',
    timeAvg: 'O(N²)',
    timeWorst: 'O(N²)',
    spaceWorst: 'O(1)',
    stable: false,
    summary:
      'Scans the unsorted suffix on each pass to locate the minimum element and swaps it into the front of the unsorted region.',
    pythonCode: [
      'def selection_sort(arr: list[int]) -> list[int]:',
      '    n = len(arr)',
      '    for i in range(n):',
      '        min_idx = i',
      '        for j in range(i + 1, n):',
      '            if arr[j] < arr[min_idx]:',
      '                min_idx = j',
      '        arr[i], arr[min_idx] = arr[min_idx], arr[i]',
      '    return arr',
    ],
  },
  'quick-sort': {
    id: 'quick-sort',
    name: 'Quick Sort (Lomuto Partition)',
    category: 'Sorting',
    timeBest: 'O(N log N)',
    timeAvg: 'O(N log N)',
    timeWorst: 'O(N²)',
    spaceWorst: 'O(log N)',
    stable: false,
    summary:
      'Divide-and-conquer sort that chooses a pivot, partitions smaller elements to its left and larger elements to its right, then recursively sorts both sides.',
    pythonCode: [
      'def quick_sort(arr: list[int], low: int, high: int):',
      '    if low < high:',
      '        pivot = arr[high]',
      '        i = low - 1',
      '        for j in range(low, high):',
      '            if arr[j] <= pivot:',
      '                i += 1; arr[i], arr[j] = arr[j], arr[i]',
      '        arr[i + 1], arr[high] = arr[high], arr[i + 1]',
      '        quick_sort(arr, low, i); quick_sort(arr, i + 2, high)',
    ],
  },
  'binary-search': {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'Searching',
    timeBest: 'O(1)',
    timeAvg: 'O(log N)',
    timeWorst: 'O(log N)',
    spaceWorst: 'O(1)',
    stable: true,
    summary:
      'Repeatedly halves a sorted search interval [low, high] by comparing the midpoint value against the target in O(log N) time.',
    pythonCode: [
      'def binary_search(arr: list[int], target: int) -> int:',
      '    low, high = 0, len(arr) - 1',
      '    while low <= high:',
      '        mid = (low + high) // 2',
      '        if arr[mid] == target:',
      '            return mid',
      '        elif arr[mid] < target:',
      '            low = mid + 1',
      '        else:',
      '            high = mid - 1',
      '    return -1',
    ],
  },
  'tree-bfs-dfs': {
    id: 'tree-bfs-dfs',
    name: 'Binary Tree / Graph BFS & DFS',
    category: 'Trees & Graphs',
    timeBest: 'O(V + E)',
    timeAvg: 'O(V + E)',
    timeWorst: 'O(V + E)',
    spaceWorst: 'O(V)',
    stable: true,
    summary:
      'Visualizes level-order Breadth-First Search (FIFO Queue) and Depth-First Search (LIFO Stack) across a 7-node hierarchical graph.',
    pythonCode: [
      'def traverse_graph(adj: dict[int, list[int]], root: int, mode: str):',
      '    frontier = [root]  # Queue (BFS) or Stack (DFS)',
      '    visited, order = {root}, []',
      '    while frontier:',
      '        curr = frontier.pop(0) if mode == "BFS" else frontier.pop()',
      '        order.append(curr)',
      '        for nxt in adj[curr]:',
      '            if nxt not in visited:',
      '                visited.add(nxt); frontier.append(nxt)',
      '    return order',
    ],
  },
};

export function generateBubbleSortFrames(input: number[]): VisualizerFrame[] {
  const arr = [...input];
  const n = arr.length;
  const frames: VisualizerFrame[] = [];
  const sortedSet = new Set<number>();
  let comparisons = 0;
  let swaps = 0;

  frames.push({
    stepIndex: 0,
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    pointers: {},
    codeLine: 1,
    explanation: `Initial array with ${n} elements ready for Bubble Sort.`,
    comparisons: 0,
    writesOrSwaps: 0,
  });

  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      frames.push({
        stepIndex: frames.length,
        array: [...arr],
        comparing: [j, j + 1],
        swapping: [],
        sorted: Array.from(sortedSet),
        pointers: { i, j, 'j+1': j + 1 },
        codeLine: 6,
        explanation: `Compare arr[${j}] = ${arr[j]} and arr[${j + 1}] = ${arr[j + 1]}.`,
        comparisons,
        writesOrSwaps: swaps,
      });

      if (arr[j] > arr[j + 1]) {
        const tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
        swapped = true;
        swaps++;
        frames.push({
          stepIndex: frames.length,
          array: [...arr],
          comparing: [],
          swapping: [j, j + 1],
          sorted: Array.from(sortedSet),
          pointers: { i, j, 'j+1': j + 1 },
          codeLine: 7,
          explanation: `Swap ${arr[j + 1]} and ${arr[j]} because ${arr[j + 1]} > ${arr[j]}.`,
          comparisons,
          writesOrSwaps: swaps,
        });
      }
    }
    sortedSet.add(n - i - 1);
    if (!swapped) {
      for (let k = 0; k < n; k++) sortedSet.add(k);
      frames.push({
        stepIndex: frames.length,
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: Array.from(sortedSet),
        pointers: { i },
        codeLine: 9,
        explanation: `No swaps occurred during pass ${i + 1}; early-exit optimization triggered!`,
        comparisons,
        writesOrSwaps: swaps,
      });
      break;
    }
  }

  for (let k = 0; k < n; k++) sortedSet.add(k);
  frames.push({
    stepIndex: frames.length,
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from(sortedSet),
    pointers: {},
    codeLine: 10,
    explanation: `Bubble Sort complete! Sorted ${n} elements with ${comparisons} comparisons and ${swaps} swaps.`,
    comparisons,
    writesOrSwaps: swaps,
  });
  return frames;
}

export function generateInsertionSortFrames(input: number[]): VisualizerFrame[] {
  const arr = [...input];
  const n = arr.length;
  const frames: VisualizerFrame[] = [];
  let comparisons = 0;
  let writes = 0;

  frames.push({
    stepIndex: 0,
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [0],
    pointers: { i: 1 },
    codeLine: 1,
    explanation: `Start Insertion Sort: index 0 (${arr[0]}) forms the initial sorted prefix.`,
    comparisons: 0,
    writesOrSwaps: 0,
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    frames.push({
      stepIndex: frames.length,
      array: [...arr],
      comparing: [i],
      swapping: [],
      sorted: Array.from({ length: i }, (_, idx) => idx),
      pointers: { i, j },
      codeLine: 3,
      explanation: `Select key = ${key} at index ${i} to insert into sorted prefix [0..${i - 1}].`,
      comparisons,
      writesOrSwaps: writes,
    });

    while (j >= 0) {
      comparisons++;
      frames.push({
        stepIndex: frames.length,
        array: [...arr],
        comparing: [j, j + 1],
        swapping: [],
        sorted: Array.from({ length: i }, (_, idx) => idx),
        pointers: { i, j },
        codeLine: 5,
        explanation: `Compare sorted prefix element arr[${j}] = ${arr[j]} with key = ${key}.`,
        comparisons,
        writesOrSwaps: writes,
      });

      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        writes++;
        frames.push({
          stepIndex: frames.length,
          array: [...arr],
          comparing: [],
          swapping: [j, j + 1],
          sorted: Array.from({ length: i }, (_, idx) => idx),
          pointers: { i, j },
          codeLine: 6,
          explanation: `Shift ${arr[j]} right to index ${j + 1} because ${arr[j]} > ${key}.`,
          comparisons,
          writesOrSwaps: writes,
        });
        j--;
      } else {
        break;
      }
    }
    arr[j + 1] = key;
    writes++;
    frames.push({
      stepIndex: frames.length,
      array: [...arr],
      comparing: [],
      swapping: [j + 1],
      sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
      pointers: { i, insertAt: j + 1 },
      codeLine: 8,
      explanation: `Insert key = ${key} at index ${j + 1}. Prefix [0..${i}] is now sorted.`,
      comparisons,
      writesOrSwaps: writes,
    });
  }

  frames.push({
    stepIndex: frames.length,
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, idx) => idx),
    pointers: {},
    codeLine: 9,
    explanation: `Insertion Sort complete with ${comparisons} comparisons and ${writes} array writes.`,
    comparisons,
    writesOrSwaps: writes,
  });
  return frames;
}

export function generateSelectionSortFrames(input: number[]): VisualizerFrame[] {
  const arr = [...input];
  const n = arr.length;
  const frames: VisualizerFrame[] = [];
  let comparisons = 0;
  let swaps = 0;

  frames.push({
    stepIndex: 0,
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    pointers: {},
    codeLine: 1,
    explanation: `Start Selection Sort across ${n} elements.`,
    comparisons: 0,
    writesOrSwaps: 0,
  });

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      frames.push({
        stepIndex: frames.length,
        array: [...arr],
        comparing: [minIdx, j],
        swapping: [],
        sorted: Array.from({ length: i }, (_, idx) => idx),
        pointers: { i, min: minIdx, j },
        codeLine: 6,
        explanation: `Compare current minimum arr[${minIdx}] = ${arr[minIdx]} with arr[${j}] = ${arr[j]}.`,
        comparisons,
        writesOrSwaps: swaps,
      });
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      const tmp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = tmp;
      swaps++;
    }
    frames.push({
      stepIndex: frames.length,
      array: [...arr],
      comparing: [],
      swapping: [i, minIdx],
      sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
      pointers: { i, min: minIdx },
      codeLine: 8,
      explanation: `Place minimum value ${arr[i]} into sorted position ${i}.`,
      comparisons,
      writesOrSwaps: swaps,
    });
  }

  frames.push({
    stepIndex: frames.length,
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, idx) => idx),
    pointers: {},
    codeLine: 9,
    explanation: `Selection Sort finished with ${comparisons} comparisons and ${swaps} swaps.`,
    comparisons,
    writesOrSwaps: swaps,
  });
  return frames;
}

export function generateQuickSortFrames(input: number[]): VisualizerFrame[] {
  const arr = [...input];
  const n = arr.length;
  const frames: VisualizerFrame[] = [];
  const sortedSet = new Set<number>();
  let comparisons = 0;
  let swaps = 0;

  frames.push({
    stepIndex: 0,
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    pointers: {},
    codeLine: 1,
    explanation: `Start Quick Sort (Lomuto Partition) on ${n} elements.`,
    comparisons: 0,
    writesOrSwaps: 0,
  });

  function qs(low: number, high: number) {
    if (low > high) return;
    if (low === high) {
      sortedSet.add(low);
      return;
    }
    const pivot = arr[high];
    let i = low - 1;
    frames.push({
      stepIndex: frames.length,
      array: [...arr],
      comparing: [high],
      swapping: [],
      sorted: Array.from(sortedSet),
      pointers: { low, high, pivot: high },
      codeLine: 3,
      explanation: `Partition subarray [${low}..${high}] using pivot arr[${high}] = ${pivot}.`,
      comparisons,
      writesOrSwaps: swaps,
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      frames.push({
        stepIndex: frames.length,
        array: [...arr],
        comparing: [j, high],
        swapping: [],
        sorted: Array.from(sortedSet),
        pointers: { low, j, pivot: high },
        codeLine: 6,
        explanation: `Compare arr[${j}] = ${arr[j]} against pivot ${pivot}.`,
        comparisons,
        writesOrSwaps: swaps,
      });
      if (arr[j] <= pivot) {
        i++;
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
        swaps++;
        frames.push({
          stepIndex: frames.length,
          array: [...arr],
          comparing: [],
          swapping: [i, j],
          sorted: Array.from(sortedSet),
          pointers: { i, j, pivot: high },
          codeLine: 7,
          explanation: `${arr[i]} <= ${pivot}: move to left partition at index ${i}.`,
          comparisons,
          writesOrSwaps: swaps,
        });
      }
    }
    const pivotPos = i + 1;
    const tmp = arr[pivotPos];
    arr[pivotPos] = arr[high];
    arr[high] = tmp;
    swaps++;
    sortedSet.add(pivotPos);

    frames.push({
      stepIndex: frames.length,
      array: [...arr],
      comparing: [],
      swapping: [pivotPos, high],
      sorted: Array.from(sortedSet),
      pointers: { pivotFixed: pivotPos },
      codeLine: 8,
      explanation: `Place pivot ${pivot} at its final sorted index ${pivotPos}.`,
      comparisons,
      writesOrSwaps: swaps,
    });

    qs(low, pivotPos - 1);
    qs(pivotPos + 1, high);
  }

  qs(0, n - 1);
  for (let k = 0; k < n; k++) sortedSet.add(k);
  frames.push({
    stepIndex: frames.length,
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from(sortedSet),
    pointers: {},
    codeLine: 9,
    explanation: `Quick Sort complete with ${comparisons} comparisons and ${swaps} swaps.`,
    comparisons,
    writesOrSwaps: swaps,
  });
  return frames;
}

export function generateBinarySearchFrames(input: number[], target: number): VisualizerFrame[] {
  const arr = [...input].sort((a, b) => a - b);
  const frames: VisualizerFrame[] = [];
  let low = 0;
  let high = arr.length - 1;
  let comparisons = 0;

  frames.push({
    stepIndex: 0,
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    foundIndex: null,
    pointers: { low, high },
    codeLine: 2,
    explanation: `Sorted input array. Searching for target = ${target} in interval [0..${high}].`,
    comparisons: 0,
    writesOrSwaps: 0,
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;
    frames.push({
      stepIndex: frames.length,
      array: [...arr],
      comparing: [mid],
      swapping: [],
      sorted: [],
      foundIndex: null,
      pointers: { low, mid, high },
      codeLine: 4,
      explanation: `Inspect midpoint mid = ${mid} with value arr[${mid}] = ${arr[mid]} (target = ${target}).`,
      comparisons,
      writesOrSwaps: 0,
    });

    if (arr[mid] === target) {
      frames.push({
        stepIndex: frames.length,
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: [mid],
        foundIndex: mid,
        pointers: { low, mid, high },
        codeLine: 6,
        explanation: `Target ${target} found at index ${mid} in ${comparisons} comparison(s)!`,
        comparisons,
        writesOrSwaps: 0,
      });
      return frames;
    } else if (arr[mid] < target) {
      frames.push({
        stepIndex: frames.length,
        array: [...arr],
        comparing: [mid],
        swapping: [],
        sorted: [],
        foundIndex: null,
        pointers: { low: mid + 1, high },
        codeLine: 8,
        explanation: `arr[${mid}] = ${arr[mid]} < ${target}: discard left half [${low}..${mid}] and set low = ${mid + 1}.`,
        comparisons,
        writesOrSwaps: 0,
      });
      low = mid + 1;
    } else {
      frames.push({
        stepIndex: frames.length,
        array: [...arr],
        comparing: [mid],
        swapping: [],
        sorted: [],
        foundIndex: null,
        pointers: { low, high: mid - 1 },
        codeLine: 10,
        explanation: `arr[${mid}] = ${arr[mid]} > ${target}: discard right half [${mid}..${high}] and set high = ${mid - 1}.`,
        comparisons,
        writesOrSwaps: 0,
      });
      high = mid - 1;
    }
  }

  frames.push({
    stepIndex: frames.length,
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    foundIndex: -1,
    pointers: {},
    codeLine: 11,
    explanation: `Search interval exhausted (low > high). Target ${target} is not in the array (returned -1).`,
    comparisons,
    writesOrSwaps: 0,
  });
  return frames;
}

export function generateTreeTraversalFrames(mode: 'BFS' | 'DFS', targetNode = 7): VisualizerFrame[] {
  const baseNodes: GraphNodeState[] = [
    { id: 1, label: '1 (Root)', x: 300, y: 48, status: 'idle' },
    { id: 2, label: '2', x: 170, y: 140, status: 'idle' },
    { id: 3, label: '3', x: 430, y: 140, status: 'idle' },
    { id: 4, label: '4', x: 100, y: 240, status: 'idle' },
    { id: 5, label: '5', x: 235, y: 240, status: 'idle' },
    { id: 6, label: '6', x: 365, y: 240, status: 'idle' },
    { id: 7, label: '7', x: 500, y: 240, status: 'idle' },
  ];
  const adj: Record<number, number[]> = {
    1: [2, 3],
    2: [4, 5],
    3: [6, 7],
    4: [],
    5: [],
    6: [],
    7: [],
  };
  const baseEdges: GraphEdgeState[] = [
    { from: 1, to: 2, active: false },
    { from: 1, to: 3, active: false },
    { from: 2, to: 4, active: false },
    { from: 2, to: 5, active: false },
    { from: 3, to: 6, active: false },
    { from: 3, to: 7, active: false },
  ];

  const frames: VisualizerFrame[] = [];
  const frontier: number[] = [1];
  const visited = new Set<number>([1]);
  const order: number[] = [];
  let steps = 0;

  const cloneState = (
    activeId: number | null,
    activeEdge: [number, number] | null
  ): { nodes: GraphNodeState[]; edges: GraphEdgeState[] } => ({
    nodes: baseNodes.map((n) => ({
      ...n,
      status:
        n.id === activeId
          ? n.id === targetNode
            ? 'target'
            : 'visiting'
          : order.includes(n.id)
          ? 'visited'
          : frontier.includes(n.id)
          ? 'queued'
          : 'idle',
    })),
    edges: baseEdges.map((e) => ({
      ...e,
      active: activeEdge ? e.from === activeEdge[0] && e.to === activeEdge[1] : false,
    })),
  });

  const initSnap = cloneState(null, null);
  frames.push({
    stepIndex: 0,
    array: [1, 2, 3, 4, 5, 6, 7],
    comparing: [],
    swapping: [],
    sorted: [],
    pointers: {},
    codeLine: 2,
    explanation: `Initialize ${mode} starting at Root Node 1. Frontier ${
      mode === 'BFS' ? 'Queue' : 'Stack'
    } = [1].`,
    comparisons: 0,
    writesOrSwaps: 0,
    auxiliaryStructure: frontier.map((id) => `Node ${id}`),
    treeNodes: initSnap.nodes,
    treeEdges: initSnap.edges,
    traversalOrder: [...order],
  });

  while (frontier.length > 0) {
    const curr = mode === 'BFS' ? frontier.shift()! : frontier.pop()!;
    order.push(curr);
    steps++;

    const visitSnap = cloneState(curr, null);
    frames.push({
      stepIndex: frames.length,
      array: [1, 2, 3, 4, 5, 6, 7],
      comparing: [curr - 1],
      swapping: [],
      sorted: order.map((x) => x - 1),
      pointers: { current: curr - 1 },
      codeLine: 5,
      explanation: `${mode === 'BFS' ? 'Dequeue' : 'Pop'} Node ${curr} and append to traversal order: [${order.join(
        ' → '
      )}].`,
      comparisons: steps,
      writesOrSwaps: order.length,
      auxiliaryStructure: frontier.map((id) => `Node ${id}`),
      treeNodes: visitSnap.nodes,
      treeEdges: visitSnap.edges,
      traversalOrder: [...order],
    });

    const neighbors = mode === 'BFS' ? adj[curr] : [...adj[curr]].reverse();
    for (const nxt of neighbors) {
      if (!visited.has(nxt)) {
        visited.add(nxt);
        frontier.push(nxt);
        const edgeSnap = cloneState(curr, [curr, nxt]);
        frames.push({
          stepIndex: frames.length,
          array: [1, 2, 3, 4, 5, 6, 7],
          comparing: [curr - 1, nxt - 1],
          swapping: [],
          sorted: order.map((x) => x - 1),
          pointers: { from: curr - 1, to: nxt - 1 },
          codeLine: 9,
          explanation: `Discover unvisited child Node ${nxt} from Node ${curr}; push to ${
            mode === 'BFS' ? 'FIFO Queue' : 'LIFO Stack'
          }.`,
          comparisons: steps,
          writesOrSwaps: order.length,
          auxiliaryStructure: frontier.map((id) => `Node ${id}`),
          treeNodes: edgeSnap.nodes,
          treeEdges: edgeSnap.edges,
          traversalOrder: [...order],
        });
      }
    }
  }

  const finalSnap = cloneState(null, null);
  frames.push({
    stepIndex: frames.length,
    array: [1, 2, 3, 4, 5, 6, 7],
    comparing: [],
    swapping: [],
    sorted: [0, 1, 2, 3, 4, 5, 6],
    pointers: {},
    codeLine: 10,
    explanation: `${mode} traversal complete! Final visit order: [${order.join(' → ')}].`,
    comparisons: steps,
    writesOrSwaps: order.length,
    auxiliaryStructure: [],
    treeNodes: finalSnap.nodes,
    treeEdges: finalSnap.edges,
    traversalOrder: [...order],
  });

  return frames;
}
