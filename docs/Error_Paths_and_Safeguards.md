# Error Paths & Safeguards — Goal Intent Parser

Every possible classification outcome, what the Pro experiences, what catches it, and where the gaps are. For use in the session when trust/failure questions come up.

---

## Error Path 1 — Misclassification (confident, wrong goal)

**What happened:** the model returned a goal with high or medium confidence, but it's the wrong one. The Pro's input was classifiable — just classified incorrectly.

**Real example:** row 16 — "halp me git my plumbin jobs on the calendar" → classified as `book_more_jobs`, should have been `stay_on_top`.

**What the Pro sees:** the confirm screen, with a restatement and goal label that don't match their intent.

**Safeguard:** the confirm screen's "Not quite" button. One tap, returns to intake with goal field focused, Pro can re-state or pick from the clarify selector.

**Where it breaks down:** if the restatement sounds plausible but is subtly wrong, the Pro may not notice and tap "You got it." They proceed on the wrong path, complete milestones that don't match their real intent, and potentially disengage without ever understanding why the product didn't feel relevant. This is the worst-case failure shape — confident, plausible, and invisible.

**Open decision:** tightening the system prompt's boundary between adjacent goals (specifically `book_more_jobs` vs. `stay_on_top`) to reduce this category of miss.

---

## Error Path 2 — Should have abstained, but didn't (force-map)

**What happened:** the input was genuinely out-of-catalog or ambiguous, but the model committed to a goal confidently instead of abstaining and routing to the clarify selector.

**Real examples:** rows 13 and 14 from the eval.
- "I want GPS tracking on all my trucks" → force-mapped to `stay_on_top`, high confidence. GPS tracking is a real HCP add-on but not in the activation catalog.
- "Can you answer my phones with AI?" → force-mapped to `improve_customer_communication`, high confidence. CSR AI is a real HCP add-on, not in the catalog.

**What the Pro sees:** the confirm screen, with a restatement that sounds reasonable ("you want better visibility and control over your operations") but describes a path that doesn't actually deliver what they asked for.

**Safeguard:** the confirm screen's "Not quite" — but only catches it if the Pro reads the restatement closely enough to notice the mismatch. High-confidence, plausible-sounding restatements are the hardest case for this safeguard.

**Where it breaks down:** same as Error Path 1 — the Pro taps yes, lands on a path (calendar setup, checklists, customer import) that has nothing to do with GPS tracking. Completes milestones, still no GPS tracking. Trust damage.

**Open decision:** tighten the prompt so genuinely out-of-catalog requests (hardware, add-on features, AI products) abstain to the clarify selector rather than force-mapping. Currently documented in `Eval_Results.md` as an open, undecided item. Either is defensible — the "Not quite" catch is the current answer.

**Enhancement that would help:** use the confidence score in the UX. When confidence is medium, show the five chips right alongside the restatement so correction is a single tap rather than requiring the Pro to reject the restatement entirely. Not built in the current prototype.

---

## Error Path 3 — Correct abstention (working as designed)

**What happened:** the model correctly recognized it couldn't pin down the intent and returned abstain=true.

**Real examples:** rows 9–12 — "I want to grow my business," "make more money," "idk just looking," blank input. All correctly abstained.

**What the Pro sees:** the clarify selector — a curious, warm acknowledgment of what they typed (AI-generated, references their actual words), the five goal chips, and "Skip for now."

**Safeguard:** none needed — this is correct behavior. The clarify selector is the designed experience for this case.

**No loop possible:** the free-text retry box was deliberately removed mid-build. The only paths forward are tapping a chip or skipping — neither can return to the parser and re-trigger abstention.

---

## Error Path 4 — Over-abstention (should have classified, didn't)

**What happened:** the model abstained on input that was actually clear enough to classify. Adds friction where none was needed.

**Real examples:** none in the eval — 0/16 over-abstentions. Every clear input classified; every vague input abstained. The eval's over-abstention criterion (≤ 10% on clear inputs) held cleanly.

**What the Pro sees:** the clarify selector, unexpectedly — they stated a clear goal and got asked to pick from a list instead of having it confirmed.

**Safeguard:** the clarify selector still works — they tap the right chip and get the right path. Adds one step of friction but doesn't send them anywhere wrong.

**Where it breaks down:** repeated over-abstention erodes trust in the AI ("it never gets what I'm saying") and adds friction at the exact moment the product is trying to make a strong first impression. This is why the ≤ 10% threshold exists as a real criterion, not just a nice-to-have.

---

## Error Path 5 — Technical failure (API error, unparseable response)

**What happened:** the call to `/api/parse` failed — network error, Anthropic API outage, malformed response, or the model returned output the parser couldn't handle (e.g. markdown fences — a real occurrence caught and fixed during the build).

**What the Pro sees:** the clarify selector. Technical failures degrade gracefully to the same experience as a correct abstention — the Pro sees the five chips and Skip, not an error message or a dead end.

**Safeguard:** the fallback is hardcoded in the route handler — any exception routes to the clarify selector. This was a deliberate build decision, not a default.

**Real precedent:** during the build, Haiku ignored the "no markdown fences" instruction and wrapped its JSON in code fences, which caused `JSON.parse()` to fail. The fix was to strip fences defensively before parsing — not to trust future model compliance. That's the same philosophy as the technical fallback: design for the failure, don't assume the happy path.

---

## Error Path 6 — Genuinely out-of-scope input (no product relationship)

**What happened:** the Pro asked for something HCP has no relationship to — hiring, legal advice, equipment repair, anything outside the product's domain entirely.

**Real example:** row 15 — "I need to hire two more techs" → correctly abstained. The model's restatement even asked a genuinely useful clarifying question back ("what's driving that need?").

**What the Pro sees:** the clarify selector. Same experience as correct abstention.

**Safeguard:** abstention worked correctly here — no force-map, no invented goal. The catalog constraint did its job.

**Note:** this is distinct from Error Path 2. Row 15 (hiring) has zero product relationship, so the model abstained. Rows 13–14 (GPS, AI phones) have a real but out-of-catalog product relationship, so the model force-mapped. That threshold — abstain on no-relationship, force-map on adjacent — is consistent and non-random, but the force-map cases are the ones with real trust risk.

---

## Summary table

| Error | Pro sees | Safeguard | Biggest gap |
|---|---|---|---|
| Misclassification | Confirm screen, wrong goal | "Not quite" button | Plausible-sounding wrong restatement — Pro may not notice |
| Should-abstain / force-map | Confirm screen, wrong path | "Not quite" button | Same — high confidence makes it invisible |
| Correct abstention | Clarify selector | None needed — working as designed | — |
| Over-abstention | Clarify selector unexpectedly | Chip tap still routes correctly | Friction and trust erosion if repeated |
| Technical failure | Clarify selector (graceful fallback) | Hardcoded fallback in route handler | None significant — degrades cleanly |
| Out-of-scope | Clarify selector | Correct abstention | — |

---

## The honest one-sentence answer for the room

The confirm screen's "Not quite" button is the primary and essentially only safeguard for a classification error — it works when the wrong goal is obviously wrong, and it's weakest when the AI produces a confident, plausible-sounding restatement of a subtly wrong goal. That's the known gap, it's documented, and tightening abstention on out-of-catalog requests is the prioritized next fix.
