# Build Spec — "Momentum" Prototype

> Paste this whole file into Claude Code as your brief, or save it in the repo as `SPEC.md` and tell Claude Code to build against it. Build in the order in Section 9 so you always have something runnable to demo, and commit after each step (your git history doubles as iteration evidence for the case).

---

## 1. What we're building

A **mobile-first web prototype** of "Momentum," an AI-powered guided activation experience for Housecall Pro's free trial.

Hero interaction: a Pro states their goal **in their own words** → an AI parses it into a structured intent → the Pro **confirms** → the app generates a **personalized activation path** of milestones.

AI is used in exactly one place — interpreting the open-ended goal. Everything else is deterministic. ("AI for interpretation, rules for reliability.")

This is a prototype: the goal-parsing is a **real Anthropic API call**; the HCP features themselves are **mocked** (milestones are simulated, nothing real is provisioned or sent).

---

## 2. Tech stack

* Next.js (App Router) + TypeScript
* Tailwind CSS
* One server route (`app/api/parse/route.ts`) that calls the Anthropic API — keeps the key server-side
* Anthropic SDK (`@anthropic-ai/sdk`)
* Model: **Claude Haiku** (fast, cheap, ideal for classification). Use `claude-haiku-4-5-20251001`. If the API returns model-not-found, check the current string in the Anthropic console and swap it.
* Renders in a phone-width frame (see Section 7)

---

## 3. Architecture / flow

```
Intake page
   → POST /api/parse  (profile + goal text)
   → returns structured intent JSON
   → Confirm step (or Clarify selector if abstain)
   → rules engine maps {intent, industry} → a path from the Activation Map
   → Guided Activation view
```

The model only ever produces the structured intent. Path selection, milestones, and copy are deterministic lookups against the Activation Map (Section 5).

---

## 4. Screens

### Screen 1 — Intake (interstitial)
Fields:
* First name (text)
* Business name (text)
* Number of employees (select: `1` / `2–5` / `6–10` / `11+`)
* Industry (select — list in Section 6)
* **Hero field:** "What's the first thing you want to get done with Housecall Pro?" — multi-line text, with a **mic button that is visual-only** (tooltip "Voice coming soon" — do NOT wire real speech). Include placeholder example text to reduce blank-field anxiety.
* Primary CTA: "Build my plan"

### Screen 2 — Confirm
On submit, call `/api/parse`, show a loading state, then:
* **Goal inferred with confidence** → show the AI's plain-language restatement: "Sounds like your main goal is ___ — did I get that right?" with **[Yes, let's go]** and **[Not quite]** (edit re-opens the goal field).
* **Abstain / low confidence / empty** → show the **Clarify Selector**: the 5 goals as tappable chips + a "type it instead" field + "Skip for now." Tapping a chip routes directly; Skip → default starter path.

### Screen 3 — Guided Activation
Shows:
* The goal, in the Pro's framing
* A milestone path (3 milestones for the chosen goal)
* One highlighted **next best action**
* A progress indicator
* A **celebration state** when a milestone is marked complete (simulated: tapping "Mark done" advances progress, fires a small tasteful celebration, then surfaces the next action)
* A secondary link: "Skip to explore everything" (keeps full product accessible)

---

## 5. Activation Map — hardcode as `lib/activationMap.ts`

