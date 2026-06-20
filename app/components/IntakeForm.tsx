'use client';

import { useState } from 'react';

const INDUSTRIES = [
  'HVAC', 'Plumbing', 'Electrical', 'Handyman', 'Cleaning',
  'Landscaping / Lawn', 'Appliance Repair', 'Pest Control',
  'Garage Door', 'Painting', 'General Contractor', 'Other',
];

const EMPLOYEE_OPTIONS = ['1', '2–5', '6–10', '11+'];

interface FormState {
  firstName: string;
  businessName: string;
  employees: string;
  industry: string;
  goalText: string;
}

export default function IntakeForm() {
  const [form, setForm] = useState<FormState>({
    firstName: 'Mike',
    businessName: 'Rivera HVAC',
    employees: '2–5',
    industry: 'Plumbing',
    goalText: '',
  });

  function set(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Intake form state:', form);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-base font-semibold text-gray-700 mb-0.5">
          Prototype input
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Stands in for signup — edit any field, then hit Start.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="First name">
            <input
              type="text"
              value={form.firstName}
              onChange={e => set('firstName', e.target.value)}
              className={inputCls}
            />
          </Field>

          <Field label="Business name">
            <input
              type="text"
              value={form.businessName}
              onChange={e => set('businessName', e.target.value)}
              className={inputCls}
            />
          </Field>

          <Field label="Number of employees">
            <div className="relative">
              <select
                value={form.employees}
                onChange={e => set('employees', e.target.value)}
                className={selectCls}
              >
                {EMPLOYEE_OPTIONS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <Chevron />
            </div>
          </Field>

          <Field label="Industry">
            <div className="relative">
              <select
                value={form.industry}
                onChange={e => set('industry', e.target.value)}
                className={selectCls}
              >
                {INDUSTRIES.map(i => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <Chevron />
            </div>
          </Field>

          <Field label="What's the first thing you want to get done with Housecall Pro?">
            <div className="relative">
              <textarea
                value={form.goalText}
                onChange={e => set('goalText', e.target.value)}
                placeholder="e.g. I want to stop chasing payments — customers keep forgetting and it's hurting my cash flow."
                rows={4}
                className="w-full px-3 py-2 pr-12 text-sm border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
              />
              <button
                type="button"
                title="Voice coming soon"
                className="absolute bottom-2 right-2 w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 transition-colors"
                aria-label="Voice input — coming soon"
              >
                <MicIcon />
              </button>
            </div>
          </Field>

          <button
            type="submit"
            className="mt-1 h-9 w-full rounded bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 active:bg-gray-900 transition-colors"
          >
            Start
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
}

function Chevron() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-gray-400">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

const inputCls =
  'h-9 w-full px-3 text-sm border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400';

const selectCls =
  'h-9 w-full pl-3 pr-8 text-sm border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 appearance-none';
