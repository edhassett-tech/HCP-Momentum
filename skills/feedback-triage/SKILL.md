---
name: feedback-triage
description: Triage live customer or panelist feedback during demos — synthesizes it into a scoped change, classifies risk, and either makes it or defers it to the backlog.
---

You are handling live feedback from a customer or panelist during a demo of HCP Momentum. The raw feedback is:

<feedback>
$ARGUMENTS
</feedback>

Work through the following steps in order. Do not skip steps.

---

## Step 1 — Clarify if needed

Read the feedback. If it is ambiguous or could plausibly mean more than one thing (for example: "the flow feels off" could mean pacing, copy, or navigation order), ask exactly **one** targeted clarifying question and stop. Wait for the answer before continuing.

If the feedback is specific enough to act on, skip this step and proceed to Step 2.

---

## Step 2 — Synthesize

Restate the feedback as a single concrete, scoped proposed change. Be specific: name the screen, component, or file affected and what would change. One sentence only.

---

## Step 3 — Classify risk

Determine whether the proposed change would touch either of these two HIGH RISK areas:

- **`lib/activationMap.ts`** — goal definitions, milestone titles, nextAction text, firstValue text, or the catalog structure
- **`app/api/parse/route.ts`** — the system prompt, classification logic, GoalId mapping, or abstain behavior

**If HIGH RISK:**
Do not edit any files. Present 1–2 concrete solution options, each with a one-sentence tradeoff. Then explicitly ask which option to proceed with, or whether to defer. Make zero changes until you receive explicit approval.

**If LOW RISK** (UI layout, copy on screens, colors, styling, flow sequencing, component behavior, non-data-layer logic):
Proceed to Step 4.

---

## Step 4 — Triage scope (LOW RISK only)

**Make it now** if the change is:
- Small and contained — a few lines across one or two files
- Requires no product or content decision beyond what is already established
- Can be verified by reading the result

→ Make the change. Run `npx tsc --noEmit` if you touched TypeScript. Do not write the Step 5 summary until the change is complete.

**Defer** if the change:
- Requires rework across multiple screens or components
- Depends on a product, content, or data decision not yet made
- Would take longer than ~15 minutes of focused implementation

→ Do NOT attempt the change. Append to `docs/backlog.md` (create it with a `# Backlog` heading if it does not exist) using this exact format:

```markdown
## [brief descriptive title]
**Original feedback:** "[exact quote from the panelist/customer]"
**Why deferred:** [one sentence — scope, dependency, or decision needed]
**Suggested next step:** [one concrete actionable thing to do before picking this up]
```

---

## Step 5 — Summary

Output exactly one line starting with **Done:**

> **Done:** [what happened and why — name the file or screen touched, or state that it was deferred and where]

Examples of good summaries:
> **Done:** Changed "Mark done" copy to "Done ✓" in `ActivationScreen.tsx` — LOW RISK one-line copy tweak, applied directly.
> **Done:** Deferred "add undo for skipped milestones" to `docs/backlog.md` — requires architectural decision about milestone state.
> **Done:** HIGH RISK — rephrasing `get_paid_faster` milestone titles touches `activationMap.ts`; presented 2 options, waiting for approval before editing.
