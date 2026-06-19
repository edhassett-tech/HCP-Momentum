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
  const [showMicTip, setShowMicTip] = useState(false);

  function set(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Intake form state:', form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-5 pt-5 pb-8 bg-slate-50 min-h-full">

      {/* ── Framing header ── */}
      <div className="flex items-start gap-3 bg-white rounded-2xl border border-slate-200 px-4 py-3.5">
        <div className="mt-0.5 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <CheckIcon />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800 leading-snug">
            Account created — picking up where you left off
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            One question before you dive in.
          </p>
        </div>
      </div>

      {/* ── Profile block — compact, secondary ── */}
      <div className="rounded-2xl bg-white border border-slate-200 px-4 pt-3 pb-4 flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
          Your profile
        </p>

        <div className="grid grid-cols-2 gap-3">
          <ProfileField label="First name">
            <input
              type="text"
              value={form.firstName}
              onChange={e => set('firstName', e.target.value)}
              className={compactInputCls}
            />
          </ProfileField>

          <ProfileField label="Business">
            <input
              type="text"
              value={form.businessName}
              onChange={e => set('businessName', e.target.value)}
              className={compactInputCls}
            />
          </ProfileField>

          <ProfileField label="Team size">
            <div className="relative">
              <select
                value={form.employees}
                onChange={e => set('employees', e.target.value)}
                className={compactSelectCls}
              >
                {EMPLOYEE_OPTIONS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <SmallChevron />
            </div>
          </ProfileField>

          <ProfileField label="Industry">
            <div className="relative">
              <select
                value={form.industry}
                onChange={e => set('industry', e.target.value)}
                className={compactSelectCls}
              >
                {INDUSTRIES.map(i => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <SmallChevron />
            </div>
          </ProfileField>
        </div>
      </div>

      {/* ── Goal field — primary interaction ── */}
      <div className="rounded-2xl bg-white border-2 border-blue-400 px-4 pt-4 pb-4 flex flex-col gap-3">
        <div>
          <p className="text-base font-bold text-slate-900 leading-snug">
            Now — what's the first thing you want to get done?
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Your answer builds your personal activation path.
          </p>
        </div>

        <div className="relative">
          <textarea
            value={form.goalText}
            onChange={e => set('goalText', e.target.value)}
            placeholder="e.g. I want to stop chasing payments — customers keep forgetting and it's hurting my cash flow."
            rows={4}
            className="w-full px-4 pt-3 pb-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white resize-none transition-colors"
          />
          {/* Mic — visual only */}
          <div className="absolute bottom-3 right-3">
            <button
              type="button"
              onMouseEnter={() => setShowMicTip(true)}
              onMouseLeave={() => setShowMicTip(false)}
              onFocus={() => setShowMicTip(true)}
              onBlur={() => setShowMicTip(false)}
              onClick={() => setShowMicTip(v => !v)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors"
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
      </div>

      {/* ── CTA ── */}
      <button
        type="submit"
        className="h-14 w-full rounded-2xl bg-blue-600 text-white font-semibold text-base tracking-wide hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
      >
        Build my plan
      </button>
    </form>
  );
}

// ── helpers ──

function ProfileField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-slate-500">{label}</label>
      {children}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SmallChevron() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

const compactInputCls =
  'h-9 w-full px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors';

const compactSelectCls =
  'h-9 w-full pl-3 pr-7 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors appearance-none';
