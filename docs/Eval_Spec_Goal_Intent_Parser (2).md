# Eval Spec — Goal Intent Parser

**What we evaluate:** the one AI component in the experience — the parser that turns a Pro's free-text goal into structured intent: `{ primary_goal ∈ catalog, secondary_goal?, confidence, abstain? }`. Everything downstream is deterministic, so this is the only thing that needs an eval.

**Classification targets (catalog):** `book_more_jobs` · `get_paid_faster` · `improve_customer_communication` · `win_repeat_business` · `stay_on_top` · plus **ABSTAIN** (ask one clarifying question) for vague, empty, or out-of-scope input.

**Goal definitions** — the actual catalog the parser classifies into. Source of truth is `activationMap.ts`; these descriptions are what the parser's system prompt uses to decide.

| Goal ID | The Pro wants to… |
|---|---|
| `book_more_jobs` | get more bookings, a fuller calendar, more customers, faster quoting that wins jobs |
| `get_paid_faster` | get paid quicker, stop chasing checks, take card payments, send invoices, improve cash flow |
| `improve_customer_communication` | communicate better, cut missed calls/messages, keep customers in the loop, send reminders, be reachable |
| `win_repeat_business` | earn more reviews, build reputation, win repeat customers and word of mouth, stay top of mind |
| `stay_on_top` | get organized, reduce admin/paperwork, stop the chaos, track jobs and customers, run the day smoothly |
| `ABSTAIN` | none of the above clearly applies (vague, empty, or out-of-scope) → hand off to clarify |

---

## Success criteria (ship gate)

* **Top-1 primary accuracy ≥ 90%** on unambiguous inputs
* **Out-of-catalog rate = 0** — hard gate; never names a goal/feature HCP doesn't have
* **Appropriate abstention ≥ 80%** on genuinely ambiguous or empty inputs (clarifies instead of guessing)
* **Over-abstention ≤ 10%** on clear inputs (doesn't add friction when intent is obvious)

**Guiding principle:** a confident wrong answer costs more than an abstention, because the confirm step makes abstention cheap and a wrong path expensive. So false-confidence and out-of-catalog errors are weighted heaviest.

---

## Error taxonomy

| Error | What it looks like | Why it matters | Severity |
|---|---|---|---|
| Misclassification | Confident, plausible, wrong primary goal | Confirm step may still read as plausible; Pro accepts a wrong path | High |
| False confidence | Commits to a goal on vague input | Sends Pro down a path they never asked for | High |
| Out-of-catalog | Names/invents a feature HCP doesn't offer | Breaks the constrained-output guarantee; erodes trust | Hard gate (0) |
| Scope force-fit | Jams an out-of-scope request into a goal | Overpromises; trust damage | Med-High |
| Over-abstention | Asks to clarify when intent was clear | Adds friction, slows time-to-value (the core metric) | Medium |
| Missed secondary | Drops a clearly stated secondary intent | Weaker path, but not wrong | Low |

---

## Test set (16 examples)

| # | Input (Pro's words) | Expected | Guards against |
|---|---|---|---|
| 1 | "I want to get more jobs on the books" | book_more_jobs | baseline accuracy |
| 2 | "Tired of chasing checks, I need to get paid quicker" | get_paid_faster | baseline |
| 3 | "I want more customers leaving me reviews" | win_repeat_business | baseline |
| 4 | "Summer's busy and I keep losing customers because I'm slow to quote" | book_more_jobs (2nd: get_paid_faster) | indirect phrasing + secondary capture |
| 5 | "Customers always say they didn't know I was coming" | improve_customer_communication | indirect, no feature named |
| 6 | "My days are chaos, I lose track of who's where" | stay_on_top | indirect |
| 7 | "I do great work but nobody finds me online" | book_more_jobs (alt: win_repeat_business) | genuine ambiguity — accept either, note rubric |
| 8 | "Book more jobs and stop doing invoices by hand at night" | book_more_jobs (2nd: get_paid_faster) | multi-goal: pick primary + capture secondary |
| 9 | "I want to grow my business" | ABSTAIN / clarify | maps to everything — false-confidence trap |
| 10 | "make more money" | ABSTAIN / clarify | vague — false-confidence trap |
| 11 | "idk just looking around" | ABSTAIN / clarify | empty intent |
| 12 | (blank) | ABSTAIN / default | empty input handling |
| 13 | "I want GPS tracking on all my trucks" | recognize Vehicle GPS Tracking (catalog-only); no activation path; acknowledge + steer to value | catalog-only handling, no force-fit |
| 14 | "Can you answer my phones with AI?" | recognize CSR AI (add-on, real); don't deny, don't overpromise as a goal | hallucination / overpromise guard |
| 15 | "I need to hire two more techs" | out-of-scope (no recruiting); graceful, don't force-fit | scope force-fit guard |
| 16 | "halp me git my plumbin jobs on the calendar" | stay_on_top (scheduling) | robustness to typos / messy input |

---

## Clarify / empty-input path (deterministic — acceptance criteria, not accuracy)

When the parser abstains (rows 9–12), it hands off to a deterministic clarify flow. This path is tested with pass/fail checks, not accuracy metrics.

**Behavior:**
1. Abstain → never emit a primary goal (no silent guess)
2. Show the clarification selector: the five goals as tappable chips + free-text + "Skip for now"
3. Chip tapped or text entered → route / parse normally
4. Skip or still no signal → route to the default starter path (send first estimate → get paid → schedule first job); full product stays accessible

**Acceptance criteria (pass/fail):**
* Blank/unusable input produces 0 silent primary-goal assignments
* Clarify selector is shown at most once before fallback — no loop
* Skip or repeated-empty always lands on a non-empty default path — never a dead end
* Default path uses only ★ activation features
* Selector always offers all five goals plus a skip

---

## How to run

Feed each input to the parser, compare output to expected. Score top-1 accuracy on rows 1–8 and 16, abstention behavior on 9–12, and catalog/scope handling on 13–15. Row 7 passes on either listed goal. Re-run on any prompt change before shipping. A teammate can run this in ~30 minutes.
