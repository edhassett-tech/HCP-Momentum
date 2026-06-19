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
    firstName: '',
    businessName: '',
    employees: '',
    industry: '',
    goalText: '',
  });
  const [showMicTip, setShowMicTip] = useState(false);

  function set(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Intake form state:', form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 pt-6 pb-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-1">
          Welcome
        </p>
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">
          Let's build your plan
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Tell us a bit about yourself and what you want to get done first.
        </p>
      </div>

      {/* First name */}
      <Field label="First name">
        <input
          type="text"
          value={form.firstName}
          onChange={e => set('firstName', e.target.value)}
          placeholder="e.g. Mike"
          className={inputCls}
        />
      </Field>

      {/* Business name */}
      <Field label="Business name">
        <input
          type="text"
          value={form.businessName}
          onChange={e => set('businessName', e.target.value)}
          placeholder="e.g. Rivera HVAC"
          className={inputCls}
        />
      </Field>

      {/* Employees */}
      <Field label="Number of employees">
        <SelectWrapper>
          <select
            value={form.employees}
            onChange={e => set('employees', e.target.value)}
            className={selectCls}
          >
            <option value="" disabled>Select…</option>
            {EMPLOYEE_OPTIONS.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <Chevron />
        </SelectWrapper>
      </Field>

      {/* Industry */}
      <Field label="Industry">
        <SelectWrapper>
          <select
            value={form.industry}
            onChange={e => set('industry', e.target.value)}
            className={selectCls}
          >
            <option value="" disabled>Select your trade…</option>
            {INDUSTRIES.map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <Chevron />
        </SelectWrapper>
      </Field>

      {/* Goal text */}
      <Field label="What's the first thing you want to get done with Housecall Pro?">
        <div className="relative">
          <textarea
            value={form.goalText}
            onChange={e => set('goalText', e.target.value)}
            placeholder="e.g. I want to stop chasing payments — customers keep forgetting and it's hurting my cash flow."
            rows={4}
            className="w-full px-4 pt-3 pb-12 rounded-2xl border border-slate-200 bg-white text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          {/* Mic button — visual only */}
          <div className="absolute bottom-3 right-3">
            <button
              type="button"
              onMouseEnter={() => setShowMicTip(true)}
              onMouseLeave={() => setShowMicTip(false)}
              onFocus={() => setShowMicTip(true)}
              onBlur={() => setShowMicTip(false)}
              onClick={() => setShowMicTip(v => !v)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors"
              aria-label="Voice input — coming soon"
            >
              <MicIcon />
            </button>
            {showMicTip && (
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none">
                Voice coming soon
                <span className="absolute top-full right-3.5 block w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800" />
              </div>
            )}
          </div>
        </div>
      </Field>

      {/* CTA */}
      <button
        type="submit"
        className="mt-1 h-14 w-full rounded-2xl bg-blue-600 text-white font-semibold text-base tracking-wide hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
      >
        Build my plan
      </button>
    </form>
  );
}

// --- small helpers ---

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
    </div>
  );
}

function Chevron() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

const inputCls =
  'h-12 w-full px-4 rounded-2xl border border-slate-200 bg-white text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

const selectCls =
  'h-12 w-full pl-4 pr-10 rounded-2xl border border-slate-200 bg-white text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none';
