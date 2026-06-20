'use client';

import { useState, useCallback } from 'react';
import IntakeForm from './IntakeForm';
import PhoneFrame from './PhoneFrame';
import ConfirmScreen from './ConfirmScreen';
import ClarifyScreen from './ClarifyScreen';
import ActivationScreen from './ActivationScreen';
import GoalSelectScreen from './GoalSelectScreen';
import type { GoalId } from '@/lib/activationMap';
import type { FormState, ParseResponse } from '@/lib/types';

type Screen = 'intake' | 'loading' | 'confirm' | 'clarify' | 'activation' | 'goal-select' | 'dashboard';

const FALLBACK: ParseResponse = {
  primaryGoal: null,
  secondaryGoal: null,
  confidence: 'low',
  abstain: true,
  restatement: '',
};

const INITIAL_FORM: FormState = {
  firstName: 'Mike',
  businessName: 'Rivera HVAC',
  employees: '2–5',
  industry: 'Plumbing',
  goalText: '',
};

export default function AppShell() {
  const [screen, setScreen] = useState<Screen>('intake');
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [parseResult, setParseResult] = useState<ParseResponse | null>(null);
  const [chosenGoalId, setChosenGoalId] = useState<GoalId | null>(null);
  const [focusGoalOnReturn, setFocusGoalOnReturn] = useState(false);

  const handleStart = useCallback(async (submitted: FormState) => {
    setForm(submitted);
    setScreen('loading');

    let result: ParseResponse;
    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitted),
      });
      result = await res.json();
    } catch {
      result = FALLBACK;
    }

    setParseResult(result);
    setScreen(!result.abstain && result.primaryGoal ? 'confirm' : 'clarify');
  }, []);

  const handleConfirm = useCallback((goalId: GoalId) => {
    setChosenGoalId(goalId);
    setScreen('activation');
  }, []);

  const handleNotQuite = useCallback(() => {
    setFocusGoalOnReturn(true);
    setScreen('intake');
  }, []);

  const handleGoalChosen = useCallback((goalId: GoalId) => {
    setChosenGoalId(goalId);
    setScreen('activation');
  }, []);

  const handleSkip = useCallback(() => {
    setChosenGoalId(null);
    setScreen('activation');
  }, []);

  const handleActivationComplete = useCallback(() => {
    setScreen('goal-select');
  }, []);

  const handleGoalStart = useCallback((goalId: GoalId) => {
    setChosenGoalId(goalId);
    setScreen('activation');
  }, []);

  if (screen === 'intake') {
    return (
      <IntakeForm
        initialValues={form}
        onStart={handleStart}
        autoFocusGoal={focusGoalOnReturn}
        onGoalFocused={() => setFocusGoalOnReturn(false)}
      />
    );
  }

  return (
    <PhoneFrame>
      {screen === 'loading' && (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Building your plan…</p>
        </div>
      )}

      {screen === 'confirm' && parseResult?.primaryGoal && (
        <ConfirmScreen
          firstName={form.firstName}
          primaryGoal={parseResult.primaryGoal}
          onConfirm={handleConfirm}
          onNotQuite={handleNotQuite}
        />
      )}

      {screen === 'clarify' && (
        <ClarifyScreen
          acknowledgment={parseResult?.restatement ?? ''}
          onGoalChosen={handleGoalChosen}
          onSkip={handleSkip}
        />
      )}

      {screen === 'activation' && (
        <ActivationScreen
          key={chosenGoalId ?? 'default'}
          goalId={chosenGoalId}
          onComplete={handleActivationComplete}
          onRestart={() => { setScreen('intake'); setFocusGoalOnReturn(false); }}
        />
      )}

      {screen === 'goal-select' && (
        <GoalSelectScreen
          firstName={form.firstName}
          completedGoalId={chosenGoalId}
          onGoalStart={handleGoalStart}
          onDashboard={() => setScreen('dashboard')}
        />
      )}

      {screen === 'dashboard' && (
        <div className="flex flex-col items-center justify-center flex-1 gap-2">
          <p className="text-lg font-semibold text-slate-900">Dashboard</p>
          <p className="text-sm text-slate-400">Main product experience goes here</p>
        </div>
      )}
    </PhoneFrame>
  );
}
