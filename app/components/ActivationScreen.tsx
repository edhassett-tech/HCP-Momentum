'use client';

import { useState, useEffect } from 'react';
import { GoalId, GOALS, DEFAULT_STARTER, Milestone } from '@/lib/activationMap';

type RowStatus = 'pending' | 'celebrating' | 'done' | 'skipped';

interface Props {
  goalId: GoalId | null;
  onComplete: () => void;
  onRestart: () => void;
}

export default function ActivationScreen({ goalId, onComplete, onRestart }: Props) {
  const goal = goalId ? GOALS.find(g => g.id === goalId) : null;
  const milestones: Milestone[] = goal ? goal.milestones : DEFAULT_STARTER;
  const goalLabel = goal ? goal.label : 'Getting started';

  const [statuses, setStatuses] = useState<RowStatus[]>(milestones.map(() => 'pending'));

  // Count celebrating + done for the progress bar so it updates immediately on Mark done
  const completedCount = statuses.filter(s => s === 'done' || s === 'celebrating').length;
  const allResolved = statuses.every(s => s === 'done' || s === 'skipped');

  useEffect(() => {
    if (allResolved) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allResolved]);

  function markDone(i: number) {
    setStatuses(prev => { const n = [...prev]; n[i] = 'celebrating'; return n; });
  }
  function confirmCelebration(i: number) {
    setStatuses(prev => { const n = [...prev]; n[i] = 'done'; return n; });
  }
  function skip(i: number) {
    setStatuses(prev => { const n = [...prev]; n[i] = 'skipped'; return n; });
  }

  return (
    <div className="flex flex-col px-6 pt-8 pb-6 gap-6">

      {/* Goal label */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-1">Your focus</p>
        <h2 className="text-xl font-bold text-slate-900 leading-snug">{goalLabel}</h2>
      </div>

      {/* Progress — fills immediately when Mark done is tapped (celebrating counts) */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1.5">
          {milestones.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                statuses[i] === 'done' || statuses[i] === 'celebrating' ? 'bg-green-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-slate-500 shrink-0 tabular-nums">
          {completedCount} of {milestones.length} done
        </span>
      </div>

      {/* Milestone rows */}
      <div className="flex flex-col gap-3">
        {milestones.map((m, i) => {
          const status = statuses[i];

          if (status === 'done') {
            return (
              <div key={i} className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-green-50 border border-green-100">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 line-through decoration-slate-300">{m.title}</p>
                  <p className="text-xs text-slate-300 mt-0.5">{m.nextAction}</p>
                </div>
              </div>
            );
          }

          if (status === 'skipped') {
            return (
              <div key={i} className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 mt-0.5 text-slate-300">
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">{m.title}</p>
                  <p className="text-xs text-slate-300 mt-0.5">Skipped — come back any time</p>
                </div>
              </div>
            );
          }

          if (status === 'celebrating') {
            return (
              <div key={i} className="flex flex-col gap-3 px-4 py-3.5 rounded-2xl bg-green-50 border border-green-200">
                <div className="flex items-start gap-3">
                  <span className="text-xl leading-none mt-0.5">🎉</span>
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Nice work!</p>
                    <p className="text-sm font-medium text-slate-900 leading-snug">{m.firstValue}</p>
                  </div>
                </div>
                <button
                  onClick={() => confirmCelebration(i)}
                  className="h-9 w-full rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 active:bg-green-800 transition-colors"
                >
                  Continue →
                </button>
              </div>
            );
          }

          // pending
          return (
            <div key={i} className="flex flex-col gap-3 px-4 py-4 rounded-2xl border border-slate-200 bg-white">
              <div>
                <p className="text-sm font-semibold text-slate-900">{m.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{m.nextAction}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => markDone(i)}
                  className="flex-1 h-9 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors"
                >
                  Mark done
                </button>
                <button
                  onClick={() => skip(i)}
                  className="h-9 px-3.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 active:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  Skip for now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skip link */}
      <button
        onClick={onRestart}
        className="text-xs text-slate-400 hover:text-slate-600 text-center transition-colors py-1"
      >
        Skip to explore everything
      </button>
    </div>
  );
}
