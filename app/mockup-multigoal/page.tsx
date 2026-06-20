'use client';

import { useState } from 'react';

// ─── Hardcoded example data ──────────────────────────────────────────────────

const COMPLETED = {
  label: 'Get paid faster',
  milestones: [
    { title: 'Turn on payments' },
    { title: 'Send your first invoice' },
    { title: 'Get paid instantly' },
  ],
};

const ACTIVE = {
  label: 'Book more jobs',
  progress: '1 of 3 done',
  milestones: [
    {
      title: 'Get found online',
      nextAction: 'Set up your online booking page',
      status: 'done' as const,
    },
    {
      title: 'Quote on the spot',
      nextAction: 'Build a starter price book and estimate template',
      status: 'pending' as const,
    },
    {
      title: 'Fill your calendar',
      nextAction: 'Add your availability',
      status: 'pending' as const,
    },
  ],
};

const COLLAPSED_GOAL = {
  label: 'Improve customer communication',
  milestones: [
    {
      title: 'Set up automated reminders',
      nextAction: 'Turn on appointment reminder texts',
    },
    {
      title: 'Send a follow-up',
      nextAction: 'Create a job follow-up message template',
    },
    {
      title: 'Collect a review',
      nextAction: 'Enable automated review requests',
    },
  ],
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MockupMultigoal() {
  const [thirdExpanded, setThirdExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center py-10 px-4 gap-4">

      {/* Watermark label */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        Direction mockup — not wired
      </p>

      {/* Phone shell */}
      <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
        {/* Notch */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-24 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-5 pt-4 pb-8 flex flex-col gap-4" style={{ maxHeight: 780 }}>

          {/* Header */}
          <div className="mb-1">
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-0.5">Your goals</p>
            <h1 className="text-xl font-bold text-slate-900">Mike&apos;s setup</h1>
          </div>

          {/* ── 1. Completed goal ─────────────────────────────────────── */}
          <section className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3.5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">{COMPLETED.label}</p>
              <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full shrink-0">
                Completed
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {COMPLETED.milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-xs text-slate-400 line-through decoration-slate-300">{m.title}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── 2. Active goal — expanded ─────────────────────────────── */}
          <section className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3.5 flex flex-col gap-3">
            {/* Goal header */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">{ACTIVE.label}</p>
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full shrink-0">
                Active · {ACTIVE.progress}
              </span>
            </div>

            {/* Milestone rows — same visual style as Screen 3 */}
            <div className="flex flex-col gap-2">
              {ACTIVE.milestones.map((m, i) =>
                m.status === 'done' ? (
                  <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-green-50 border border-green-100">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400 line-through decoration-slate-300">{m.title}</p>
                      <p className="text-xs text-slate-300 mt-0.5">{m.nextAction}</p>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex flex-col gap-2 px-3 py-3 rounded-xl border border-slate-200 bg-white">
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{m.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{m.nextAction}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="flex-1 h-7 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-default">
                        Mark done
                      </button>
                      <button className="h-7 px-3 rounded-lg border border-slate-200 text-slate-400 text-xs font-medium cursor-default whitespace-nowrap">
                        Skip for now
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* ── 3. Collapsed goal ─────────────────────────────────────── */}
          <section className={`rounded-2xl border px-4 py-3.5 flex flex-col gap-3 transition-colors duration-200 ${
            thirdExpanded ? 'border-slate-200 bg-white' : 'border-slate-150 bg-slate-50'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <p className={`text-sm font-semibold transition-colors duration-200 ${
                thirdExpanded ? 'text-slate-900' : 'text-slate-400'
              }`}>
                {COLLAPSED_GOAL.label}
              </p>
              {!thirdExpanded ? (
                <button
                  onClick={() => setThirdExpanded(true)}
                  className="h-7 px-3.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shrink-0"
                >
                  Start
                </button>
              ) : (
                <button
                  onClick={() => setThirdExpanded(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                >
                  Collapse ↑
                </button>
              )}
            </div>

            {/* Milestone rows — only shown when expanded */}
            {thirdExpanded && (
              <div className="flex flex-col gap-2">
                {COLLAPSED_GOAL.milestones.map((m, i) => (
                  <div key={i} className="flex flex-col gap-2 px-3 py-3 rounded-xl border border-slate-200 bg-white">
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{m.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{m.nextAction}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="flex-1 h-7 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-default">
                        Mark done
                      </button>
                      <button className="h-7 px-3 rounded-lg border border-slate-200 text-slate-400 text-xs font-medium cursor-default whitespace-nowrap">
                        Skip for now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
