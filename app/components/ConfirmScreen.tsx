import { GOALS, GoalId } from '@/lib/activationMap';
import type { ParseResponse } from '@/lib/types';

interface Props {
  firstName: string;
  result: ParseResponse;
  onConfirm: (goalId: GoalId) => void;
  onNotQuite: () => void;
}

export default function ConfirmScreen({ firstName, result, onConfirm, onNotQuite }: Props) {
  const goal = GOALS.find(g => g.id === result.primaryGoal);

  return (
    <div className="flex flex-col px-6 pt-10 pb-8 flex-1">
      {/* Header */}
      <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-2">
        Got it{firstName ? `, ${firstName}` : ''}
      </p>
      <h2 className="text-2xl font-bold text-slate-900 leading-snug mb-6">
        Did we get that right?
      </h2>

      {/* Restatement */}
      <div className="rounded-2xl bg-blue-50 border border-blue-200 px-5 py-4 mb-8">
        <p className="text-xs font-medium text-blue-500 mb-1.5">Sounds like your main goal is…</p>
        <p className="text-base text-slate-800 leading-relaxed">{result.restatement}</p>
        {goal && (
          <p className="mt-3 text-sm font-semibold text-blue-600">→ {goal.label}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-auto">
        <button
          onClick={() => result.primaryGoal && onConfirm(result.primaryGoal)}
          className="h-14 w-full rounded-2xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Yes, let&apos;s go
        </button>
        <button
          onClick={onNotQuite}
          className="h-12 w-full rounded-2xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
        >
          Not quite
        </button>
      </div>
    </div>
  );
}
