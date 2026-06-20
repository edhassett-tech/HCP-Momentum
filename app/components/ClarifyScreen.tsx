'use client';

import { useState } from 'react';
import { GOALS, GoalId } from '@/lib/activationMap';
import type { FormState, ParseResponse } from '@/lib/types';

interface Props {
  form: FormState;
  acknowledgment: string;   // adaptive sentence from the initial parse restatement
  onGoalChosen: (goalId: GoalId) => void;
  onSkip: () => void;
  onReparsed: (result: ParseResponse) => void;
}

const LOCKED_NUDGE =
  "Still not quite catching it — pick one below to get started, or skip for now.";

export default function ClarifyScreen({ form, acknowledgment, onGoalChosen, onSkip, onReparsed }: Props) {
  const [typed, setTyped] = useState('');
  const [loading, setLoading] = useState(false);
  const [nudge, setNudge] = useState(acknowledgment || 'Which of these fits best?');
  const [locked, setLocked] = useState(false);   // true after the one retry is spent

  async function handleTypedSubmit() {
    if (!typed.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, goalText: typed }),
      });
      const data: ParseResponse = await res.json();
      if (!data.abstain && data.primaryGoal) {
        onReparsed(data);
      } else {
        setNudge(LOCKED_NUDGE);
        setLocked(true);
      }
    } catch {
      setNudge(LOCKED_NUDGE);
      setLocked(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col px-6 pt-8 pb-8 gap-5">
      {/* Header — acknowledgment replaces the generic subtitle */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 leading-snug mb-2">
          Let&apos;s find your focus
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">{nudge}</p>
      </div>

      {/* Goal chips — always present */}
      <div className="flex flex-col gap-2">
        {GOALS.map(goal => (
          <button
            key={goal.id}
            onClick={() => onGoalChosen(goal.id)}
            className="w-full text-left px-4 py-3.5 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 active:bg-blue-100 transition-colors group"
          >
            <span className="text-sm font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
              {goal.label}
            </span>
          </button>
        ))}
      </div>

      {/* Type-it-yourself — removed after one failed retry */}
      {!locked && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 shrink-0">or type it yourself</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="flex flex-col gap-2">
            <textarea
              value={typed}
              onChange={e => setTyped(e.target.value)}
              placeholder="Describe what you want to get done first…"
              rows={3}
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none transition-colors"
            />
            <button
              onClick={handleTypedSubmit}
              disabled={!typed.trim() || loading}
              className="h-11 w-full rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-40 transition-colors"
            >
              {loading ? 'Finding your path…' : 'Find my path'}
            </button>
          </div>
        </>
      )}

      {/* Skip — always present */}
      <button
        onClick={onSkip}
        className="text-sm text-slate-400 hover:text-slate-600 transition-colors text-center py-1"
      >
        Skip for now
      </button>
    </div>
  );
}
