'use client';

import { useState } from 'react';
import { GoalId, GOALS, DEFAULT_STARTER, Milestone } from '@/lib/activationMap';

interface Props {
  goalId: GoalId | null;
  onRestart: () => void;
}

type CardState = 'action' | 'celebrating';

export default function ActivationScreen({ goalId, onRestart }: Props) {
  const goal = goalId ? GOALS.find(g => g.id === goalId) : null;
  const milestones: Milestone[] = goal ? goal.milestones : DEFAULT_STARTER;
  const goalLabel = goal ? goal.label : 'Getting started';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardState, setCardState] = useState<CardState>('action');
  const [allDone, setAllDone] = useState(false);

  function handleMarkDone() {
    setCardState('celebrating');
  }

  function handleContinue() {
    if (currentIndex >= milestones.length - 1) {
      setAllDone(true);
    } else {
      setCurrentIndex(i => i + 1);
      setCardState('action');
    }
  }

  if (allDone) {
    return <AllDoneState goalLabel={goalLabel} milestones={milestones} onRestart={onRestart} />;
  }

  const current = milestones[currentIndex];
  const isLast = currentIndex === milestones.length - 1;
  const doneCount = cardState === 'celebrating' ? currentIndex + 1 : currentIndex;

  return (
    <div className="flex flex-col px-6 pt-8 pb-6 gap-5">

      {/* Goal label */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-1">Your focus</p>
        <h2 className="text-xl font-bold text-slate-900 leading-snug">{goalLabel}</h2>
      </div>

      {/* Progress bar + count */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1.5">
          {milestones.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                i < doneCount
                  ? 'bg-green-500'
                  : i === currentIndex && cardState === 'action'
                  ? 'bg-blue-500'
                  : i < doneCount || (i === currentIndex && cardState === 'celebrating')
                  ? 'bg-green-500'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-slate-500 shrink-0 tabular-nums">
          {currentIndex + 1} of {milestones.length}
        </span>
      </div>

      {/* Milestone path */}
      <div className="flex flex-col">
        {milestones.map((m, i) => {
          const isDone = i < doneCount;
          const isCurrent = i === currentIndex;
          const isUpcoming = i > currentIndex;
          return (
            <div key={i} className="flex gap-3">
              {/* Track spine */}
              <div className="flex flex-col items-center w-6 shrink-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isDone ? 'bg-green-500' : isCurrent ? 'bg-blue-600' : 'bg-slate-200'
                }`}>
                  {isDone ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span className={`text-xs font-bold leading-none ${isCurrent ? 'text-white' : 'text-slate-400'}`}>
                      {i + 1}
                    </span>
                  )}
                </div>
                {i < milestones.length - 1 && (
                  <div className={`w-px my-1 transition-colors duration-300 ${isDone ? 'bg-green-300' : 'bg-slate-200'}`}
                    style={{ height: 28 }} />
                )}
              </div>

              {/* Milestone text */}
              <div className="pb-4 pt-0.5">
                <p className={`text-sm font-semibold leading-snug transition-colors duration-300 ${
                  isDone ? 'text-slate-400 line-through decoration-slate-300'
                  : isCurrent ? 'text-slate-900'
                  : 'text-slate-400'
                }`}>
                  {m.title}
                </p>
                <p className={`text-xs mt-0.5 transition-colors duration-300 ${
                  isDone || isUpcoming ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {m.feature}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next best action card ↔ celebration card */}
      {cardState === 'action' ? (
        <div className="rounded-2xl bg-blue-50 border border-blue-200 px-5 py-4 flex flex-col gap-3">
          <div>
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1.5">
              Next best action
            </p>
            <p className="text-sm font-medium text-slate-900 leading-snug">
              {current.nextAction}
            </p>
          </div>
          <button
            onClick={handleMarkDone}
            className="h-11 w-full rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            Mark done
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-green-50 border border-green-200 px-5 py-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl leading-none mt-0.5">🎉</span>
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
                Nice work!
              </p>
              <p className="text-sm font-medium text-slate-900 leading-snug">
                {current.firstValue}
              </p>
            </div>
          </div>
          <button
            onClick={handleContinue}
            className="h-11 w-full rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 active:bg-green-800 transition-colors"
          >
            {isLast ? 'Finish' : 'Next step →'}
          </button>
        </div>
      )}

      {/* Skip link */}
      <button
        onClick={onRestart}
        className="text-xs text-slate-400 hover:text-slate-600 text-center transition-colors py-1 mt-1"
      >
        Skip to explore everything
      </button>
    </div>
  );
}

function AllDoneState({
  goalLabel,
  milestones,
  onRestart,
}: {
  goalLabel: string;
  milestones: Milestone[];
  onRestart: () => void;
}) {
  return (
    <div className="flex flex-col items-center px-6 pt-10 pb-8 gap-5 flex-1">
      <span className="text-5xl">🎉</span>

      <div className="text-center">
        <p className="text-xs font-semibold tracking-widest text-green-500 uppercase mb-2">
          All done
        </p>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          You&apos;re off to a great start
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          You&apos;ve completed all three steps for{' '}
          <span className="font-medium text-slate-700">{goalLabel}</span>.
        </p>
      </div>

      <div className="w-full flex flex-col gap-2">
        {milestones.map((m, i) => (
          <div key={i} className="flex items-center gap-2.5 px-3.5 py-2.5 bg-green-50 rounded-xl">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700">{m.title}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onRestart}
        className="text-xs text-slate-400 hover:text-slate-600 transition-colors py-1 mt-auto"
      >
        Skip to explore everything
      </button>
    </div>
  );
}
