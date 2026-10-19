# PROJECT_PLAN.md — DSA Mastery Roadmap & Release Plan

## 1. Executive Summary & Vision
**DSA Mastery** is an interactive, production-minded web application for learning **Data Structures and Algorithms in Python** from beginner foundations to advanced algorithmic problem-solving. It combines:
1. **Structured Python Curriculum** with complexity derivations, visual memory layouts, and dry-run walk-throughs.
2. **Interactive Algorithm Visualizer** supporting step-by-step state transitions, custom inputs, speed control, and live Python pseudocode line-highlighting across Sorting, Searching, and Tree/Graph Traversals.
3. **Interactive Python Coding Workspace & Practice Library** with original DSA problems, pattern/difficulty filtering, hints, and dual-engine in-browser Python execution ([Pyodide WebAssembly](https://pyodide.org/en/stable/usage/quickstart.html) + deterministic client-side Python runner).

## 2. Guiding Priorities
1. **Priority 1 — Ship a usable V0.1 quickly**: Focus on end-to-end vertical slices that learners can immediately use.
2. **Priority 2 — Maintain a ₹0 project budget**: Target ₹0/month recurring infrastructure cost using open-source libraries, client-side computation, and verified static hosting tiers ([Cloudflare Pages Limits](https://developers.cloudflare.com/pages/platform/limits/), [GitHub Pages Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)).
3. **Priority 3 — Real, working features over static mockups**: Every visualizer computes genuine algorithm state transitions, and the coding workspace executes actual user code against multi-case test suites.
4. **Priority 4 — Secure, maintainable, testable architecture**: Strict TypeScript interfaces, modular execution adapter (`PythonExecutionEngine`), `localStorage` schema validation, error boundaries, and automated verification.

## 3. Scope Split: V0.1 vs. Post-V0.1

| Area | V0.1 Scope (Launch Must-Haves) | Post-V0.1 Scope (Phase 6 & 7 Deferred) |
| :--- | :--- | :--- |
| **Visual System & UI** | Dark-first developer theme + Light theme toggle; [React Bits](https://reactbits.dev/)-inspired [Spotlight Card](https://reactbits.dev/components/spotlight-card), [Shiny Text](https://reactbits.dev/text-animations/shiny-text), [Tilted Card](https://reactbits.dev/components/tilted-card), and interactive grid background; reduced-motion toggle; mobile + desktop responsive shell. | Custom keybinding editor, multi-pane resizable split-views, downloadable PDF certificates. |
| **Curriculum & Lessons** | 6 structured modules (Beginner to Advanced) with prerequisite graph; complete lessons with Python code, Big-O tables, interactive dry-runs, checkpoints, and `localStorage` persistence. | Spaced-repetition flashcard deck, video walk-throughs, community notes. |
| **Algorithm Visualizer** | 6 complete visualizers: **Bubble Sort**, **Insertion Sort**, **Selection Sort**, **Quick Sort**, **Binary Search**, and **Binary Tree / Graph BFS & DFS** with play/pause/step-back/step-forward/reset, speed slider, custom array/target input, and step explanations. | Dynamic Programming 2D table animations, Dijkstra/A* weighted grid pathfinder, AVL/Red-Black tree rotations, Segment Tree range queries. |
| **Coding Workspace & Judge** | 8 original Python DSA problems across Easy/Medium/Hard & core patterns (Two Pointers, Sliding Window, Hash Map, Stack, Binary Search, Trees/Graphs, DP) with links to related [LeetCode](https://leetcode.com/) references; replaceable `PythonExecutionEngine` supporting [Pyodide WASM](https://pyodide.org/) and instant client-side Python execution; test cases, hints, bookmarks, and submission history. | Server-side isolated container judge for memory-limit enforcement, multi-language support, timed mock-interview contests. |
| **Persistence & Auth** | Client-side guest persistence (`localStorage` with schema versioning, JSON export/import backup). | Optional OAuth & multi-device cloud sync via Supabase free tier. |

## 4. Phased Milestones & Release Criteria
- **Phase 0 (P0)**: Repository inspection, free-tier verification, project management documents.
- **Phase 1 (P0)**: React + TypeScript + Tailwind foundation, React Bits visual system, responsive app shell.
- **Phase 2 (P0)**: Learning dashboard, 6-module DSA roadmap, interactive Python lessons, `localStorage` persistence.
- **Phase 3 (P0)**: Interactive Algorithm Visualizer (Sorting, Binary Search, Tree/Graph BFS & DFS).
- **Phase 4 (P0)**: Coding Workspace, Practice Problem Library, dual-engine in-browser Python test runner.
- **Phase 5 (P0)**: Automated verification, headless browser checks, `v0.1.0` Git tag, and release packaging.
