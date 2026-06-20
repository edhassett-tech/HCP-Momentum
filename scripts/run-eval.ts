import { spawn, ChildProcess } from 'child_process';

const BASE_URL = 'http://localhost:3000';

interface ParseResponse {
  primaryGoal: string | null;
  secondaryGoal: string | null;
  confidence: 'high' | 'medium' | 'low';
  abstain: boolean;
  restatement: string;
}

type Mode = 'strict' | 'flexible' | 'abstain' | 'review';

interface TestCase {
  id: number;
  input: string;
  /** goal ID(s) that count as a pass, or null when abstain is expected */
  expected: string | string[] | null;
  expectAbstain: boolean;
  mode: Mode;
  reviewNote?: string;
}

const VALID_GOALS = new Set([
  'book_more_jobs',
  'get_paid_faster',
  'improve_customer_communication',
  'win_repeat_business',
  'stay_on_top',
]);

const CASES: TestCase[] = [
  {
    id: 1,
    input: 'I want to get more jobs on the books',
    expected: 'book_more_jobs',
    expectAbstain: false,
    mode: 'strict',
  },
  {
    id: 2,
    input: "Tired of chasing checks, I need to get paid quicker",
    expected: 'get_paid_faster',
    expectAbstain: false,
    mode: 'strict',
  },
  {
    id: 3,
    input: 'I want more customers leaving me reviews',
    expected: 'win_repeat_business',
    expectAbstain: false,
    mode: 'strict',
  },
  {
    id: 4,
    input: "Summer's busy and I keep losing customers because I'm slow to quote",
    expected: 'book_more_jobs',
    expectAbstain: false,
    mode: 'flexible',
  },
  {
    id: 5,
    input: "Customers always say they didn't know I was coming",
    expected: 'improve_customer_communication',
    expectAbstain: false,
    mode: 'strict',
  },
  {
    id: 6,
    input: "My days are chaos, I lose track of who's where",
    expected: 'stay_on_top',
    expectAbstain: false,
    mode: 'strict',
  },
  {
    id: 7,
    input: 'I do great work but nobody finds me online',
    expected: ['book_more_jobs', 'win_repeat_business'],
    expectAbstain: false,
    mode: 'flexible',
  },
  {
    id: 8,
    input: 'Book more jobs and stop doing invoices by hand at night',
    expected: 'book_more_jobs',
    expectAbstain: false,
    mode: 'flexible',
  },
  {
    id: 9,
    input: 'I want to grow my business',
    expected: null,
    expectAbstain: true,
    mode: 'abstain',
  },
  {
    id: 10,
    input: 'make more money',
    expected: null,
    expectAbstain: true,
    mode: 'abstain',
  },
  {
    id: 11,
    input: 'idk just looking around',
    expected: null,
    expectAbstain: true,
    mode: 'abstain',
  },
  {
    id: 12,
    input: '',
    expected: null,
    expectAbstain: true,
    mode: 'abstain',
  },
  {
    id: 13,
    input: 'I want GPS tracking on all my trucks',
    expected: null,
    expectAbstain: false,
    mode: 'review',
    reviewNote: 'out-of-catalog hardware request — flag whether model abstains or force-maps',
  },
  {
    id: 14,
    input: 'Can you answer my phones with AI?',
    expected: null,
    expectAbstain: false,
    mode: 'review',
    reviewNote: 'out-of-catalog AI feature request — flag whether model abstains or force-maps',
  },
  {
    id: 15,
    input: 'I need to hire two more techs',
    expected: null,
    expectAbstain: false,
    mode: 'review',
    reviewNote: 'HR/staffing — expect abstain or graceful non-catalog handling; flag if force-fitted to a goal',
  },
  {
    id: 16,
    input: 'halp me git my plumbin jobs on the calendar',
    expected: 'stay_on_top',
    expectAbstain: false,
    mode: 'strict',
  },
];

// ── Server management ────────────────────────────────────────────────────────

async function ping(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goalText: 'test' }),
      signal: AbortSignal.timeout(3000),
    });
    return res.status < 500;
  } catch {
    return false;
  }
}

