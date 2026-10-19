import { PracticeProblem, TestCaseResult } from '../types';

export interface ExecutionSummary {
  passedAll: boolean;
  passedCount: number;
  totalCount: number;
  totalRuntimeMs: number;
  engineUsed: 'Pyodide WASM (CPython 3.12)' | 'Client-Side Python Subset Runner';
  results: TestCaseResult[];
}

declare global {
  interface Window {
    loadPyodide?: (config?: { indexURL?: string }) => Promise<any>;
    __dsaPyodideInstance?: any;
    __dsaPyodideLoading?: Promise<any>;
  }
}

/**
 * Attempts to lazily load Pyodide WebAssembly from jsDelivr CDN when online.
 * Falls back cleanly to the deterministic Client-Side Python Subset Runner if offline or blocked.
 */
export async function tryGetPyodideInstance(timeoutMs = 2800): Promise<any | null> {
  if (typeof window === 'undefined') return null;
  if (window.__dsaPyodideInstance) return window.__dsaPyodideInstance;

  const loadPromise = (async () => {
    try {
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const existing = document.querySelector('script[data-pyodide-cdn="true"]');
          if (existing) {
            resolve();
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js';
          script.async = true;
          script.setAttribute('data-pyodide-cdn', 'true');
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Pyodide CDN script unreachable'));
          document.head.appendChild(script);
        });
      }
      if (!window.loadPyodide) return null;
      if (!window.__dsaPyodideLoading) {
        window.__dsaPyodideLoading = window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/',
        });
      }
      window.__dsaPyodideInstance = await window.__dsaPyodideLoading;
      return window.__dsaPyodideInstance;
    } catch {
      return null;
    }
  })();

  const timeoutPromise = new Promise<null>((resolve) =>
    setTimeout(() => resolve(null), timeoutMs)
  );

  return Promise.race([loadPromise, timeoutPromise]);
}

/**
 * Translates a single Python expression into safe JavaScript expression syntax
 * supporting Python built-ins (__py), integer floor division (//), negative indexing,
 * `in` / `not in`, `and` / `or` / `not`, and Python booleans/None.
 */
