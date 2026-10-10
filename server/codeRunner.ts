import vm from 'vm';
import { spawn } from 'child_process';

export interface TestCase {
  id: number;
  input: any[];
  expected: any;
  description?: string;
  isHidden?: boolean;
}

export interface ExecutionResult {
  allPassed: boolean;
  passedTests: number;
  totalTests: number;
  executionTimeMs: number;
  error?: string;
  results: {
    id: number;
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    timeMs: number;
    error?: string;
    isHidden?: boolean;
  }[];
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== 'object' && typeof b !== 'object') return a === b;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const k of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
    if (!deepEqual(a[k], b[k])) return false;
  }
  return true;
}

export async function executeCodeInSandbox(
  code: string,
  language: string,
  entryFunctionName: string,
  testCases: TestCase[]
): Promise<ExecutionResult> {
  const startTime = Date.now();

  if (language === 'python') {
    return runPythonSandbox(code, entryFunctionName, testCases);
  }

  // JavaScript isolated execution using isolated vm context
  return runJavaScriptSandbox(code, entryFunctionName, testCases, startTime);
}

function runJavaScriptSandbox(
  code: string,
  entryFunctionName: string,
  testCases: TestCase[],
  globalStartTime: number
): ExecutionResult {
  const sandbox = {
    Math,
    Number,
    String,
    Array,
    Object,
    Boolean,
    RegExp,
    Map,
    Set,
    JSON,
    console: {
      log: () => {},
      error: () => {},
      warn: () => {},
    },
  };

  const context = vm.createContext(sandbox);

  try {
    const script = new vm.Script(code, { filename: 'submission.js' });
    script.runInContext(context, { timeout: 1500 });
  } catch (err: any) {
    return {
      allPassed: false,
      passedTests: 0,
      totalTests: testCases.length,
      executionTimeMs: Date.now() - globalStartTime,
      error: `Compilation/Syntax Error: ${err.message}`,
      results: testCases.map((tc) => ({
        id: tc.id,
        passed: false,
        input: JSON.stringify(tc.input),
        expected: JSON.stringify(tc.expected),
        actual: 'Error',
        error: err.message,
        timeMs: 0,
        isHidden: tc.isHidden,
      })),
    };
  }

  const fn = (context as any)[entryFunctionName];
  if (typeof fn !== 'function') {
    return {
      allPassed: false,
      passedTests: 0,
      totalTests: testCases.length,
      executionTimeMs: Date.now() - globalStartTime,
      error: `Entry function '${entryFunctionName}' was not found. Please do not rename the main function signature.`,
      results: [],
    };
  }

  const results: ExecutionResult['results'] = [];
  let totalExecutionMs = 0;

  for (const tc of testCases) {
    const tcStart = Date.now();
    try {
      const clonedArgs = JSON.parse(JSON.stringify(tc.input));
      const runnerCode = `(function() {
        return ${entryFunctionName}.apply(null, ${JSON.stringify(clonedArgs)});
      })()`;

      const actualResult = vm.runInContext(runnerCode, context, { timeout: 1500 });
      const elapsed = Math.max(1, Date.now() - tcStart);
      totalExecutionMs += elapsed;

      const isPassed = deepEqual(actualResult, tc.expected);

      results.push({
        id: tc.id,
        passed: isPassed,
        input: JSON.stringify(tc.input),
        expected: JSON.stringify(tc.expected),
        actual: JSON.stringify(actualResult),
        timeMs: elapsed,
        isHidden: tc.isHidden,
      });
    } catch (testErr: any) {
      const elapsed = Date.now() - tcStart;
      totalExecutionMs += elapsed;
      results.push({
        id: tc.id,
        passed: false,
        input: JSON.stringify(tc.input),
        expected: JSON.stringify(tc.expected),
        actual: 'Runtime Error',
        error: testErr.message || 'Execution error or timeout',
        timeMs: elapsed,
        isHidden: tc.isHidden,
      });
    }
  }

  const passedCount = results.filter((r) => r.passed).length;
  return {
    allPassed: passedCount === testCases.length,
    passedTests: passedCount,
    totalTests: testCases.length,
    executionTimeMs: totalExecutionMs,
    results,
  };
}

function runPythonSandbox(
  code: string,
  entryFunctionName: string,
  testCases: TestCase[]
): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const script = `
import json, sys

${code}

test_cases = json.loads('''${JSON.stringify(testCases)}''')
results = []
all_passed = True

for tc in test_cases:
    try:
        args = tc['input']
        fn = getattr(sys.modules[__name__], '${entryFunctionName}', None)
        if not fn:
            results.append({'id': tc['id'], 'passed': False, 'error': 'Function not found'})
            all_passed = False
            continue
        res = fn(*args)
        passed = (res == tc['expected'])
        if not passed:
            all_passed = False
        results.append({
            'id': tc['id'],
            'passed': passed,
            'input': json.dumps(tc['input']),
            'expected': json.dumps(tc['expected']),
            'actual': json.dumps(res),
            'timeMs': 2
        })
    except Exception as e:
        all_passed = False
        results.append({
            'id': tc['id'],
            'passed': False,
            'error': str(e),
            'actual': 'Runtime Exception',
            'timeMs': 1
        })

print(json.dumps({'allPassed': all_passed, 'results': results}))
`;

    const py = spawn('python3', ['-c', script], { timeout: 2500 });
    let stdout = '';
    let stderr = '';

    py.stdout.on('data', (d) => { stdout += d.toString(); });
    py.stderr.on('data', (d) => { stderr += d.toString(); });

    py.on('close', (codeStatus) => {
      if (codeStatus !== 0 || stderr) {
        return resolve({
          allPassed: false,
          passedTests: 0,
          totalTests: testCases.length,
          executionTimeMs: 0,
          error: stderr || `Python process exited with error code ${codeStatus}`,
          results: [],
        });
      }

      try {
        const parsed = JSON.parse(stdout.trim());
        const passedCount = parsed.results.filter((r: any) => r.passed).length;
        resolve({
          allPassed: parsed.allPassed,
          passedTests: passedCount,
          totalTests: testCases.length,
          executionTimeMs: 15,
          results: parsed.results,
        });
      } catch (err: any) {
        resolve({
          allPassed: false,
          passedTests: 0,
          totalTests: testCases.length,
          executionTimeMs: 0,
          error: `Output parser error: ${err.message}`,
          results: [],
        });
      }
    });

    py.on('error', (err) => {
      resolve({
        allPassed: false,
        passedTests: 0,
        totalTests: testCases.length,
        executionTimeMs: 0,
        error: `Python runner unavailable on system: ${err.message}`,
        results: [],
      });
    });
  });
}
