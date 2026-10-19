import React, { useState, useMemo } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Bookmark,
  Search,
  Lightbulb,
  ExternalLink,
  Terminal,
  History,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { Difficulty, LearnerProgress, PracticeProblem, SubmissionRecord } from '../types';
import { PRACTICE_PROBLEMS } from '../data/problems';
import { executeProblemTests, ExecutionSummary } from '../engine/pythonRunner';
import { SpotlightCard } from './ReactBits';

export interface PracticeWorkspaceViewProps {
  selectedProblemId: string;
  onSelectProblem: (id: string) => void;
  progress: LearnerProgress;
  onSaveCode: (problemId: string, code: string) => void;
  onToggleBookmark: (problemId: string) => void;
  onRecordSubmission: (record: SubmissionRecord) => void;
  darkMode: boolean;
  reducedMotion: boolean;
}

export const PracticeWorkspaceView: React.FC<PracticeWorkspaceViewProps> = ({
  selectedProblemId,
  onSelectProblem,
  progress,
  onSaveCode,
  onToggleBookmark,
  onRecordSubmission,
  darkMode,
  reducedMotion,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | Difficulty>('All');
  const [topicFilter, setTopicFilter] = useState<string>('All');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  const problem: PracticeProblem = useMemo(
    () => PRACTICE_PROBLEMS.find((p) => p.id === selectedProblemId) || PRACTICE_PROBLEMS[0],
    [selectedProblemId]
  );

  const currentCode = progress.savedCode[problem.id] ?? problem.starterCode;
  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'hints' | 'submissions'>('description');
  const [revealedHints, setRevealedHints] = useState<number>(1);
  const [customArgsInput, setCustomArgsInput] = useState<string>(problem.testCases[0]?.argsJson || '');
  const [useCustomInput, setUseCustomInput] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastExecution, setLastExecution] = useState<ExecutionSummary | null>(null);

  const topics = useMemo(() => {
    const s = new Set<string>(PRACTICE_PROBLEMS.map((p) => p.topic));
    return ['All', ...Array.from(s)];
  }, []);

  const filteredProblems = useMemo(() => {
    return PRACTICE_PROBLEMS.filter((p) => {
      if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) return false;
      if (topicFilter !== 'All' && p.topic !== topicFilter) return false;
      if (bookmarkedOnly && !progress.bookmarkedProblems.includes(p.id)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.topic.toLowerCase().includes(q) ||
          p.pattern.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [difficultyFilter, topicFilter, bookmarkedOnly, searchQuery, progress.bookmarkedProblems]);

  const handleSelectProblemInternal = (p: PracticeProblem) => {
    onSelectProblem(p.id);
    setLastExecution(null);
    setCustomArgsInput(p.testCases[0]?.argsJson || '');
    setUseCustomInput(false);
    setRevealedHints(1);
  };

  const handleRunTests = async (isOfficialSubmit: boolean) => {
    setIsRunning(true);
    try {
      const summary = await executeProblemTests(
        problem,
        currentCode,
        useCustomInput && !isOfficialSubmit ? customArgsInput : undefined
      );
      setLastExecution(summary);
      if (isOfficialSubmit) {
        onRecordSubmission({
          id: `sub-${Date.now()}`,
          problemId: problem.id,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          passedAll: summary.passedAll,
          passedCount: summary.passedCount,
          totalCount: summary.totalCount,
          runtimeMs: summary.totalRuntimeMs,
          engineUsed: summary.engineUsed,
          code: currentCode,
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  const problemSubmissions = useMemo(
    () => progress.submissions.filter((s) => s.problemId === problem.id),
    [progress.submissions, problem.id]
  );

  return (
    <div className="space-y-6">
      {/* Problem Library Filter Bar */}
      <SpotlightCard
        reducedMotion={reducedMotion}
        className={`p-4 sm:p-5 ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 opacity-50" />
              <input
                type="text"
                aria-label="Search practice problems"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, topic, or pattern..."
                className={`pl-9 pr-3 py-1.5 rounded-xl text-xs border w-56 sm:w-64 ${
                  darkMode
                    ? 'bg-slate-950 border-slate-700 text-slate-100'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  difficultyFilter === diff
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : darkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {diff}
              </button>
            ))}

            <select
              aria-label="Filter problems by topic"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                darkMode
                  ? 'bg-slate-950 border-slate-700 text-slate-200'
                  : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              {topics.map((t) => (
                <option key={t} value={t}>
                  Topic: {t}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setBookmarkedOnly((b) => !b)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                bookmarkedOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" /> Bookmarked
            </button>
          </div>

          <div className="text-xs font-mono opacity-80">
            Solved: <strong className="text-emerald-400">{progress.solvedProblems.length}</strong> /{' '}
            {PRACTICE_PROBLEMS.length} Problems
          </div>
        </div>

        {/* Horizontal Problem Selector Pills */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {filteredProblems.length === 0 ? (
            <div className="text-xs opacity-70 py-2">
              No problems match the current filters. Try clearing your search query.
            </div>
          ) : (
            filteredProblems.map((p) => {
              const isSolved = progress.solvedProblems.includes(p.id);
              const isSelected = p.id === problem.id;
              const diffColor =
                p.difficulty === 'Easy'
                  ? 'text-emerald-400'
                  : p.difficulty === 'Medium'
                  ? 'text-amber-400'
                  : 'text-rose-400';

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectProblemInternal(p)}
                  className={`shrink-0 px-3.5 py-2 rounded-xl text-xs border text-left transition flex items-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 font-semibold'
                      : darkMode
                      ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  <span>
                    #{p.number} {p.title}
                  </span>
                  <span className={`font-mono text-[10px] ${diffColor}`}>{p.difficulty}</span>
                </button>
              );
            })
          )}
        </div>
      </SpotlightCard>

      {/* Split Workspace: Problem Statement (Left 5 Cols) & Python Editor + Test Runner (Right 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane */}
        <div
          className={`lg:col-span-5 rounded-2xl border p-5 flex flex-col justify-between ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            {/* Problem Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      problem.difficulty === 'Easy'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : problem.difficulty === 'Medium'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-cyan-500/15 text-cyan-300">
                    {problem.topic}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-violet-500/15 text-violet-300">
                    {problem.pattern}
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-bold">
                  #{problem.number}. {problem.title}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Bookmark problem"
                onClick={() => onToggleBookmark(problem.id)}
                className={`p-2 rounded-xl border transition ${
                  progress.bookmarkedProblems.includes(problem.id)
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : darkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-400'
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="mt-4 flex gap-2 border-b border-slate-800/60 pb-2">
              {[
                { id: 'description', label: 'Problem & Examples' },
                { id: 'hints', label: `Hints & Complexity (${problem.hints.length})` },
                { id: 'submissions', label: `Submissions (${problemSubmissions.length})` },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveLeftTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeLeftTab === t.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Body */}
            {activeLeftTab === 'description' && (
              <div className="mt-4 space-y-4 text-xs sm:text-sm leading-relaxed">
                <p className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{problem.description}</p>

                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider opacity-75">Examples</h3>
                  {problem.examples.map((ex, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl font-mono text-xs border ${
                        darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <span className="opacity-60">Input: </span>
                        <span className="text-cyan-300">{ex.input}</span>
                      </div>
                      <div className="mt-1">
                        <span className="opacity-60">Output: </span>
                        <span className="text-emerald-400 font-semibold">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="mt-1 text-slate-400 font-sans text-xs">{ex.explanation}</div>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider opacity-75 mb-1.5">
                    Constraints & Targets
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs font-mono opacity-85">
                    {problem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeLeftTab === 'hints' && (
              <div className="mt-4 space-y-3 text-xs sm:text-sm">
                {problem.hints.slice(0, revealedHints).map((hint, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                      darkMode ? 'bg-slate-950/70 border-amber-500/30' : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-amber-400 text-xs">Hint {i + 1}</div>
                      <p className="mt-0.5 text-xs leading-relaxed">{hint}</p>
                    </div>
                  </div>
                ))}
                {revealedHints < problem.hints.length && (
                  <button
                    type="button"
                    onClick={() => setRevealedHints((h) => h + 1)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  >
                    Reveal Next Hint ({revealedHints}/{problem.hints.length})
                  </button>
                )}

                <div
                  className={`p-3.5 rounded-xl border mt-4 ${
                    darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold mb-1">Optimal Complexity Target</div>
                  <div className="text-xs font-mono text-emerald-400">
                    Time: {problem.optimalTime} | Space: {problem.optimalSpace}
                  </div>
                </div>
              </div>
            )}

            {activeLeftTab === 'submissions' && (
              <div className="mt-4 space-y-2.5 text-xs">
                {problemSubmissions.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-700 text-center opacity-70">
                    <History className="w-5 h-5 mx-auto mb-1 opacity-60" />
                    No submissions recorded for this problem yet. Click <strong>Submit Solution</strong> to evaluate all test cases.
                  </div>
                ) : (
                  problemSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <span
                          className={`font-bold ${
                            sub.passedAll ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {sub.passedAll ? 'Accepted' : 'Wrong Answer / Error'}
                        </span>
                        <span className="ml-2 font-mono opacity-75">
                          ({sub.passedCount}/{sub.totalCount} tests)
                        </span>
                        <div className="text-[11px] opacity-60 mt-0.5">{sub.engineUsed}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-cyan-300">{sub.runtimeMs} ms</div>
                        <div className="text-[10px] opacity-60">{sub.timestamp}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* External Reference Link */}
          <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
            <span className="opacity-70">External Benchmark Reference:</span>
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-cyan-400 hover:underline"
            >
              {problem.leetcodeTitle} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Pane: Distraction-Free Python Code Editor + Test Suite Runner */}
        <div
          className={`lg:col-span-7 rounded-2xl border p-5 flex flex-col justify-between ${
            darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            {/* Editor Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono">Python 3 Workspace</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  def {problem.functionName}(...)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSaveCode(problem.id, problem.solutionCode)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-violet-500/15 text-violet-300 border border-violet-500/30 hover:bg-violet-500/25 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Load Reference Solution
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSaveCode(problem.id, problem.starterCode);
                    setLastExecution(null);
                  }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                    darkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Code
                </button>
              </div>
            </div>

            {/* Code Editor Textarea with Line Gutter */}
            <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <textarea
                aria-label="Python 3 solution code editor"
                value={currentCode}
                onChange={(e) => onSaveCode(problem.id, e.target.value)}
                spellCheck={false}
                rows={13}
                className="w-full p-4 font-mono text-xs sm:text-sm leading-relaxed bg-slate-950 text-emerald-100 focus:outline-none resize-y"
              />
            </div>

            {/* Execution Action Bar */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCustomInput}
                    onChange={(e) => setUseCustomInput(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Custom Test Args (JSON)</span>
                </label>
                {useCustomInput && (
                  <input
                    type="text"
                    aria-label="Custom test case JSON arguments"
                    value={customArgsInput}
                    onChange={(e) => setCustomArgsInput(e.target.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono border w-48 ${
                      darkMode
                        ? 'bg-slate-950 border-slate-700 text-slate-100'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isRunning}
                  onClick={() => handleRunTests(false)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                    darkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700'
                      : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  {isRunning ? 'Running...' : 'Run Sample Tests'}
                </button>
                <button
                  type="button"
                  disabled={isRunning}
                  onClick={() => handleRunTests(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Submit Solution
                </button>
              </div>
            </div>
          </div>

          {/* Test Suite Results Panel */}
          <div className="mt-4 pt-3 border-t border-slate-800/60">
            {!lastExecution ? (
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
                <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Safe ₹0 In-Browser Execution: </span>
                  Your Python code runs locally in the browser via{' '}
                  <a
                    href="https://pyodide.org/en/stable/usage/quickstart.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 underline"
                  >
                    Pyodide WebAssembly
                  </a>{' '}
                  (when online) or the built-in deterministic Python Subset Runner with loop-bound protection (50,000 ops max; C-extensions and filesystem I/O are disabled).
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {lastExecution.passedAll ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> All {lastExecution.totalCount} Test Cases Passed!
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-rose-400">
                        <XCircle className="w-4 h-4" /> {lastExecution.passedCount} / {lastExecution.totalCount} Tests Passed
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono opacity-75">
                    Engine: {lastExecution.engineUsed} • {lastExecution.totalRuntimeMs} ms
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {lastExecution.results.map((r) => (
                    <div
                      key={r.testId}
                      className={`p-3 rounded-xl border font-mono text-xs ${
                        r.passed
                          ? 'bg-emerald-500/5 border-emerald-500/30'
                          : 'bg-rose-500/10 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={r.passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {r.passed ? '✓ PASS' : '✗ FAIL'}
                        </span>
                        <span className="opacity-60 text-[10px]">{r.runtimeMs} ms</span>
                      </div>
                      <div className="mt-1 truncate opacity-80" title={r.inputDisplay}>
                        {r.inputDisplay}
                      </div>
                      {r.error ? (
                        <div className="mt-1 text-rose-300 break-words">{r.error}</div>
                      ) : (
                        <div className="mt-1 flex items-center justify-between gap-2 text-[11px]">
                          <span>Expected: {r.expected}</span>
                          <span className={r.passed ? 'text-emerald-300' : 'text-rose-300'}>
                            Actual: {r.actual}
                          </span>
                        </div>
                      )}
                      {r.stdout && (
                        <div className="mt-1 text-[11px] text-cyan-300">stdout: {r.stdout}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
