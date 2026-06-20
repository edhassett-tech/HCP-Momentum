import { GOALS, GoalId } from '@/lib/activationMap';

interface Props {
  goalId: GoalId | null;  // null = DEFAULT_STARTER
}

export default function PlaceholderScreen({ goalId }: Props) {
  const goal = goalId ? GOALS.find(g => g.id === goalId) : null;

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-5 px-8 text-center">
      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div>
        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">
          Screen 3 placeholder
        </p>
        <h2 className="text-xl font-bold text-slate-900">
          {goal ? goal.label : 'Getting started'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {goal ? 'Activation path goes here.' : 'Default starter path goes here.'}
        </p>
      </div>

      <div className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">goal id</p>
        <p className="text-sm font-mono text-slate-600">{goalId ?? 'DEFAULT_STARTER'}</p>
      </div>
    </div>
  );
}
