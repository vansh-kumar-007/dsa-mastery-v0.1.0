# DECISIONS.md — Architecture Decision Records (ADRs)

## ADR-001: Frontend-Only Static Architecture for V0.1 (₹0 Infrastructure Target)
- **Status**: Accepted (2026-10-20)
- **Context**: Priority 1 is shipping a usable V0.1 quickly and Priority 2 is maintaining a ₹0/month operating budget without credit-card requirements or surprise usage billing.
- **Decision**: Build DSA Mastery V0.1 as a static Single-Page Application (SPA) using [React](https://react.dev/), [TypeScript](https://vite.dev/guide/), and [Tailwind CSS](https://tailwindcss.com/docs), storing guest learning progress in versioned `localStorage` with JSON export/import capabilities.
- **Trade-offs**: ₹0 hosting on [Cloudflare Pages](https://developers.cloudflare.com/pages/platform/limits/) or [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits); zero backend cold starts; complete privacy. Cross-device cloud sync is deferred to Post-V0.1.

## ADR-002: Dual-Engine In-Browser Python Execution (`PythonExecutionEngine`)
- **Status**: Accepted (2026-10-20)
- **Context**: Running untrusted Python on a backend server requires paid container isolation, while relying solely on a ~10 MB WebAssembly download ([Pyodide](https://pyodide.org/en/stable/usage/quickstart.html)) can stall on restricted networks or offline sandboxes.
- **Decision**: Implement a replaceable `PythonExecutionEngine` interface with two real browser-side providers:
  1. **Primary WebAssembly Provider (`PyodideRunner`)**: Dynamically loads [Pyodide](https://pyodide.org/en/stable/usage/quickstart.html) (`https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js`) in the browser when network permits.
  2. **Built-In Deterministic Python Subset Runner (`BrowserPythonSubsetRunner`)**: A zero-dependency in-browser Python AST/statement interpreter written in TypeScript that genuinely parses and executes Python functions, loops, recursion, lists, dicts, sets, slicing, comprehensions, and built-ins with loop-bound safety (`MAX_OPS = 50,000`).
- **Trade-offs & Limitations**: Client-side execution has no server-side cgroup memory isolation, and the offline subset engine does not load external C-extensions (`numpy`, `scipy`). These limitations are transparently badged in the workspace UI.

## ADR-003: React Bits-Inspired Motion System with Reduced-Motion Accessibility
- **Status**: Accepted (2026-10-20)
- **Decision**: Implement self-contained [React Bits](https://reactbits.dev/)-inspired components ([Spotlight Card](https://reactbits.dev/components/spotlight-card), [Shiny Text](https://reactbits.dev/text-animations/shiny-text), [Tilted Card](https://reactbits.dev/components/tilted-card)) with a global **Reduced Motion** toggle and distraction-free coding mode.

## ADR-004: Deterministic Frame-Precomputed Algorithm Visualizer Engine
- **Status**: Accepted (2026-10-20)
- **Decision**: Precompute immutable `VisualizerFrame[]` sequences for each algorithm run so learners can step forward, step backward, scrub the timeline, or adjust speed (`0.25x`–`4x`) without timer race conditions.
