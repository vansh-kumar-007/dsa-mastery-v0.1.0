import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Play,
  Award,
  Sparkles,
  ArrowRight,
  Lock,
  Layers,
  Code2,
  Cpu,
  FileText,
  HelpCircle,
  ChevronRight,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { AlgoId, CurriculumModule, LearnerProgress, Lesson, NavTab } from '../types';
import { CURRICULUM_MODULES } from '../data/curriculum';
import { PRACTICE_PROBLEMS } from '../data/problems';
import { SpotlightCard, ShinyText, DecryptedText, TiltedCard } from './ReactBits';

export interface DashboardAndRoadmapProps {
  activeTab: NavTab;
  progress: LearnerProgress;
  selectedLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  onToggleLessonComplete: (lessonId: string) => void;
  onAnswerQuiz: (lessonId: string, correct: boolean) => void;
  onNavigateTab: (tab: NavTab) => void;
  onLaunchVisualizer: (algo: AlgoId) => void;
  onLaunchProblem: (problemId: string) => void;
  darkMode: boolean;
  reducedMotion: boolean;
}

export const CurriculumAndDocsView: React.FC<DashboardAndRoadmapProps> = ({
  activeTab,
  progress,
  selectedLessonId,
  onSelectLesson,
  onToggleLessonComplete,
  onAnswerQuiz,
  onNavigateTab,
  onLaunchVisualizer,
  onLaunchProblem,
  darkMode,
  reducedMotion,
}) => {
  const allLessons: Lesson[] = useMemo(
    () => CURRICULUM_MODULES.flatMap((m) => m.lessons),
    []
  );

  const activeLesson: Lesson = useMemo(
    () => allLessons.find((l) => l.id === selectedLessonId) || allLessons[0],
    [allLessons, selectedLessonId]
  );

  const [dryRunIdx, setDryRunIdx] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [activeDocTab, setActiveDocTab] = useState<
    'TASKS.md' | 'PROJECT_PLAN.md' | 'DECISIONS.md' | 'DEPLOYMENT.md' | 'CHANGELOG.md'
  >('TASKS.md');

  const handleChooseLesson = (lessonId: string) => {
    onSelectLesson(lessonId);
    setDryRunIdx(0);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
  };

  const totalLessons = allLessons.length;
  const completedLessonsCount = progress.completedLessons.length;
  const curriculumPct = Math.round((completedLessonsCount / Math.max(1, totalLessons)) * 100);
  const solvedCount = progress.solvedProblems.length;
  const problemsPct = Math.round((solvedCount / PRACTICE_PROBLEMS.length) * 100);

  if (activeTab === 'dashboard') {
    const resumeLesson =
      allLessons.find((l) => l.id === progress.lastLessonId) ||
      allLessons.find((l) => !progress.completedLessons.includes(l.id)) ||
      allLessons[0];

    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <SpotlightCard
          reducedMotion={reducedMotion}
          spotlightColor="rgba(16, 185, 129, 0.22)"
          className={`p-6 sm:p-8 lg:p-10 ${
            darkMode
              ? 'bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/30 border-slate-800'
              : 'bg-gradient-to-br from-white via-slate-50 to-emerald-50/60 border-slate-200 shadow-sm'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <ShinyText
                  text="V0.1 Production Release • ₹0 Free-Tier Architecture"
                  reducedMotion={reducedMotion}
                />
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Master Python{' '}
                <span className="text-emerald-400">
                  <DecryptedText
                    text="Data Structures & Algorithms"
                    reducedMotion={reducedMotion}
                  />
                </span>{' '}
                Visually.
              </h1>

              <p
                className={`text-sm sm:text-base max-w-2xl leading-relaxed ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Step through deterministic sorting, binary search, and graph traversals frame by
                frame, trace CPython memory states, and execute real Python 3 solutions in your
                browser with zero server cost.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleChooseLesson(resumeLesson.id);
                    onNavigateTab('roadmap');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/25"
                >
                  <Play className="w-4 h-4" /> Continue Learning: {resumeLesson.title.split(' ')[0]}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('visualizer')}
                  className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm border transition ${
                    darkMode
                      ? 'bg-slate-800/90 border-slate-700 hover:bg-slate-800 text-cyan-300'
                      : 'bg-white border-slate-300 hover:bg-slate-100 text-cyan-700'
                  }`}
                >
                  <Cpu className="w-4 h-4" /> Launch Visualizer
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('practice')}
                  className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm border transition ${
                    darkMode
                      ? 'bg-slate-800/90 border-slate-700 hover:bg-slate-800 text-violet-300'
                      : 'bg-white border-slate-300 hover:bg-slate-100 text-violet-700'
                  }`}
                >
                  <Code2 className="w-4 h-4" /> Practice Python IDE
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Tilted Mastery Scorecard */}
            <div className="lg:col-span-5">
              <TiltedCard
                reducedMotion={reducedMotion}
                className={`p-5 rounded-2xl border ${
                  darkMode
                    ? 'bg-slate-950/90 border-slate-800 shadow-xl'
                    : 'bg-white border-slate-200 shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-sm">Learner Mastery Telemetry</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300">
                    <Flame className="w-3.5 h-3.5" /> {progress.streakDays}d Streak • {progress.xp} XP
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="opacity-80">Curriculum Lessons Completed</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {completedLessonsCount} / {totalLessons} ({curriculumPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${curriculumPct}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="opacity-80">Python DSA Problems Solved</span>
                      <span className="font-mono font-bold text-cyan-400">
                        {solvedCount} / {PRACTICE_PROBLEMS.length} ({problemsPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 transition-all duration-300"
                        style={{ width: `${problemsPct}%` }}
                      />
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-xl border text-xs ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-emerald-400 mb-0.5">Up Next in Your Queue:</div>
                    <div className="font-bold">{resumeLesson.title}</div>
                    <div className="opacity-70 mt-0.5">{resumeLesson.summary}</div>
                  </div>
                </div>
              </TiltedCard>
            </div>
          </div>
        </SpotlightCard>

        {/* 3 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SpotlightCard
            reducedMotion={reducedMotion}
            className={`p-5 flex flex-col justify-between ${
              darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">1. Structured Python Roadmap</h2>
              <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                6 progressive modules from Big-O & CPython list internals to Two Pointers, Hash
                Maps, Stacks, Binary Search, and Graph BFS/DFS with interactive dry-run memory traces.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('roadmap')}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline"
            >
              Explore Curriculum Roadmap <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </SpotlightCard>

          <SpotlightCard
            reducedMotion={reducedMotion}
            className={`p-5 flex flex-col justify-between ${
              darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">2. Step-by-Step Visualizer</h2>
              <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Inspect Bubble, Insertion, Selection, and Quick Sort, Binary Search, and Tree/Graph
                BFS & DFS with timeline scrubbing, custom inputs, and live Python line highlighting.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(['bubble-sort', 'quick-sort', 'binary-search', 'tree-bfs-dfs'] as AlgoId[]).map(
                (algo) => (
                  <button
                    key={algo}
                    type="button"
                    onClick={() => onLaunchVisualizer(algo)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 transition"
                  >
                    {algo}
                  </button>
                )
              )}
            </div>
          </SpotlightCard>

          <SpotlightCard
            reducedMotion={reducedMotion}
            className={`p-5 flex flex-col justify-between ${
              darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-3">
                <Code2 className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">3. In-Browser Python Judge</h2>
              <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Solve 8 curated Python DSA problems across Easy, Medium, and Hard with real test
                case execution, loop protection, progressive hints, and{' '}
                <a
                  href="https://leetcode.com/problems/two-sum/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-300 underline"
                >
                  LeetCode
                </a>{' '}
                benchmarks.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('practice')}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-violet-400 hover:underline"
            >
              Open Python Coding Workspace <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </SpotlightCard>
        </div>
      </div>
    );
  }

  if (activeTab === 'roadmap') {
    const dryStep =
      activeLesson.dryRunSteps[Math.min(dryRunIdx, activeLesson.dryRunSteps.length - 1)] ||
      activeLesson.dryRunSteps[0];
    const isCompleted = progress.completedLessons.includes(activeLesson.id);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: 6-Module Curriculum Tree */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" /> Python DSA Roadmap
            </h2>
            <span className="text-xs font-mono text-emerald-400">
              {completedLessonsCount}/{totalLessons} Done
            </span>
          </div>

          {CURRICULUM_MODULES.map((mod: CurriculumModule) => {
            const prereqsMet = mod.prerequisites.every((preId) => {
              const preMod = CURRICULUM_MODULES.find((m) => m.id === preId);
              return preMod?.lessons.some((l) => progress.completedLessons.includes(l.id));
            });

            return (
              <SpotlightCard
                key={mod.id}
                reducedMotion={reducedMotion}
                className={`p-4 ${
                  darkMode ? 'bg-slate-900/85 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                    {mod.level}
                  </span>
                  {!prereqsMet && mod.prerequisites.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400">
                      <Lock className="w-3 h-3" /> Rec. Prereq: Module {mod.order - 1}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm mt-1">{mod.title}</h3>
                <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {mod.description}
                </p>

                <div className="mt-3 space-y-1.5">
                  {mod.lessons.map((les) => {
                    const done = progress.completedLessons.includes(les.id);
                    const selected = les.id === activeLesson.id;
                    return (
                      <button
                        key={les.id}
                        type="button"
                        onClick={() => handleChooseLesson(les.id)}
                        className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between transition border ${
                          selected
                            ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 font-semibold'
                            : darkMode
                            ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              done ? 'text-emerald-400' : 'opacity-30'
                            }`}
                          />
                          <span className="truncate">{les.title}</span>
                        </span>
                        <span className="font-mono text-[10px] opacity-60 shrink-0 ml-2">
                          {les.durationMin}m
                        </span>
                      </button>
                    );
                  })}
                </div>
              </SpotlightCard>
            );
          })}
        </div>

        {/* Right 8 Cols: Interactive Lesson Reader & Dry-Run Stepper */}
        <div className="lg:col-span-8 space-y-6">
          <SpotlightCard
            reducedMotion={reducedMotion}
            className={`p-6 ${
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
              <div>
                <span className="text-xs font-mono text-emerald-400">
                  Interactive Python Lesson • {activeLesson.durationMin} min read
                </span>
                <h1 className="text-2xl font-bold mt-1">{activeLesson.title}</h1>
              </div>

              <button
                type="button"
                onClick={() => onToggleLessonComplete(activeLesson.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  isCompleted
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : darkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-emerald-400'
                    : 'bg-slate-100 border-slate-300 text-slate-800 hover:border-emerald-500'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isCompleted ? 'Completed (Saved Locally)' : 'Mark Lesson Complete'}
              </button>
            </div>

            {/* Complexity Banner */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div
                className={`p-3 rounded-xl border ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="opacity-60 block">Time Complexity Profile:</span>
                <span className="text-emerald-400 font-bold">{activeLesson.timeComplexity}</span>
              </div>
              <div
                className={`p-3 rounded-xl border ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="opacity-60 block">Space Complexity Profile:</span>
                <span className="text-cyan-400 font-bold">{activeLesson.spaceComplexity}</span>
              </div>
            </div>

            {/* Core Concept & Key Takeaways */}
            <div className="mt-5 space-y-3 text-sm leading-relaxed">
              <p className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                {activeLesson.conceptMarkdown}
              </p>
              <div
                className={`p-4 rounded-xl border ${
                  darkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  Key Engineering Takeaways
                </div>
                <ul className="space-y-1.5 text-xs">
                  {activeLesson.keyTakeaways.map((kt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{kt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Python Code + Interactive Dry-Run Memory Stepper */}
            <div className="mt-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" /> Python 3 Implementation & Interactive Dry-Run
                </h2>
                <div className="flex items-center gap-2">
                  {activeLesson.dryRunSteps.map((s, idx) => (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setDryRunIdx(idx)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                        dryRunIdx === idx
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : darkMode
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Step {s.step}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800">
                {activeLesson.pythonCode.split('\n').map((line, idx) => {
                  const lineNo = idx + 1;
                  const active = dryStep.codeLine === lineNo;
                  return (
                    <div
                      key={lineNo}
                      className={`flex items-center px-2 py-0.5 rounded ${
                        active
                          ? 'bg-cyan-500/20 text-cyan-200 border-l-2 border-cyan-400 font-semibold'
                          : 'text-slate-300'
                      }`}
                    >
                      <span className="w-6 text-right mr-3 opacity-40 select-none">{lineNo}</span>
                      <pre className="whitespace-pre">{line}</pre>
                    </div>
                  );
                })}
              </div>

              {/* Dry-Run Memory Watch Card */}
              <div
                className={`p-4 rounded-xl border ${
                  darkMode ? 'bg-slate-950/90 border-cyan-500/30' : 'bg-cyan-50/70 border-cyan-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-cyan-400">
                    Dry-Run Trace (Step {dryStep.step} / {activeLesson.dryRunSteps.length} • Line{' '}
                    {dryStep.codeLine})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(dryStep.variables).map(([k, v]) => (
                      <span
                        key={k}
                        className="px-2 py-0.5 rounded text-xs font-mono bg-slate-900 text-emerald-300 border border-slate-700"
                      >
                        {k} = {v}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs leading-relaxed">{dryStep.explanation}</p>
              </div>
            </div>

            {/* Interactive Checkpoint Quiz */}
            <div
              className={`mt-6 p-5 rounded-2xl border ${
                darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400 mb-2">
                <HelpCircle className="w-4 h-4" /> Concept Checkpoint Quiz
              </div>
              <p className="text-sm font-semibold mb-3">{activeLesson.quiz.question}</p>
              <div className="space-y-2">
                {activeLesson.quiz.options.map((opt, idx) => {
                  const chosen = selectedQuizOption === idx;
                  const isCorrect = idx === activeLesson.quiz.correctIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedQuizOption(idx);
                        setQuizSubmitted(true);
                        onAnswerQuiz(activeLesson.id, isCorrect);
                      }}
                      className={`w-full text-left p-3 rounded-xl text-xs border transition flex items-center justify-between ${
                        quizSubmitted && chosen
                          ? isCorrect
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-semibold'
                            : 'bg-rose-500/20 border-rose-400 text-rose-300 font-semibold'
                          : chosen
                          ? 'border-violet-400 bg-violet-500/10'
                          : darkMode
                          ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && chosen && (
                        <span>{isCorrect ? '✓ Correct' : '✗ Try again'}</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {quizSubmitted && selectedQuizOption !== null && (
                <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                  <strong className="text-emerald-400">Explanation: </strong>
                  {activeLesson.quiz.explanation}
                </div>
              )}
            </div>

            {/* Action Links to Visualizer & Practice Problem */}
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
              {activeLesson.linkedVisualizerAlgo && (
                <button
                  type="button"
                  onClick={() => onLaunchVisualizer(activeLesson.linkedVisualizerAlgo!)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 transition"
                >
                  <Cpu className="w-3.5 h-3.5" /> Open Linked Visualizer ({activeLesson.linkedVisualizerAlgo})
                </button>
              )}
              {activeLesson.linkedProblemId && (
                <button
                  type="button"
                  onClick={() => onLaunchProblem(activeLesson.linkedProblemId!)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition"
                >
                  <Code2 className="w-3.5 h-3.5" /> Solve Linked Python Problem →
                </button>
              )}
            </div>
          </SpotlightCard>
        </div>
      </div>
    );
  }

  // Engineering Docs & Project Management Hub (activeTab === 'docs')
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Production Engineering & ₹0 Governance
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold">
            Project Management & Architecture Hub
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            ['TASKS.md', 'PROJECT_PLAN.md', 'DECISIONS.md', 'DEPLOYMENT.md', 'CHANGELOG.md'] as const
          ).map((docName) => (
            <button
              key={docName}
              type="button"
              onClick={() => setActiveDocTab(docName)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition ${
                activeDocTab === docName
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> {docName}
            </button>
          ))}
        </div>
      </div>

      <SpotlightCard
        reducedMotion={reducedMotion}
        className={`p-6 ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        {activeDocTab === 'TASKS.md' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold font-mono">TASKS.md — Single Source of Truth</h2>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Release: V0.1 (v0.1.0) • Status: All P0 Tasks Verified [x]
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-slate-300">
                <div className="text-emerald-400 font-bold mb-2">Phase 0 & Phase 1 — Foundation</div>
                <div>[x] SETUP-001: Inspect repository & existing tooling</div>
                <div>[x] SETUP-002: Verify Cloudflare/GitHub/Pyodide free-tier quotas</div>
                <div>[x] SETUP-003: Create 6 project management docs & Git init</div>
                <div>[x] UI-001: Configure React + TS + Tailwind & Dark/Light theme</div>
                <div>[x] UI-002: Implement React Bits components & reduced motion</div>
                <div>[x] UI-003: Build responsive app shell & local state manager</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-slate-300">
                <div className="text-cyan-400 font-bold mb-2">Phase 2, 3, 4 & 5 — Core Product</div>
                <div>[x] LEARN-001..003: 6-Module Roadmap, lessons, dry-runs & quizzes</div>
                <div>[x] VIS-001..003: 6 Visualizers (Bubble, Insertion, Selection, Quick, Binary Search, BFS/DFS)</div>
                <div>[x] PRAC-001..003: 8 Python problems + dual-engine Python runner</div>
                <div>[x] REL-001..003: Automated unit verification, static check & v0.1.0 release</div>
                <div className="text-amber-300 pt-1">[-] POST-001..003: Deferred to Phase 6/7 (2D DP grid, cloud sync, mock interviews)</div>
              </div>
            </div>
          </div>
        )}

        {activeDocTab === 'PROJECT_PLAN.md' && (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
            <h2 className="text-lg font-bold font-mono">PROJECT_PLAN.md — Phased Delivery Roadmap</h2>
            <p className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
              DSA Mastery follows a strict vertical-slice delivery strategy prioritizing a usable,
              verified V0.1 at ₹0/month recurring infrastructure cost before expanding into
              post-launch multiplayer or cloud-synced features.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-emerald-400">
                    <th className="py-2 pr-4">Phase</th>
                    <th className="py-2 pr-4">Scope & Deliverables</th>
                    <th className="py-2">Verification Gate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-2.5 pr-4 font-mono font-bold">Phase 0–1 (P0)</td>
                    <td className="py-2.5 pr-4">Project management system, React Bits UI, Dark/Light & Reduced Motion</td>
                    <td className="py-2.5 text-emerald-400">Verified</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono font-bold">Phase 2 (P0)</td>
                    <td className="py-2.5 pr-4">6-Module Python curriculum, dry-run memory steppers, local persistence</td>
                    <td className="py-2.5 text-emerald-400">Verified</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono font-bold">Phase 3 (P0)</td>
                    <td className="py-2.5 pr-4">Sorting (4), Searching (1), and Graph/Tree BFS & DFS visualizers</td>
                    <td className="py-2.5 text-emerald-400">Verified (6/6 Algos)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono font-bold">Phase 4–5 (P0)</td>
                    <td className="py-2.5 pr-4">8 Original Python problems, Pyodide + Subset Runner, v0.1.0 release</td>
                    <td className="py-2.5 text-emerald-400">Verified (8/8 Suites)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeDocTab === 'DECISIONS.md' && (
          <div className="space-y-3 text-xs sm:text-sm">
            <h2 className="text-lg font-bold font-mono">DECISIONS.md — Architecture Decision Records</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-emerald-400">ADR-001: Static SPA + Local Persistence</div>
                <p className="mt-1 text-xs text-slate-300">
                  Eliminates backend server and database costs for V0.1. Progress persists in
                  versioned <code>localStorage</code> with JSON backup export/import.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-cyan-400">ADR-002: Replaceable Dual-Engine Python Runner</div>
                <p className="mt-1 text-xs text-slate-300">
                  Uses{' '}
                  <a
                    href="https://pyodide.org/en/stable/usage/quickstart.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-cyan-300"
                  >
                    Pyodide WebAssembly
                  </a>{' '}
                  when online and falls back to a deterministic client-side Python subset interpreter
                  with a 50,000-operation infinite-loop guard.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeDocTab === 'DEPLOYMENT.md' && (
          <div className="space-y-3 text-xs sm:text-sm">
            <h2 className="text-lg font-bold font-mono">DEPLOYMENT.md — Verified Free-Tier Quotas & Rollback</h2>
            <p className="text-xs opacity-80">
              Target recurring cost is ₹0/month under normal usage, subject to provider quota policies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-emerald-400">
                  Primary Host:{' '}
                  <a
                    href="https://developers.cloudflare.com/pages/platform/limits/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Cloudflare Pages (Free Plan)
                  </a>
                </div>
                <div>• 1 concurrent build, 500 builds/month</div>
                <div>• Up to 20,000 files and 25 MiB per file</div>
                <div>• Instant 1-click deployment rollback in dashboard</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-400">
                  Backup Host:{' '}
                  <a
                    href="https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    GitHub Pages (Free Plan)
                  </a>
                </div>
                <div>• 1 GB max site size, 100 GB/month soft bandwidth limit</div>
                <div>• 10 builds/hour (or GitHub Actions workflow)</div>
                <div>• Rollback via <code>git revert</code> or <code>v0.1.0</code> tag redeploy</div>
              </div>
            </div>
          </div>
        )}

        {activeDocTab === 'CHANGELOG.md' && (
          <div className="space-y-2 text-xs sm:text-sm font-mono">
            <h2 className="text-lg font-bold">CHANGELOG.md — [v0.1.0] (2026-10-20)</h2>
            <ul className="list-disc list-inside space-y-1 text-xs opacity-90">
              <li>Added React Bits-inspired Dark/Light UI with SpotlightCard, ShinyText, DecryptedText, and TiltedCard.</li>
              <li>Added 6-Module Python DSA Roadmap & 6 interactive lessons with dry-run memory steppers and quizzes.</li>
              <li>Added 6 deterministic visualizers: Bubble, Insertion, Selection, Quick Sort, Binary Search, and Tree BFS/DFS.</li>
              <li>Added 8 original Python coding problems with dual-engine in-browser test evaluation and submission history.</li>
            </ul>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};
