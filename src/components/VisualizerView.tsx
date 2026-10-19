import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Shuffle,
  Sliders,
  Code2,
  Cpu,
  CheckCircle2,
  AlertCircle,
  GitBranch,
} from 'lucide-react';
import { AlgoId, VisualizerFrame } from '../types';
import {
  ALGORITHMS_META,
  generateBubbleSortFrames,
  generateInsertionSortFrames,
  generateSelectionSortFrames,
  generateQuickSortFrames,
  generateBinarySearchFrames,
  generateTreeTraversalFrames,
} from '../engine/visualizerEngine';
import { SpotlightCard } from './ReactBits';

export interface VisualizerViewProps {
  initialAlgo?: AlgoId;
  darkMode: boolean;
  reducedMotion: boolean;
  onOpenProblem: (problemId: string) => void;
}

export const VisualizerView: React.FC<VisualizerViewProps> = ({
  initialAlgo = 'bubble-sort',
  darkMode,
  reducedMotion,
  onOpenProblem,
}) => {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgoId>(initialAlgo);
  const [arrayInput, setArrayInput] = useState<number[]>([38, 16, 52, 9, 27, 44, 19, 63, 12, 31]);
  const [customArrayText, setCustomArrayText] = useState('38, 16, 52, 9, 27, 44, 19, 63, 12, 31');
  const [searchTarget, setSearchTarget] = useState<number>(31);
  const [treeMode, setTreeMode] = useState<'BFS' | 'DFS'>('BFS');
  const [inputError, setInputError] = useState<string | null>(null);

  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  useEffect(() => {
    setSelectedAlgo(initialAlgo);
    setIsPlaying(false);
    setStepIdx(0);
  }, [initialAlgo]);

  const frames: VisualizerFrame[] = useMemo(() => {
    switch (selectedAlgo) {
      case 'bubble-sort':
        return generateBubbleSortFrames(arrayInput);
      case 'insertion-sort':
        return generateInsertionSortFrames(arrayInput);
      case 'selection-sort':
        return generateSelectionSortFrames(arrayInput);
      case 'quick-sort':
        return generateQuickSortFrames(arrayInput);
      case 'binary-search':
        return generateBinarySearchFrames(arrayInput, searchTarget);
      case 'tree-bfs-dfs':
        return generateTreeTraversalFrames(treeMode, 7);
      default:
        return generateBubbleSortFrames(arrayInput);
    }
  }, [selectedAlgo, arrayInput, searchTarget, treeMode]);

  const currentFrame = frames[Math.min(stepIdx, frames.length - 1)] || frames[0];
  const meta = ALGORITHMS_META[selectedAlgo];

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIdx >= frames.length - 1) {
      setIsPlaying(false);
      return;
    }
    const delayMs = Math.max(80, Math.round(520 / speedMultiplier));
    const timer = window.setInterval(() => {
      setStepIdx((prev) => {
        if (prev >= frames.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, delayMs);
    return () => window.clearInterval(timer);
  }, [isPlaying, stepIdx, frames.length, speedMultiplier]);

  const handleRandomize = () => {
    setIsPlaying(false);
    setInputError(null);
    const count = 10;
    const next = Array.from({ length: count }, () => Math.floor(Math.random() * 85) + 8);
    setArrayInput(next);
    setCustomArrayText(next.join(', '));
    const randomTarget = next[Math.floor(Math.random() * next.length)];
    setSearchTarget(randomTarget);
    setStepIdx(0);
  };

  const handleApplyCustomInput = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlaying(false);
    const parts = customArrayText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length < 3 || parts.length > 18) {
      setInputError('Please enter between 3 and 18 comma-separated integers (range 1 to 99).');
      return;
    }
    const nums = parts.map((p) => Number(p));
    if (nums.some((n) => !Number.isInteger(n) || n < 1 || n > 99)) {
      setInputError('All values must be whole integers between 1 and 99.');
      return;
    }
    setInputError(null);
    setArrayInput(nums);
    setStepIdx(0);
  };

  const maxVal = Math.max(...currentFrame.array, 1);

  return (
    <div className="space-y-6">
      {/* Header & Algorithm Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-3.5 h-3.5" /> Interactive Step-by-Step Execution Engine
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
            Algorithm Visualizer Studio
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Inspect real state transitions, active pointers, and synchronized Python 3 code lines.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(ALGORITHMS_META) as AlgoId[]).map((algoKey) => {
            const item = ALGORITHMS_META[algoKey];
            const active = selectedAlgo === algoKey;
            return (
              <button
                key={algoKey}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setSelectedAlgo(algoKey);
                  setStepIdx(0);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                  active
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 font-semibold'
                    : darkMode
                    ? 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls & Custom Input Bar */}
      <SpotlightCard
        reducedMotion={reducedMotion}
        className={`p-4 sm:p-5 ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
          {/* Playback Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (stepIdx >= frames.length - 1) setStepIdx(0);
                setIsPlaying((p) => !p);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : stepIdx >= frames.length - 1 ? 'Replay' : 'Play'}
            </button>

            <button
              type="button"
              disabled={isPlaying || stepIdx === 0}
              onClick={() => setStepIdx((s) => Math.max(0, s - 1))}
              aria-label="Step Backward"
              className={`p-2.5 rounded-xl border transition disabled:opacity-40 ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              disabled={isPlaying || stepIdx >= frames.length - 1}
              onClick={() => setStepIdx((s) => Math.min(frames.length - 1, s + 1))}
              aria-label="Step Forward"
              className={`p-2.5 rounded-xl border transition disabled:opacity-40 ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStepIdx(0);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>

            {selectedAlgo !== 'tree-bfs-dfs' && (
              <button
                type="button"
                onClick={handleRandomize}
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-cyan-300'
                    : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-cyan-700'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" /> Randomize
              </button>
            )}

            {/* Speed Selector */}
            <div className="flex items-center gap-1.5 ml-1">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium opacity-75">Speed:</span>
              {[0.5, 1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setSpeedMultiplier(spd)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
                    speedMultiplier === spd
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Custom Array / Target / Traversal Mode Controls */}
          {selectedAlgo === 'tree-bfs-dfs' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium opacity-80">Traversal Strategy:</span>
              {(['BFS', 'DFS'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setTreeMode(m);
                    setStepIdx(0);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                    treeMode === m
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : darkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-300'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  {m === 'BFS' ? 'Breadth-First (FIFO Queue)' : 'Depth-First (LIFO Stack)'}
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleApplyCustomInput} className="flex flex-wrap items-center gap-2">
              <label htmlFor="custom-array-input" className="text-xs font-medium opacity-80">
                Array:
              </label>
              <input
                id="custom-array-input"
                type="text"
                value={customArrayText}
                onChange={(e) => setCustomArrayText(e.target.value)}
                placeholder="e.g. 38, 16, 52, 9, 27"
                className={`px-3 py-1.5 rounded-xl text-xs font-mono border w-56 sm:w-64 ${
                  darkMode
                    ? 'bg-slate-950 border-slate-700 text-slate-100'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              {selectedAlgo === 'binary-search' && (
                <div className="flex items-center gap-1.5">
                  <label htmlFor="target-input" className="text-xs font-medium opacity-80">
                    Target:
                  </label>
                  <input
                    id="target-input"
                    type="number"
                    value={searchTarget}
                    onChange={(e) => {
                      setIsPlaying(false);
                      setSearchTarget(Number(e.target.value));
                      setStepIdx(0);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-mono border w-20 ${
                      darkMode
                        ? 'bg-slate-950 border-slate-700 text-slate-100'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              )}
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition"
              >
                Apply Input
              </button>
            </form>
          )}
        </div>

        {inputError && (
          <div className="mt-3 flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{inputError}</span>
          </div>
        )}

        {/* Timeline Scrubber */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-xs font-mono opacity-75 shrink-0">
            Step {stepIdx + 1} / {frames.length}
          </span>
          <input
            type="range"
            aria-label="Algorithm timeline step scrubber"
            min={0}
            max={Math.max(0, frames.length - 1)}
            value={stepIdx}
            onChange={(e) => {
              setIsPlaying(false);
              setStepIdx(Number(e.target.value));
            }}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex items-center gap-3 text-xs font-mono shrink-0">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Comparisons: {currentFrame.comparisons}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20">
              {selectedAlgo === 'tree-bfs-dfs' ? 'Visited' : 'Writes/Swaps'}: {currentFrame.writesOrSwaps}
            </span>
          </div>
        </div>
      </SpotlightCard>

      {/* Main Stage: Canvas Visualization + Live Python Code & Narration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Visual Stage */}
        <SpotlightCard
          reducedMotion={reducedMotion}
          className={`lg:col-span-7 p-5 flex flex-col justify-between ${
            darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          {/* Legend & Active Pointers */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800/50">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> Comparing
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" /> Swap / Active Write
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Sorted / Visited
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {Object.entries(currentFrame.pointers).map(([k, v]) => (
                <span
                  key={k}
                  className="px-2 py-0.5 rounded-md text-xs font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                >
                  {k}={v}
                </span>
              ))}
            </div>
          </div>

          {/* Stage Content */}
          {selectedAlgo === 'tree-bfs-dfs' && currentFrame.treeNodes ? (
            <div className="my-4 space-y-4">
              <div className="w-full overflow-x-auto">
                <svg
                  viewBox="0 0 600 290"
                  className="w-full h-64 sm:h-72 mx-auto select-none"
                  role="img"
                  aria-label="Binary Tree Graph Traversal Visualization"
                >
                  {currentFrame.treeEdges?.map((edge, idx) => {
                    const fromNode = currentFrame.treeNodes!.find((n) => n.id === edge.from)!;
                    const toNode = currentFrame.treeNodes!.find((n) => n.id === edge.to)!;
                    return (
                      <line
                        key={idx}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={edge.active ? '#f59e0b' : darkMode ? '#334155' : '#cbd5e1'}
                        strokeWidth={edge.active ? 4 : 2.5}
                      />
                    );
                  })}
                  {currentFrame.treeNodes.map((node) => {
                    let fill = darkMode ? '#1e293b' : '#f1f5f9';
                    let stroke = darkMode ? '#475569' : '#94a3b8';
                    if (node.status === 'visiting' || node.status === 'target') {
                      fill = '#f59e0b';
                      stroke = '#fbbf24';
                    } else if (node.status === 'visited') {
                      fill = '#10b981';
                      stroke = '#34d399';
                    } else if (node.status === 'queued') {
                      fill = '#06b6d4';
                      stroke = '#22d3ee';
                    }
                    return (
                      <g key={node.id}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={24}
                          fill={fill}
                          stroke={stroke}
                          strokeWidth={3}
                        />
                        <text
                          x={node.x}
                          y={node.y + 5}
                          textAnchor="middle"
                          fill={node.status === 'idle' && !darkMode ? '#0f172a' : '#ffffff'}
                          fontSize="13"
                          fontWeight="bold"
                        >
                          {node.id}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div
                  className={`p-3 rounded-xl border ${
                    darkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="opacity-70 block mb-1">
                    Active Frontier ({treeMode === 'BFS' ? 'FIFO Queue' : 'LIFO Stack'}):
                  </span>
                  <span className="text-cyan-400 font-semibold">
                    {currentFrame.auxiliaryStructure?.length
                      ? `[ ${currentFrame.auxiliaryStructure.join(', ')} ]`
                      : '[ Empty ]'}
                  </span>
                </div>
                <div
                  className={`p-3 rounded-xl border ${
                    darkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="opacity-70 block mb-1">Traversal Output Order:</span>
                  <span className="text-emerald-400 font-semibold">
                    {currentFrame.traversalOrder?.length
                      ? currentFrame.traversalOrder.join(' → ')
                      : '(None yet)'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="my-6 h-64 sm:h-72 flex items-end justify-center gap-1.5 sm:gap-2.5 px-2 pt-8 pb-2">
              {currentFrame.array.map((val, idx) => {
                const isComparing = currentFrame.comparing.includes(idx);
                const isSwapping = currentFrame.swapping.includes(idx);
                const isSorted = currentFrame.sorted.includes(idx);
                const isOutOfBounds =
                  selectedAlgo === 'binary-search' &&
                  currentFrame.pointers.low !== undefined &&
                  currentFrame.pointers.high !== undefined &&
                  (idx < currentFrame.pointers.low || idx > currentFrame.pointers.high);

                let barColor = darkMode
                  ? 'bg-gradient-to-t from-slate-700 to-slate-500'
                  : 'bg-gradient-to-t from-slate-400 to-slate-300';
                if (isSwapping) {
                  barColor = 'bg-gradient-to-t from-rose-600 to-rose-400 shadow-lg shadow-rose-500/30';
                } else if (isComparing) {
                  barColor = 'bg-gradient-to-t from-amber-500 to-yellow-300 shadow-lg shadow-amber-500/30';
                } else if (isSorted) {
                  barColor = 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/25';
                }

                const heightPct = Math.max(12, Math.round((val / maxVal) * 100));
                const pointerLabels = Object.entries(currentFrame.pointers)
                  .filter(([, pIdx]) => pIdx === idx)
                  .map(([pName]) => pName);

                return (
                  <div
                    key={idx}
                    className={`flex-1 flex flex-col items-center h-full justify-end transition-opacity ${
                      isOutOfBounds ? 'opacity-25' : 'opacity-100'
                    }`}
                  >
                    <span className="text-[11px] font-mono font-bold mb-1">{val}</span>
                    <div
                      style={{
                        height: `${heightPct}%`,
                        transition: reducedMotion ? 'none' : 'height 220ms ease, background-color 180ms ease',
                      }}
                      className={`w-full max-w-[44px] rounded-t-lg ${barColor}`}
                    />
                    <span className="mt-1.5 text-[10px] font-mono opacity-60">[{idx}]</span>
                    <div className="h-5 mt-0.5 flex items-center justify-center">
                      {pointerLabels.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {pointerLabels.join(',')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Step Explanation Banner */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              darkMode
                ? 'bg-slate-950/90 border-emerald-500/30 text-slate-200'
                : 'bg-emerald-50 border-emerald-200 text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-emerald-400 mr-1.5">
                Step {stepIdx + 1} Explanation:
              </span>
              <span>{currentFrame.explanation}</span>
            </div>
          </div>
        </SpotlightCard>

        {/* Right 5 Cols: Live Python Implementation + Complexity Profile */}
        <div className="lg:col-span-5 space-y-5">
          <SpotlightCard
            reducedMotion={reducedMotion}
            className={`p-5 ${
              darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold">Synchronized Python 3 Implementation</h2>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                Line {currentFrame.codeLine}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950 text-slate-100 p-3.5 font-mono text-xs overflow-x-auto border border-slate-800">
              {meta.pythonCode.map((line, i) => {
                const lineNum = i + 1;
                const isActive = currentFrame.codeLine === lineNum;
                return (
                  <div
                    key={lineNum}
                    className={`flex items-center px-2 py-1 rounded ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border-l-2 border-emerald-400 font-semibold'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="w-6 text-right mr-3 opacity-50 select-none">{lineNum}</span>
                    <pre className="whitespace-pre">{line}</pre>
                  </div>
                );
              })}
            </div>
          </SpotlightCard>

          <SpotlightCard
            reducedMotion={reducedMotion}
            className={`p-5 ${
              darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-cyan-400" /> {meta.name} — Complexity & Properties
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/15 text-cyan-300">
                {meta.stable ? 'Stable' : 'Unstable'}
              </span>
            </div>
            <p className={`text-xs leading-relaxed mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {meta.summary}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className={`p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="opacity-60 text-[10px]">Best Time</div>
                <div className="font-bold text-emerald-400 mt-0.5">{meta.timeBest}</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="opacity-60 text-[10px]">Avg Time</div>
                <div className="font-bold text-amber-400 mt-0.5">{meta.timeAvg}</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="opacity-60 text-[10px]">Worst Time</div>
                <div className="font-bold text-rose-400 mt-0.5">{meta.timeWorst}</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="opacity-60 text-[10px]">Space</div>
                <div className="font-bold text-cyan-400 mt-0.5">{meta.spaceWorst}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between">
              <span className="text-xs opacity-75">Ready to code this pattern in Python?</span>
              <button
                type="button"
                onClick={() =>
                  onOpenProblem(
                    selectedAlgo === 'binary-search'
                      ? 'prob-binary-search'
                      : selectedAlgo === 'tree-bfs-dfs'
                      ? 'prob-climbing-stairs'
                      : 'prob-two-sum'
                  )
                }
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition"
              >
                Practice in Python IDE →
              </button>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};