async function ensureServer(): Promise<ChildProcess | null> {
  if (await ping()) {
    console.log('Dev server already running at localhost:3000.\n');
    return null;
  }

  console.log('Starting dev server...');
  const proc = spawn('npm', ['run', 'dev'], {
    cwd: process.cwd(),
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    await sleep(1500);
    if (await ping()) {
      console.log('Dev server ready.\n');
      return proc;
    }
    process.stdout.write('.');
  }

  proc.kill();
  throw new Error('Dev server did not become ready within 45s');
}

// ── API call ─────────────────────────────────────────────────────────────────

async function callParse(goalText: string): Promise<ParseResponse> {
  const res = await fetch(`${BASE_URL}/api/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'Demo',
      businessName: 'Demo Co',
      employees: '5',
      industry: 'plumbing',
      goalText,
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<ParseResponse>;
}

// ── Verdict logic ─────────────────────────────────────────────────────────────

function verdict(tc: TestCase, actual: ParseResponse): 'PASS' | 'FAIL' | 'REVIEW' {
  if (tc.mode === 'review') return 'REVIEW';

  if (tc.mode === 'abstain') {
    return actual.abstain ? 'PASS' : 'FAIL';
  }

  if (actual.abstain || actual.primaryGoal === null) return 'FAIL';

  const allowed = Array.isArray(tc.expected) ? tc.expected : [tc.expected as string];
  return allowed.includes(actual.primaryGoal) ? 'PASS' : 'FAIL';
}

// ── Formatting ────────────────────────────────────────────────────────────────

function col(s: string, w: number): string {
  return s.length >= w ? s.slice(0, w - 1) + '…' : s.padEnd(w);
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  let devProc: ChildProcess | null = null;

  try {
    devProc = await ensureServer();

    type ResultRow = {
      tc: TestCase;
      actual: ParseResponse | null;
      err: string | null;
      v: 'PASS' | 'FAIL' | 'REVIEW';
    };

    const rows: ResultRow[] = [];

    for (const tc of CASES) {
      process.stdout.write(`  [${tc.id.toString().padStart(2)}] ${tc.input.slice(0, 50) || '(blank)'}...`);
      try {
        const actual = await callParse(tc.input);
        const v = verdict(tc, actual);
        rows.push({ tc, actual, err: null, v });
        console.log(` ${v}`);
      } catch (e) {
        const v = tc.mode === 'review' ? 'REVIEW' : 'FAIL';
        rows.push({ tc, actual: null, err: String(e), v });
        console.log(` ERROR — ${e}`);
      }
    }

    // ── Results table ─────────────────────────────────────────────────────────
    const LINE = '─'.repeat(130);
    console.log('\n' + LINE);
    console.log(
      col('#', 3) +
      col('Input', 55) +
      col('Expected', 32) +
      col('Actual goal', 32) +
      col('Conf', 7) +
      col('Abs', 6) +
      'Result'
    );
    console.log(LINE);

    for (const { tc, actual, err, v } of rows) {
      const inputDisplay = tc.input === '' ? '(blank)' : tc.input;
      const expectedDisplay = tc.expectAbstain
        ? 'abstain=true'
        : Array.isArray(tc.expected)
        ? tc.expected.join(' OR ')
        : (tc.expected ?? '— REVIEW —');
      const actualGoal = err ? 'ERROR' : (actual?.primaryGoal ?? 'null');
      const conf = err ? '-' : (actual?.confidence ?? '-');
      const abs = err ? '-' : String(actual?.abstain ?? '-');

      console.log(
        col(String(tc.id), 3) +
        col(inputDisplay, 55) +
        col(expectedDisplay, 32) +
        col(actualGoal, 32) +
        col(conf, 7) +
        col(abs, 6) +
        v
      );
    }

    console.log(LINE);

    // ── Summary stats ─────────────────────────────────────────────────────────
    const strictIds = new Set([1, 2, 3, 5, 6, 16]);
    const strictRows = rows.filter(r => strictIds.has(r.tc.id));
    const strictPass = strictRows.filter(r => r.v === 'PASS').length;

    const flexIds = new Set([4, 7, 8]);
    const flexRows = rows.filter(r => flexIds.has(r.tc.id));
    const flexPass = flexRows.filter(r => r.v === 'PASS').length;

    const abstainIds = new Set([9, 10, 11, 12]);
    const abstainRows = rows.filter(r => abstainIds.has(r.tc.id));
    const abstainPass = abstainRows.filter(r => r.v === 'PASS').length;

    const outOfCatalog = rows.filter(r => {
      const g = r.actual?.primaryGoal;
      return g !== null && g !== undefined && !VALID_GOALS.has(g);
    }).length;

    console.log('\n── Summary ──────────────────────────────────────────────────────────────────');
    console.log(`Top-1 accuracy  (strict baseline — rows 1,2,3,5,6,16):  ${strictPass}/${strictRows.length}`);
    console.log(`Pass rate       (flexible — rows 4,7,8):                 ${flexPass}/${flexRows.length}`);
    console.log(`Abstention rate (rows 9–12):                             ${abstainPass}/${abstainRows.length}`);
    console.log(`Out-of-catalog goals across all 16 rows:                 ${outOfCatalog}  (should be 0)`);

    // ── Review case detail ────────────────────────────────────────────────────
    const reviewRows = rows.filter(r => r.tc.mode === 'review');
    if (reviewRows.length > 0) {
      console.log('\n── Review cases (manual judgment) ───────────────────────────────────────────');
      for (const { tc, actual, err } of reviewRows) {
        console.log(`\nCase ${tc.id}: "${tc.input}"`);
        console.log(`  Prompt note:  ${tc.reviewNote}`);
        if (err) {
          console.log(`  ERROR: ${err}`);
        } else if (actual) {
          console.log(`  primaryGoal:  ${actual.primaryGoal ?? 'null'}`);
          console.log(`  abstain:      ${actual.abstain}`);
          console.log(`  confidence:   ${actual.confidence}`);
          console.log(`  restatement:  ${actual.restatement}`);
        }
      }
    }
  } finally {
    if (devProc) {
      console.log('\nStopping dev server...');
      devProc.kill();
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
