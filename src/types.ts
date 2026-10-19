export type ThemeMode = 'dark' | 'light';
export type NavTab = 'dashboard' | 'roadmap' | 'visualizer' | 'practice' | 'docs';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface DryRunStep {
  step: number;
  codeLine: number;
  variables: Record<string, string>;
  explanation: string;
  highlightIndices?: number[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  durationMin: number;
  summary: string;
  timeComplexity: string;
  spaceComplexity: string;
  keyTakeaways: string[];
  conceptMarkdown: string;
  pythonCode: string;
  dryRunArray?: number[];
  dryRunSteps: DryRunStep[];
  quiz: QuizQuestion;
  linkedVisualizerAlgo?: AlgoId;
  linkedProblemId?: string;
}

export interface CurriculumModule {
  id: string;
  order: number;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  prerequisites: string[];
  badgeColor: string;
  lessons: Lesson[];
}

export type AlgoId =
  | 'bubble-sort'
  | 'insertion-sort'
  | 'selection-sort'
  | 'quick-sort'
  | 'binary-search'
  | 'tree-bfs-dfs';

export interface GraphNodeState {
  id: number;
  label: string;
  x: number;
  y: number;
  status: 'idle' | 'visiting' | 'queued' | 'visited' | 'target';
}

export interface GraphEdgeState {
  from: number;
  to: number;
  active: boolean;
}

export interface VisualizerFrame {
  stepIndex: number;
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  foundIndex?: number | null;
  pointers: Record<string, number>;
  codeLine: number;
  explanation: string;
  comparisons: number;
  writesOrSwaps: number;
  auxiliaryStructure?: string[];
  treeNodes?: GraphNodeState[];
  treeEdges?: GraphEdgeState[];
  traversalOrder?: number[];
}

export interface AlgorithmMeta {
  id: AlgoId;
  name: string;
  category: 'Sorting' | 'Searching' | 'Trees & Graphs';
  timeBest: string;
  timeAvg: string;
  timeWorst: string;
  spaceWorst: string;
  stable: boolean;
  summary: string;
  pythonCode: string[];
}

export interface ProblemTestCase {
  id: string;
  inputDisplay: string;
  argsJson: string;
  expectedJson: string;
  isHidden?: boolean;
}

export interface PracticeProblem {
  id: string;
  number: number;
  title: string;
  difficulty: Difficulty;
  topic: string;
  pattern: string;
  summary: string;
  description: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  functionName: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  optimalTime: string;
  optimalSpace: string;
  leetcodeUrl: string;
  leetcodeTitle: string;
  testCases: ProblemTestCase[];
}

export interface TestCaseResult {
  testId: string;
  passed: boolean;
  inputDisplay: string;
  expected: string;
  actual: string;
  stdout: string;
  error?: string;
  runtimeMs: number;
}

export interface SubmissionRecord {
  id: string;
  problemId: string;
  timestamp: string;
  passedAll: boolean;
  passedCount: number;
  totalCount: number;
  runtimeMs: number;
  engineUsed: 'Pyodide WASM (CPython 3.12)' | 'Client-Side Python Subset Runner';
  code: string;
}

export interface LearnerProgress {
  schemaVersion: number;
  completedLessons: string[];
  quizScores: Record<string, boolean>;
  solvedProblems: string[];
  bookmarkedProblems: string[];
  savedCode: Record<string, string>;
  submissions: SubmissionRecord[];
  lastLessonId: string;
  lastProblemId: string;
  streakDays: number;
  xp: number;
}
