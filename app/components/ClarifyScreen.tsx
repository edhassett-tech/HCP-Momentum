'use client';

import { GOALS, GoalId } from '@/lib/activationMap';
import type { FormState, ParseResponse } from '@/lib/types';

interface Props {
  acknowledgment: string;
  onGoalChosen: (goalId: GoalId) => void;
  onSkip: () => void;
}

export default function ClarifyScreen({ acknowledgment, onGoalChosen, onSkip }: Props) {
  return (
    <div className="flex flex-col px-6 pt-8 pb-8 gap-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 leading-snug mb-2">
          Let&apos;s find your focus
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {acknowledgment || 'Which of these feels most urgent right now?'}
        </p>
      </div>

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

      <button
        onClick={onSkip}
        className="text-sm text-slate-400 hover:text-slate-600 transition-colors text-center py-1"
      >
        Skip for now
      </button>

      <span className="text-sm text-slate-400 text-center py-1 cursor-default select-none">
        Prefer to chat?
      </span>
    </div>
  );
}
