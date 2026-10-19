import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Compass,
  Cpu,
  Code2,
  FileText,
  Sun,
  Moon,
  EyeOff,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AlgoId, LearnerProgress, NavTab, SubmissionRecord } from './types';
import { AnimatedGridBackground } from './components/ReactBits';
import { VisualizerView } from './components/VisualizerView';
import { PracticeWorkspaceView } from './components/PracticeWorkspaceView';
import { CurriculumAndDocsView } from './components/CurriculumAndDocsView';

const STORAGE_KEY = 'dsa_mastery_v01_state';

const DEFAULT_PROGRESS: LearnerProgress = {
  schemaVersion: 1,
  completedLessons: ['les-101-big-o'],
  quizScores: {},
  solvedProblems: [],
  bookmarkedProblems: ['prob-two-sum'],
  savedCode: {},
  submissions: [],
  lastLessonId: 'les-101-big-o',
  lastProblemId: 'prob-two-sum',
  streakDays: 3,
  xp: 150,
};

function loadPersistedProgress(): LearnerProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_PROGRESS;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      completedLessons: Array.isArray(parsed.completedLessons)
        ? parsed.completedLessons
        : DEFAULT_PROGRESS.completedLessons,
      solvedProblems: Array.isArray(parsed.solvedProblems) ? parsed.solvedProblems : [],
      bookmarkedProblems: Array.isArray(parsed.bookmarkedProblems)
        ? parsed.bookmarkedProblems
        : DEFAULT_PROGRESS.bookmarkedProblems,
      savedCode: parsed.savedCode && typeof parsed.savedCode === 'object' ? parsed.savedCode : {},
      submissions: Array.isArray(parsed.submissions) ? parsed.submissions : [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }
  static getDerivedStateFromError(err: Error) {
    return { hasError: true, message: err?.message || 'Unexpected rendering error' };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-rose-500/40 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertTriangle className="w-5 h-5" /> Application Recovery Boundary
            </div>
            <p className="text-xs text-slate-300">{this.state.message}</p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, message: '' })}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950"
            >
              Recover Session
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [progress, setProgress] = useState<LearnerProgress>(() => loadPersistedProgress());

  const [selectedLessonId, setSelectedLessonId] = useState<string>(progress.lastLessonId);
  const [selectedAlgo, setSelectedAlgo] = useState<AlgoId>('bubble-sort');
  const [selectedProblemId, setSelectedProblemId] = useState<string>(progress.lastProblemId);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showBackupModal, setShowBackupModal] = useState<boolean>(false);
  const [backupJsonText, setBackupJsonText] = useState<string>('');

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore quota errors in restricted sandboxes
    }
  }, [progress]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  const handleToggleLessonComplete = (lessonId: string) => {
    setProgress((prev) => {
      const exists = prev.completedLessons.includes(lessonId);
      const nextCompleted = exists
        ? prev.completedLessons.filter((id) => id !== lessonId)
        : [...prev.completedLessons, lessonId];
      return {
        ...prev,
        completedLessons: nextCompleted,
        lastLessonId: lessonId,
        xp: exists ? Math.max(0, prev.xp - 50) : prev.xp + 50,
      };
    });
    showToast('Lesson progress saved to local storage.');
  };

  const handleAnswerQuiz = (lessonId: string, correct: boolean) => {
    setProgress((prev) => ({
      ...prev,
      quizScores: { ...prev.quizScores, [lessonId]: correct },
      xp: correct && !prev.quizScores[lessonId] ? prev.xp + 25 : prev.xp,
    }));
  };

  const handleSaveCode = (problemId: string, code: string) => {
    setProgress((prev) => ({
      ...prev,
      lastProblemId: problemId,
      savedCode: { ...prev.savedCode, [problemId]: code },
    }));
  };

  const handleToggleBookmark = (problemId: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedProblems.includes(problemId);
      return {
        ...prev,
        bookmarkedProblems: exists
          ? prev.bookmarkedProblems.filter((id) => id !== problemId)
          : [...prev.bookmarkedProblems, problemId],
      };
    });
  };

  const handleRecordSubmission = (record: SubmissionRecord) => {
    setProgress((prev) => {
      const newlySolved =
        record.passedAll && !prev.solvedProblems.includes(record.problemId);
      return {
        ...prev,
        solvedProblems: newlySolved
          ? [...prev.solvedProblems, record.problemId]
          : prev.solvedProblems,
        submissions: [record, ...prev.submissions.slice(0, 29)],
        xp: newlySolved ? prev.xp + 100 : prev.xp,
      };
    });
    if (record.passedAll) {
      showToast('All test cases passed! +100 XP awarded.');
    }
  };

  const handleResetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    showToast('Learner progress reset to V0.1 defaults.');
  };

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Compass className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Curriculum & Lessons', icon: <Terminal className="w-4 h-4" /> },
    { id: 'visualizer', label: 'Visualizer Studio', icon: <Cpu className="w-4 h-4" /> },
    { id: 'practice', label: 'Python Practice IDE', icon: <Code2 className="w-4 h-4" /> },
    { id: 'docs', label: 'Engineering & Docs', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <AppErrorBoundary>
      <div
        className={`min-h-screen transition-colors duration-200 ${
          darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
      >
        {activeTab !== 'practice' && (
          <AnimatedGridBackground darkMode={darkMode} reducedMotion={reducedMotion} />
        )}

        {/* Top Navigation Shell */}
        <header
          className={`sticky top-0 z-30 backdrop-blur-md border-b ${
            darkMode
              ? 'bg-slate-950/85 border-slate-800/80'
              : 'bg-white/90 border-slate-200'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            {/* Brand Logo */}
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-emerald-500/20">
                Py
              </div>
              <div>
                <div className="font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                  <span>DSA Mastery</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    v0.1.0
                  </span>
                </div>
                <div className="text-[10px] opacity-65 hidden sm:block">
                  Interactive Python Algorithms & Visual Judge
                </div>
              </div>
            </button>

            {/* Primary Navigation Links */}
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                      active
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : darkMode
                        ? 'text-slate-300 hover:bg-slate-900'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Utility Controls: Reduced Motion, Theme, Backup */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setReducedMotion((r) => !r);
                  showToast(
                    !reducedMotion
                      ? 'Reduced motion enabled for accessibility.'
                      : 'Standard animations restored.'
                  );
                }}
                title="Toggle Reduced Motion"
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1 transition ${
                  reducedMotion
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : darkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-300'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Motion: {reducedMotion ? 'Off' : 'On'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBackupJsonText(JSON.stringify(progress, null, 2));
                  setShowBackupModal(true);
                }}
                title="Export or Import Local Progress JSON"
                className={`p-2 rounded-xl border transition ${
                  darkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setDarkMode((d) => !d)}
                aria-label="Toggle Dark or Light Theme"
                className={`p-2 rounded-xl border transition ${
                  darkMode
                    ? 'bg-slate-900 border-slate-800 text-amber-300 hover:border-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Bar */}
          <div className="flex md:hidden overflow-x-auto px-4 py-2 gap-1.5 border-t border-slate-800/50">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    active
                      ? 'bg-emerald-500 text-slate-950'
                      : darkMode
                      ? 'bg-slate-900 text-slate-300'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs shadow-xl">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* JSON Progress Export/Import Modal */}
        {showBackupModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div
              className={`max-w-lg w-full rounded-2xl border p-5 space-y-4 ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold">Local Progress JSON Backup & Restore</h2>
                <button
                  type="button"
                  onClick={() => setShowBackupModal(false)}
                  className="text-xs opacity-70 hover:opacity-100"
                >
                  Close ✕
                </button>
              </div>
              <p className="text-xs opacity-75">
                DSA Mastery stores your progress locally in your browser at ₹0 server cost. Copy or
                edit this JSON snapshot to transfer progress across browsers.
              </p>
              <textarea
                aria-label="Progress JSON snapshot"
                value={backupJsonText}
                onChange={(e) => setBackupJsonText(e.target.value)}
                rows={8}
                className="w-full p-3 rounded-xl font-mono text-xs bg-slate-950 text-emerald-200 border border-slate-800"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleResetProgress}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset All Progress
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const parsed = JSON.parse(backupJsonText);
                        if (parsed && typeof parsed === 'object') {
                          setProgress({ ...DEFAULT_PROGRESS, ...parsed });
                          setShowBackupModal(false);
                          showToast('Progress snapshot imported!');
                        }
                      } catch {
                        showToast('Invalid JSON format.');
                      }
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950"
                  >
                    Restore JSON
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace Container */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {activeTab === 'visualizer' ? (
            <VisualizerView
              initialAlgo={selectedAlgo}
              darkMode={darkMode}
              reducedMotion={reducedMotion}
              onOpenProblem={(probId) => {
                setSelectedProblemId(probId);
                setActiveTab('practice');
              }}
            />
          ) : activeTab === 'practice' ? (
            <PracticeWorkspaceView
              selectedProblemId={selectedProblemId}
              onSelectProblem={(id) => {
                setSelectedProblemId(id);
                setProgress((prev) => ({ ...prev, lastProblemId: id }));
              }}
              progress={progress}
              onSaveCode={handleSaveCode}
              onToggleBookmark={handleToggleBookmark}
              onRecordSubmission={handleRecordSubmission}
              darkMode={darkMode}
              reducedMotion={reducedMotion}
            />
          ) : (
            <CurriculumAndDocsView
              activeTab={activeTab}
              progress={progress}
              selectedLessonId={selectedLessonId}
              onSelectLesson={(id) => {
                setSelectedLessonId(id);
                setProgress((prev) => ({ ...prev, lastLessonId: id }));
              }}
              onToggleLessonComplete={handleToggleLessonComplete}
              onAnswerQuiz={handleAnswerQuiz}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onLaunchVisualizer={(algo) => {
                setSelectedAlgo(algo);
                setActiveTab('visualizer');
              }}
              onLaunchProblem={(probId) => {
                setSelectedProblemId(probId);
                setActiveTab('practice');
              }}
              darkMode={darkMode}
              reducedMotion={reducedMotion}
            />
          )}
        </main>

        {/* Footer */}
        <footer
          className={`relative z-10 border-t py-6 px-4 sm:px-6 text-xs ${
            darkMode
              ? 'border-slate-900 bg-slate-950/90 text-slate-400'
              : 'border-slate-200 bg-white text-slate-600'
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <strong>DSA Mastery v0.1.0</strong> — Built with{' '}
              <a
                href="https://react.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-emerald-400"
              >
                React
              </a>
              ,{' '}
              <a
                href="https://vite.dev/guide/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-emerald-400"
              >
                TypeScript & Vite
              </a>
              ,{' '}
              <a
                href="https://tailwindcss.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-emerald-400"
              >
                Tailwind CSS
              </a>
              , and{' '}
              <a
                href="https://reactbits.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-emerald-400"
              >
                React Bits
              </a>{' '}
              patterns.
            </div>
            <div>
              Target ₹0/month static deployment ready for{' '}
              <a
                href="https://developers.cloudflare.com/pages/platform/limits/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-cyan-400"
              >
                Cloudflare Pages
              </a>{' '}
              &{' '}
              <a
                href="https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-cyan-400"
              >
                GitHub Pages
              </a>
              .
            </div>
          </div>
        </footer>
      </div>
    </AppErrorBoundary>
  );
}