function transpilePythonExpr(expr: string): string {
  let s = expr.trim();

  // Replace Python string literals temporarily with placeholders so we don't mangle their contents
  const strings: string[] = [];
  s = s.replace(/(["'])(?:\\.|(?!\1).)*\1/g, (m) => {
    strings.push(m);
    return `__STR_${strings.length - 1}__`;
  });

  // List repetition: [val] * count -> __py.repeatList([val], count)
  s = s.replace(/\[([^\]]+)\]\s*\*\s*\(([^)]+)\)/g, '__py.repeatList([$1], ($2))');
  s = s.replace(/\[([^\]]+)\]\s*\*\s*([a-zA-Z0-9_+\-*/ ]+)/g, '__py.repeatList([$1], ($2))');

  // Negative index access: arr[-1] -> __py.idx(arr, -1)
  s = s.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\[\s*-1\s*\]/g, '__py.idx($1, -1)');

  // Python ternary: A if COND else B
  const ternaryMatch = s.match(/^(.+?)\s+if\s+(.+?)\s+else\s+(.+)$/);
  if (ternaryMatch) {
    s = `((${transpilePythonExpr(ternaryMatch[2])}) ? (${transpilePythonExpr(
      ternaryMatch[1]
    )}) : (${transpilePythonExpr(ternaryMatch[3])}))`;
  }

  // Method mappings
  s = s.replace(/\.append\(/g, '.push(');
  s = s.replace(
    /([a-zA-Z_][a-zA-Z0-9_]*)\.get\(([^,)]+)(?:,\s*([^)]+))?\)/g,
    '__py.dictGet($1, $2, $3)'
  );

  // Integer floor division: a // b -> Math.floor((a) / (b))
  s = s.replace(/(\([^)]+\)|[a-zA-Z0-9_.[\]]+)\s*\/\/\s*(\([^)]+\)|[a-zA-Z0-9_.[\]]+)/g, 'Math.floor($1 / $2)');

  // `not in` and `in` membership tests
  s = s.replace(
    /([a-zA-Z0-9_.[\]()]+)\s+not\s+in\s+([a-zA-Z0-9_.[\]()]+)/g,
    '(!__py.has($2, $1))'
  );
  s = s.replace(
    /([a-zA-Z0-9_.[\]()]+)\s+in\s+([a-zA-Z0-9_.[\]()]+)/g,
    '__py.has($2, $1)'
  );

  // Built-in functions
  s = s.replace(/\blen\s*\(/g, '__py.len(');
  s = s.replace(/\bmax\s*\(/g, '__py.max(');
  s = s.replace(/\bmin\s*\(/g, '__py.min(');
  s = s.replace(/\bsum\s*\(/g, '__py.sum(');
  s = s.replace(/\babs\s*\(/g, 'Math.abs(');
  s = s.replace(/\bround\s*\(/g, '__py.round(');
  s = s.replace(/\bsorted\s*\(/g, '__py.sorted(');
  s = s.replace(/\brange\s*\(/g, '__py.range(');
  s = s.replace(/\benumerate\s*\(/g, '__py.enumerate(');
  s = s.replace(/\bprint\s*\(/g, '__py.print(');

  // Logical operators & constants
  s = s.replace(/\bTrue\b/g, 'true');
  s = s.replace(/\bFalse\b/g, 'false');
  s = s.replace(/\bNone\b/g, 'null');
  s = s.replace(/\band\b/g, '&&');
  s = s.replace(/\bor\b/g, '||');
  s = s.replace(/\bnot\s+([a-zA-Z_][a-zA-Z0-9_]*)\b/g, '(!__py.truthy($1))');
  s = s.replace(/\bnot\s*\(/g, '(!(');

  // Restore string literals
  s = s.replace(/__STR_(\d+)__/g, (_, idx) => strings[Number(idx)]);
  return s;
}

/**
 * Compiles indentation-structured Python 3 function code into a runnable JavaScript function
 * with infinite-loop operation guard (__guard()).
 */
export function compilePythonSubsetToJS(pythonCode: string, functionName: string): string {
  const rawLines = pythonCode.replace(/\r\n/g, '\n').split('\n');
  const codeLines: { indent: number; text: string; lineNo: number }[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i];
    // Strip inline comments outside quotes
    let cleaned = '';
    let inQuote: string | null = null;
    for (let c = 0; c < raw.length; c++) {
      const ch = raw[c];
      if ((ch === '"' || ch === "'") && raw[c - 1] !== '\\') {
        if (!inQuote) inQuote = ch;
        else if (inQuote === ch) inQuote = null;
      }
      if (ch === '#' && !inQuote) break;
      cleaned += ch;
    }
    if (!cleaned.trim()) continue;
    // Skip docstrings
    if (cleaned.trim().startsWith('"""') || cleaned.trim().startsWith("'''")) continue;
    const indent = cleaned.match(/^\s*/)?.[0].length ?? 0;
    codeLines.push({ indent, text: cleaned.trim(), lineNo: i + 1 });
  }

  if (codeLines.length === 0) {
    throw new Error('SyntaxError: Empty code submission.');
  }

  const jsOut: string[] = [];
  const indentStack: number[] = [0];
  const declaredVarsStack: Set<string>[] = [new Set<string>()];

  for (let idx = 0; idx < codeLines.length; idx++) {
    const { indent, text, lineNo } = codeLines[idx];

    while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      declaredVarsStack.pop();
      jsOut.push('}');
    }

    const currentScope = declaredVarsStack[declaredVarsStack.length - 1];
    const isDeclared = (v: string) => declaredVarsStack.some((s) => s.has(v));

    // Handle def
    const defMatch = text.match(/^def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)(?:\s*->\s*[^:]+)?\s*:$/);
    if (defMatch) {
      const fnName = defMatch[1];
      const rawParams = defMatch[2]
        .split(',')
        .map((p) => p.split(':')[0].trim())
        .filter(Boolean);
      const fnScope = new Set<string>(rawParams.map((p) => p.split('=')[0].trim()));
      jsOut.push(`function ${fnName}(${rawParams.join(', ')}) {`);
      indentStack.push(indent + 1);
      declaredVarsStack.push(fnScope);
      continue;
    }

    // Handle elif / else
    if (text.startsWith('elif ') && text.endsWith(':')) {
      if (jsOut[jsOut.length - 1] === '}') jsOut.pop();
      const cond = transpilePythonExpr(text.slice(5, -1));
      jsOut.push(`} else if (__py.truthy(${cond})) {`);
      indentStack.push(indent + 1);
      declaredVarsStack.push(new Set<string>());
      continue;
    }

    if (text === 'else:') {
      if (jsOut[jsOut.length - 1] === '}') jsOut.pop();
      jsOut.push('} else {');
      indentStack.push(indent + 1);
      declaredVarsStack.push(new Set<string>());
      continue;
    }

    // Handle if
    if (text.startsWith('if ') && text.endsWith(':')) {
      const cond = transpilePythonExpr(text.slice(3, -1));
      jsOut.push(`if (__py.truthy(${cond})) {`);
      indentStack.push(indent + 1);
      declaredVarsStack.push(new Set<string>());
      continue;
    }

    // Handle while
    if (text.startsWith('while ') && text.endsWith(':')) {
      const cond = transpilePythonExpr(text.slice(6, -1));
      jsOut.push(`while (__guard(${lineNo}) && __py.truthy(${cond})) {`);
      indentStack.push(indent + 1);
      declaredVarsStack.push(new Set<string>());
      continue;
    }

    // Handle for
    const forMatch = text.match(/^for\s+(.+?)\s+in\s+(.+):$/);
    if (forMatch) {
      const targetVars = forMatch[1].split(',').map((v) => v.trim());
      const iterExpr = transpilePythonExpr(forMatch[2]);
      const loopScope = new Set<string>(targetVars);
      if (targetVars.length === 1) {
        jsOut.push(`for (const ${targetVars[0]} of ${iterExpr}) { __guard(${lineNo});`);
      } else {
        jsOut.push(`for (const [${targetVars.join(', ')}] of ${iterExpr}) { __guard(${lineNo});`);
      }
      indentStack.push(indent + 1);
      declaredVarsStack.push(loopScope);
      continue;
    }

    // Handle return / break / continue / pass
    if (text === 'return') {
      jsOut.push('return null;');
      continue;
    }
    if (text.startsWith('return ')) {
      jsOut.push(`return (${transpilePythonExpr(text.slice(7))});`);
      continue;
    }
    if (text === 'break') {
      jsOut.push('break;');
      continue;
    }
    if (text === 'continue') {
      jsOut.push('continue;');
      continue;
    }
    if (text === 'pass') {
      continue;
    }

    // Handle tuple unpacking: a, b = expr1, expr2
    const tupleAssign = text.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
    if (tupleAssign) {
      const v1 = tupleAssign[1];
      const v2 = tupleAssign[2];
      const rhs = tupleAssign[3].split(',').map((e) => transpilePythonExpr(e));
      if (!isDeclared(v1)) {
        currentScope.add(v1);
        jsOut.push(`let ${v1};`);
      }
      if (!isDeclared(v2)) {
        currentScope.add(v2);
        jsOut.push(`let ${v2};`);
      }
      if (rhs.length === 2) {
        jsOut.push(`[${v1}, ${v2}] = [${rhs[0]}, ${rhs[1]}];`);
      } else {
        jsOut.push(`[${v1}, ${v2}] = ${rhs.join(',')};`);
      }
      continue;
    }

    // Handle augmented assignment: x += val
    const augAssign = text.match(/^([a-zA-Z_][a-zA-Z0-9_.[\]]*)\s*(\+=|-=|\*=)\s*(.+)$/);
    if (augAssign) {
      jsOut.push(`${augAssign[1]} ${augAssign[2]} (${transpilePythonExpr(augAssign[3])});`);
      continue;
    }

    // Handle simple variable or indexed assignment: x = val or arr[i] = val
    const simpleAssign = text.match(/^([a-zA-Z_][a-zA-Z0-9_]*(?:\[[^\]]+\])?)\s*=\s*([^=].*)$/);
    if (simpleAssign) {
      const lhs = simpleAssign[1];
      const rhs = transpilePythonExpr(simpleAssign[2]);
      if (!lhs.includes('[') && !isDeclared(lhs)) {
        currentScope.add(lhs);
        jsOut.push(`let ${lhs} = (${rhs});`);
      } else {
        jsOut.push(`${lhs} = (${rhs});`);
      }
      continue;
    }

    // Expression statement (e.g. stack.append(x), print(...))
    jsOut.push(`${transpilePythonExpr(text)};`);
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    jsOut.push('}');
  }

  jsOut.push(`if (typeof ${functionName} !== 'function') { throw new Error("NameError: Function '${functionName}' is not defined."); }`);
  jsOut.push(`return ${functionName}(...__args);`);
  return jsOut.join('\n');
}

function createPythonRuntimeHelpers(stdoutBuffer: string[]) {
  let ops = 0;
  const MAX_OPS = 50000;

  const __guard = (lineNo: number) => {
    ops++;
    if (ops > MAX_OPS) {
      throw new Error(
        `TimeLimitExceededError (line ${lineNo}): Execution exceeded ${MAX_OPS.toLocaleString()} loop operations (possible infinite loop).`
      );
    }
    return true;
  };

  const __py = {
    truthy: (v: any): boolean => {
      if (v === null || v === undefined || v === false || v === 0 || v === '') return false;
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'object') return Object.keys(v).length > 0;
      return Boolean(v);
    },
    len: (v: any): number => {
      if (v == null) throw new Error("TypeError: object of type 'NoneType' has no len()");
      if (typeof v === 'string' || Array.isArray(v)) return v.length;
      if (typeof v === 'object') return Object.keys(v).length;
      throw new Error(`TypeError: object of type '${typeof v}' has no len()`);
    },
    idx: (arr: any, i: number): any => {
      if (!arr || typeof arr.length !== 'number') return undefined;
      return i < 0 ? arr[arr.length + i] : arr[i];
    },
    has: (container: any, item: any): boolean => {
      if (Array.isArray(container)) return container.includes(item);
      if (typeof container === 'string') return container.includes(String(item));
      if (container && typeof container === 'object') {
        return Object.prototype.hasOwnProperty.call(container, item);
      }
      return false;
    },
    dictGet: (obj: any, key: any, defaultVal: any = null) => {
      if (obj && Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];
      return defaultVal;
    },
    repeatList: (arr: any[], count: number) => {
      const out: any[] = [];
      for (let i = 0; i < count; i++) out.push(...arr);
      return out;
    },
    range: (a: number, b?: number, step = 1): number[] => {
      const start = b === undefined ? 0 : a;
      const stop = b === undefined ? a : b;
      const res: number[] = [];
      if (step > 0) {
        for (let i = start; i < stop; i += step) res.push(i);
      } else if (step < 0) {
        for (let i = start; i > stop; i += step) res.push(i);
      }
      return res;
    },
    enumerate: (iterable: any[]): [number, any][] => {
      return Array.from(iterable).map((val, idx) => [idx, val]);
    },
    max: (...args: any[]): any => {
      if (args.length === 1 && Array.isArray(args[0])) return Math.max(...args[0]);
      return Math.max(...args);
    },
    min: (...args: any[]): any => {
      if (args.length === 1 && Array.isArray(args[0])) return Math.min(...args[0]);
      return Math.min(...args);
    },
    sum: (arr: number[]): number => arr.reduce((acc, v) => acc + v, 0),
    round: (val: number, digits = 0): number => {
      const factor = Math.pow(10, digits);
      return Math.round(val * factor) / factor;
    },
    sorted: (arr: any[]): any[] => [...arr].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)),
    print: (...args: any[]) => {
      stdoutBuffer.push(
        args
          .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
          .join(' ')
      );
    },
  };

  return { __guard, __py };
}

function normalizeJsonValue(val: any): string {
  if (val === undefined || val === null) return 'null';
  return JSON.stringify(val);
}

/**
 * Executes user Python code against a problem's test suite using Pyodide WASM when loaded,
 * or the deterministic in-browser Python subset runner otherwise.
 */
export async function executeProblemTests(
  problem: PracticeProblem,
  userCode: string,
  customArgsJson?: string
): Promise<ExecutionSummary> {
  const pyodide = await tryGetPyodideInstance(400);
  const casesToRun = customArgsJson
    ? [
        {
          id: 'custom-1',
          inputDisplay: `Custom Input: ${customArgsJson}`,
          argsJson: customArgsJson,
          expectedJson: problem.testCases[0]?.expectedJson ?? 'null',
        },
      ]
    : problem.testCases;

  const results: TestCaseResult[] = [];
  let passedCount = 0;
  let totalRuntimeMs = 0;
  const engineUsed: ExecutionSummary['engineUsed'] = pyodide
    ? 'Pyodide WASM (CPython 3.12)'
    : 'Client-Side Python Subset Runner';

  for (const tc of casesToRun) {
    const t0 = performance.now();
    const stdoutBuffer: string[] = [];
    try {
      const parsedArgs = JSON.parse(tc.argsJson);
      let actualVal: any;

      if (pyodide) {
        const runnerScript = `
import json, io, sys
_stdout_buf = io.StringIO()
_old_stdout = sys.stdout
sys.stdout = _stdout_buf
try:
${userCode
  .split('\n')
  .map((l) => '    ' + l)
  .join('\n')}
    _args = json.loads(${JSON.stringify(tc.argsJson)})
    _res = ${problem.functionName}(*_args)
    _out_json = json.dumps({"ok": True, "result": _res, "stdout": _stdout_buf.getvalue()})
except Exception as _e:
    _out_json = json.dumps({"ok": False, "error": f"{type(_e).__name__}: {_e}", "stdout": _stdout_buf.getvalue()})
finally:
    sys.stdout = _old_stdout
_out_json
`;
        const rawJson = await pyodide.runPythonAsync(runnerScript);
        const parsed = JSON.parse(rawJson);
        if (parsed.stdout) stdoutBuffer.push(parsed.stdout.trim());
        if (!parsed.ok) {
          throw new Error(parsed.error);
        }
        actualVal = parsed.result;
      } else {
        const jsBody = compilePythonSubsetToJS(userCode, problem.functionName);
        const { __guard, __py } = createPythonRuntimeHelpers(stdoutBuffer);
        // Deep clone arguments so in-place mutations don't corrupt display
        const clonedArgs = JSON.parse(JSON.stringify(parsedArgs));
        const fn = new Function('__args', '__py', '__guard', jsBody);
        actualVal = fn(clonedArgs, __py, __guard);
      }

      const dt = Math.max(0.2, Number((performance.now() - t0).toFixed(2)));
      totalRuntimeMs += dt;

      const actualNorm = normalizeJsonValue(actualVal);
      const expectedNorm = normalizeJsonValue(JSON.parse(tc.expectedJson));
      const passed = customArgsJson ? true : actualNorm === expectedNorm;
      if (passed) passedCount++;

      results.push({
        testId: tc.id,
        passed,
        inputDisplay: tc.isHidden ? `${tc.inputDisplay} (Hidden Edge Case)` : tc.inputDisplay,
        expected: customArgsJson ? '(Custom Run)' : expectedNorm,
        actual: actualNorm,
        stdout: stdoutBuffer.join('\n'),
        runtimeMs: dt,
      });
    } catch (err: any) {
      const dt = Math.max(0.2, Number((performance.now() - t0).toFixed(2)));
      totalRuntimeMs += dt;
      results.push({
        testId: tc.id,
        passed: false,
        inputDisplay: tc.inputDisplay,
        expected: tc.expectedJson,
        actual: 'Error',
        stdout: stdoutBuffer.join('\n'),
        error: err?.message || String(err),
        runtimeMs: dt,
      });
    }
  }

  return {
    passedAll: passedCount === casesToRun.length && casesToRun.length > 0,
    passedCount,
    totalCount: casesToRun.length,
    totalRuntimeMs: Number(totalRuntimeMs.toFixed(2)),
    engineUsed,
    results,
  };
}
