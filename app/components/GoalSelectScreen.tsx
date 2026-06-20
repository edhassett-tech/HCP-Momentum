'use client';

import { GoalId, GOALS } from '@/lib/activationMap';

interface Props {
  firstName: string;
  completedGoalId: GoalId | null;
  onGoalStart: (goalId: GoalId) => void;
  onDashboard: () => void;
}

export default function GoalSelectScreen({ firstName, completedGoalId, onGoalStart, onDashboard }: Props) {
  const completedGoal = completedGoalId ? GOALS.find(g => g.id === completedGoalId) : null;
  const remainingGoals = GOALS.filter(g => g.id !== completedGoalId);

  return (
    <div className="flex flex-col px-6 pt-8 pb-6 gap-6">

      {/* Heading */}
      <h2 className="text-xl font-bold text-slate-900 leading-snug">
        Nice work{firstName ? `, ${firstName}` : ''} — want to set up another goal?
      </h2>

      {/* Completed goal */}
      {completedGoal && (
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-green-50 border border-green-100">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-700 flex-1">{completedGoal.label}</p>
          <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
            Completed
          </span>
        </div>
      )}

      {/* Remaining goals */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
          {completedGoal ? 'Other goals' : 'Choose a goal'}
        </p>
        {remainingGoals.map(goal => (
          <div key={goal.id} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-slate-200 bg-white">
            <p className="text-sm font-medium text-slate-800 flex-1">{goal.label}</p>
            <button
              onClick={() => onGoalStart(goal.id)}
              className="h-8 px-3.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors shrink-0"
            >
              Start
            </button>
          </div>
        ))}
      </div>

      {/* Dashboard link */}
      <button
        onClick={onDashboard}
        className="text-xs text-slate-400 hover:text-slate-600 text-center transition-colors py-1 mt-auto"
      >
        Go to main dashboard
      </button>
    </div>
  );
}
