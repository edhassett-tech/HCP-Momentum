import { GOALS, GoalId } from '@/lib/activationMap';

interface Props {
  firstName: string;
  primaryGoal: GoalId;
  onConfirm: (goalId: GoalId) => void;
  onNotQuite: () => void;
}

export default function ConfirmScreen({ firstName, primaryGoal, onConfirm, onNotQuite }: Props) {
  const goal = GOALS.find(g => g.id === primaryGoal);

  return (
    <div className="flex flex-col px-6 pt-12 pb-8 flex-1">
      <p className="text-sm text-slate-500 mb-1">Got it{firstName ? `, ${firstName}` : ''}.</p>
      <h2 className="text-2xl font-bold text-slate-900 leading-snug mb-2">
        Sounds like your main goal is:
      </h2>
      <p className="text-xl font-semibold text-blue-600 mb-auto">
        {goal?.label ?? primaryGoal}
      </p>

      <div className="flex flex-col gap-3 pt-8">
        <button
          onClick={() => onConfirm(primaryGoal)}
          className="h-14 w-full rounded-2xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          You got it, let&apos;s go
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