```ts
export type GoalId =
  | "book_more_jobs"
  | "get_paid_faster"
  | "improve_customer_communication"
  | "win_repeat_business"
  | "stay_on_top";

export interface Milestone {
  title: string;        // outcome-framed
  feature: string;      // HCP feature behind it
  nextAction: string;   // the setup step
  firstValue: string;   // the celebrated value moment
}

export interface Goal {
  id: GoalId;
  label: string;        // chip label
  description: string;  // for the parser system prompt
  milestones: Milestone[];
}

export const GOALS: Goal[] = [
  {
    id: "book_more_jobs",
    label: "Book more jobs",
    description: "Wants more bookings, more work, a fuller calendar, more customers, faster quoting that wins jobs.",
    milestones: [
      { title: "Let customers book you online", feature: "Online booking", nextAction: "Set availability and publish your booking page", firstValue: "Receive your first online booking" },
      { title: "Quote on the spot", feature: "Easy estimates + Visual price book", nextAction: "Build a starter price book and estimate template", firstValue: "Send your first estimate" },
      { title: "Fill your calendar", feature: "Drag & drop scheduling", nextAction: "Add your availability", firstValue: "Schedule your first job" },
    ],
  },
  {
    id: "get_paid_faster",
    label: "Get paid faster",
    description: "Wants to get paid quicker, stop chasing checks, take card payments, send invoices, improve cash flow.",
    milestones: [
      { title: "Turn on payments", feature: "Mobile payment processing", nextAction: "Set up payments and connect your payout account", firstValue: "Accept your first payment" },
      { title: "Send your first invoice", feature: "Paperless invoicing", nextAction: "Create an invoice template", firstValue: "Send an invoice with online pay" },
      { title: "Get paid instantly", feature: "Instant payouts", nextAction: "Enable instant payout", firstValue: "Your first instant payout" },
    ],
  },
  {
    id: "improve_customer_communication",
    label: "Improve customer communication",
    description: "Wants better communication, fewer missed calls/messages, customers kept in the loop, reminders, to be reachable.",
    milestones: [
      { title: "Keep customers in the loop", feature: "Customizable text notifications", nextAction: "Turn on job notifications", firstValue: "First automated text sent" },
      { title: "Be reachable", feature: "Custom local number + live chat", nextAction: "Claim your local number", firstValue: "First inbound message handled" },
      { title: "Follow up automatically", feature: "Reminders", nextAction: "Enable reminders", firstValue: "First reminder sent" },
    ],
  },
  {
    id: "win_repeat_business",
    label: "Win repeat business & reviews",
    description: "Wants more reviews, better reputation, repeat customers, to grow word of mouth, stay top of mind.",
    milestones: [
      { title: "Ask for reviews automatically", feature: "Review generation", nextAction: "Turn on automatic review requests", firstValue: "First review request sent" },
      { title: "Manage your reputation", feature: "Premium review management", nextAction: "Connect Google reviews", firstValue: "Respond to your first review" },
      { title: "Stay top of mind", feature: "Postcard & email marketing", nextAction: "Pick a campaign template", firstValue: "First campaign sent" },
    ],
  },
  {
    id: "stay_on_top",
    label: "Stay on top of the day-to-day",
    description: "Wants to get organized, reduce admin/paperwork, stop the chaos, track jobs and customers, run the day smoothly.",
    milestones: [
      { title: "See your whole day", feature: "Scheduling + dashboard", nextAction: "Set up your calendar", firstValue: "First day fully scheduled" },
      { title: "Standardize your jobs", feature: "Custom checklists", nextAction: "Create a job checklist", firstValue: "Checklist applied to first job" },
      { title: "Bring your business in", feature: "Import data", nextAction: "Import your customers", firstValue: "First imported customer scheduled" },
    ],
  },
];

// Default starter path when there is zero signal (skip / repeated-empty).
export const DEFAULT_STARTER: Milestone[] = [
  GOALS[1].milestones[1], // send first invoice
  GOALS[1].milestones[0], // turn on payments
  GOALS[0].milestones[2], // schedule first job
];
```

---

## 6. Industry list (Screen 1 select)

HVAC · Plumbing · Electrical · Handyman · Cleaning · Landscaping / Lawn · Appliance Repair · Pest Control · Garage Door · Painting · General Contractor · Other

---

## 7. Design direction

* **Mobile frame:** center a single max-width ~420px column; optional subtle phone chrome around it. Everything single-column, vertical.
* **One accent color.** HCP leans navy/blue with a warm gold highlight — use a clean blue primary, soft neutral background, one celebratory accent. Don't overdesign.
* **Big tap targets** (min ~44px), generous spacing, rounded cards, friendly sentence-case copy.
* Progress + celebration should feel rewarding but tasteful — no confetti overload.
* If a frontend-design skill/guide is available, follow its token conventions.

---

## 8. Parser contract (`/api/parse`)

**Request body:** `{ firstName, businessName, employees, industry, goalText }`

**Response JSON (strict, no prose):**
```json
{
  "primaryGoal": "get_paid_faster | null",
  "secondaryGoal": "book_more_jobs | null",
  "confidence": "high | medium | low",
  "abstain": false,
  "restatement": "one plain-language sentence echoing their words"
}
```

System prompt should:
* Classify `goalText` into exactly one of the 5 catalog goals, using the `description` fields as the definitions
* Set `abstain: true` for vague ("grow my business," "make more money"), empty, or out-of-scope input
* **Never** output a goal outside the catalog
* Produce a one-sentence restatement that references the Pro's actual words (for the confirm step)
* Return strict JSON only

**Error handling:** if the API call fails or returns unparseable output, fall back to the Clarify Selector — never crash or dead-end.

---

## 9. Build order (commit after each)

1. Scaffold Next.js + Tailwind + TS; render a "hello" phone frame
2. Add `lib/activationMap.ts` (Section 5) + types
3. Build Screen 1 (intake form, local state)
4. Build `/api/parse` route + Anthropic SDK + env key; test with one sample input
5. Wire submit → parse → Screen 2 (confirm + clarify selector + abstain handling)
6. Build Screen 3 (activation view, milestones, simulated completion + celebration)
7. Polish: loading states, skip → default starter path, design pass

---

## 10. Env & out of scope

* `.env.local`: `ANTHROPIC_API_KEY=...` (Next.js gitignores `.env*` by default — verify before first push)
* **Out of scope:** real signup flow, account provisioning, data persistence, working voice, dashboard redesign, anything post-confirm that touches real HCP systems
