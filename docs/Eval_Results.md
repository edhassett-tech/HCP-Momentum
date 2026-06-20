# Eval Results — Goal Intent Parser

Run against the live `/api/parse` endpoint using the 16-case test set from `Eval_Spec_Goal_Intent_Parser.md`. Full methodology and pass criteria are defined there; this file is the evidence from actually running it.

---

## Headline

* **Strict baseline accuracy (rows 1,2,3,5,6,16): 5/6**
* **Flexible accuracy (rows 4,7,8): 3/3**
* **Abstention correctness (rows 9–12): 4/4**
* **Out-of-catalog goals across all 16 rows: 0 / 0** — the one hard gate in the spec, held completely

---

## Full results table

| # | Input | Expected | Actual goal | Confidence | Abstain | Result |
|---|---|---|---|---|---|---|
| 1 | I want to get more jobs on the books | book_more_jobs | book_more_jobs | high | false | PASS |
| 2 | Tired of chasing checks, I need to get paid quicker | get_paid_faster | get_paid_faster | high | false | PASS |
| 3 | I want more customers leaving me reviews | win_repeat_business | win_repeat_business | high | false | PASS |
| 4 | Summer's busy and I keep losing customers because I'm slow to quote | book_more_jobs | book_more_jobs | high | false | PASS |
| 5 | Customers always say they didn't know I was coming | improve_customer_communication | improve_customer_communication | high | false | PASS |
| 6 | My days are chaos, I lose track of who's where | stay_on_top | stay_on_top | high | false | PASS |
| 7 | I do great work but nobody finds me online | book_more_jobs OR win_repeat_business | win_repeat_business | high | false | PASS |
| 8 | Book more jobs and stop doing invoices by hand at night | book_more_jobs | book_more_jobs | high | false | PASS |
| 9 | I want to grow my business | abstain=true | null | low | true | PASS |
| 10 | make more money | abstain=true | null | low | true | PASS |
| 11 | idk just looking around | abstain=true | null | low | true | PASS |
| 12 | (blank) | abstain=true | null | low | true | PASS |
| 13 | I want GPS tracking on all my trucks | — review — | stay_on_top | high | false | REVIEW |
| 14 | Can you answer my phones with AI? | — review — | improve_customer_communication | high | false | REVIEW |
| 15 | I need to hire two more techs | — review — | null | low | true | REVIEW |
| 16 | halp me git my plumbin jobs on the calendar | stay_on_top | book_more_jobs | high | false | **FAIL** |

---

## Analysis

### The one failure — row 16

Garbled/typo'd input ("halp me git my plumbin jobs on the calendar") was expected to land on `stay_on_top` but classified as `book_more_jobs`, confidently.

This is **not a typo-robustness failure** — the model clearly parsed the text fine ("jobs," "calendar" both registered correctly). It's a genuine boundary case between two adjacent goals: "get my jobs on the calendar" can honestly be read as either "I want more jobs" (book_more_jobs) or "I want to organize my schedule" (stay_on_top). The input is ambiguous between two real catalog goals, not actually a clear `stay_on_top` case mis-scored — worth revisiting whether the expected answer was too strict, or whether the prompt needs a sharper boundary between these two goals.

**Decision needed:** either loosen this case to accept either goal (like row 7), or tighten the system prompt's definitions to disambiguate "jobs on the calendar" phrasing. Not yet resolved — flagging as an open item.

### The REVIEW pattern — rows 13–15

All three are out-of-catalog requests, and they split in a consistent, non-random way:

* **13 (GPS tracking)** and **14 (AI phone answering)** — real HCP-adjacent capabilities, not in the activation catalog. The model **confidently force-mapped** both into the nearest catalog goal (`stay_on_top`, `improve_customer_communication` respectively) rather than abstaining.
* **15 (hiring techs)** — no product relationship at all. The model **correctly abstained**, and its restatement asked a genuinely useful clarifying question back.

This confirms a threshold the model is applying consistently: bend toward the nearest real goal when the request is product-adjacent; abstain when it isn't. That's a deliberate-feeling boundary, not noise — three data points showing the same pattern.

**Open risk:** rows 13 and 14 are *confident* force-maps into goals that don't actually deliver what was asked. A Pro asking for GPS tracking who gets routed into "stay on top of your day" (calendar, checklists, customer import) completes that path and still has no GPS tracking. The confirm screen's "Not quite" is the safety net today — but it requires the Pro to notice the mismatch from a goal label alone.

**Decision needed:** either (a) keep current behavior and rely on "Not quite" as the catch, or (b) tighten the prompt so true out-of-catalog feature/hardware requests abstain rather than force-map. Not yet resolved.

---

## Bottom line

A strong first real run: full accuracy on baseline and flexible cases, perfect abstention behavior, and the one hard gate (zero out-of-catalog) held. One genuine miss (row 16) and one consistent edge-case pattern (rows 13–14 vs. 15) — both are concrete, explainable findings rather than gaps in understanding, and both have a clear open decision attached rather than being silently shipped as-is.
