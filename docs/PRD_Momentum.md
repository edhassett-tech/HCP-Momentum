# PRD: Momentum

*AI-powered guided activation for the Housecall Pro free trial*

## Problem Statement

Housecall Pro's initial product experience presents new users with too many competing actions, a lengthy onboarding process, and limited guidance on what to do next.

Users sign up with a specific business goal in mind, but the current experience surfaces a broad set of features and setup tasks at once. The onboarding cannot adapt to that goal because it never captures it in any usable form — every Pro lands in the same one-size-fits-all path. This creates cognitive overload, slows time-to-value, and disconnects setup from the outcome the Pro actually came for.

As a result:

* Users encounter a long, generic checklist regardless of who they are or why they signed up
* Onboarding and dashboard prompts compete for attention
* Feature discovery is disconnected from the Pro's immediate business goal
* Progress feels unclear and hard to measure
* Value realization is delayed, reducing activation and paid conversion

The current experience asks users to do too much, in no particular order, before they experience meaningful value.

---

## Opportunity

Shift onboarding from a generic setup checklist to a **personalized activation journey** built around the goal the Pro actually states — in their own words.

Two facts from the funnel data shape the bet:

* **Breadth of feature usage predicts conversion** (number of *unique* features tried), while depth does not. So the job is to route Pros to the *right several* activation steps quickly, not to push volume on any one.
* **~50% of trial-to-paid conversions happen on day one.** So personalization has to land in the first session, not via a drip over two weeks.

The lever: capture the Pro's goal as free-form input, use AI to interpret it, and use that interpretation to drive a focused, relevant activation path that gets them to value fast — on day one.

---

## Goals

### Business Goals

* Increase trial-to-paid conversion
* Improve activation rate
* Reduce time-to-value
* Increase breadth of feature engagement in the first session
* Improve onboarding completion rates

### User Goals

* Understand what to do first
* Achieve a meaningful business outcome quickly
* Feel confident they are making progress
* Discover relevant features at the right moment
* Experience early wins that justify continued investment

---

## User Insights & Observations

### Overwhelming Initial Experience
Users face numerous onboarding tasks, dashboard prompts, upgrade messages, and feature recommendations simultaneously.

### One-Size-Fits-All Guidance
A solo handyman and a 10-person plumbing company get largely the same onboarding despite different jobs-to-be-done.

### Goals Are Never Captured in a Usable Way
The product can't personalize to intent it never collects. Where goals *are* asked for elsewhere, fixed dropdowns force Pros into pre-baked buckets that rarely match their real situation.

### Feature-First Orientation
The product teaches features instead of helping customers achieve outcomes.

### Weak Progress Reinforcement
Users get limited feedback that they're moving toward success.

---

## Proposed Solution: AI-Powered Guided Activation

Capture the Pro's goal in their own words at the start of onboarding, use AI to interpret it, and route them into a focused activation path.

The flow:

1. **Capture context** — basic profile (name, business name, number of employees, industry) plus an **open-ended goal field** (text, with voice as a natural extension).
2. **AI interprets the goal** — parses the free-form input into a structured intent: a primary goal mapped to a known catalog, any secondary goals, and a confidence level.
3. **Confirm before committing** — the system restates what it heard in plain language and lets the Pro confirm or correct it.
4. **Generate the path** — a rules-based engine maps confirmed intent + profile to a personalized activation path of bite-sized milestones.
5. **Guide and adapt** — surface one recommended next action at a time, provide contextual education, celebrate completed milestones, and re-prioritize as the Pro progresses.

### Architecture: AI for interpretation, rules for reliability

AI is used in exactly one place — turning ambiguous human input into structured intent — because that is the one place a decision tree genuinely cannot cover the long tail. Everything downstream (path selection, sequencing, education) is deterministic and rules-based, which keeps it predictable, explainable, and cheap to maintain. This is a deliberate scoping choice: AI where ambiguity lives, rules where reliability matters.

---

## Where AI Is and Isn't Used (Autonomy Boundary)

**AI does autonomously:**
* Parse the open-ended goal (text/voice) into structured intent
* Map intent to a primary goal in the known catalog, flag secondary goals, attach a confidence score
* Produce the plain-language restatement shown back to the Pro

**Always handed back to the human:**
* The Pro confirms or corrects the inferred goal before any path is committed
* The Pro can change their goal or override the path at any time

**AI does NOT:**
* Do the Pro's setup work, create or touch real customers, or send anything
* Act irreversibly on an inference
* Output anything outside the known goal/feature catalog

The AI interprets and routes. It never executes on the Pro's behalf.

---

## Trust & Failure Handling

* **Confirm-before-commit.** Every interpretation is restated to the Pro and gated behind their confirmation. This is the primary trust mechanic and the answer to "what happens when the AI is wrong" — it's wrong *out loud*, and one tap fixes it.
* **Low-confidence abstention.** On empty or ambiguous input ("idk, just looking"), the AI does not guess. It asks one clarifying question or drops to a safe default path.
* **Constrained output.** The AI can only map to goals and features that exist in Housecall Pro. It cannot invent or promise something the product doesn't do.
* **Always correctable.** The Pro can change goal or path at any point; nothing is locked.
* **Trust compounds.** Early interpretations that are fast, accurate, and trivially correctable build confidence that carries into later recommendations.

---

## Non-AI Alternative Considered

**Fixed-dropdown goal selection feeding a rules-based path.** The Pro picks from a fixed list (book more jobs, get paid faster, stay organized, etc.), which routes them into a predefined activation journey.

Why it's not the centerpiece: dropdowns force every Pro into a handful of pre-baked buckets and flatten real intent. "Summer's busy and I keep losing jobs because I'm slow to quote and follow up" is not cleanly "book more jobs" — it spans quoting speed, follow-up, and communication. A fixed list can't capture that nuance or cover the long tail of how Pros actually describe their businesses; natural-language parsing can.

Note: we kept the good part of this alternative. The *downstream path* stays rules-based — that's the reliable, low-cost piece. AI is added only at the interpretation step, where it earns its place.

**Evidence from the prototype.** This isn't hypothetical — the live classifier confirms it on real input. "Customers always say they didn't know I was coming" classified correctly as `improve_customer_communication` with no feature word anywhere in the sentence. "Summer's busy and I keep losing customers because I'm slow to send quotes" classified as `book_more_jobs`. Neither maps to a goal via keyword match; a fixed dropdown would force the Pro to self-categorize and likely mis-bucket both. The parser also correctly *declined* to guess on genuinely vague input ("I want to grow my business," "make more money") rather than force-fitting it — a dropdown can't abstain.

---

## Data Capture & CRM Integration (Future — Signup Layer)

The goal statement and parsed intent are valuable beyond onboarding — they're early-lifecycle signal sales and success teams don't have today. For the production build (not this prototype):

* **Capture and store**, against the Pro's account: the raw goal text, the parsed primary/secondary intent, confidence, and whether the Pro confirmed or corrected the AI's read.
* **Sync to the company CRM (Salesforce)** as part of the lead/account record, so a parallel sales conversation (recall: most leads are still called by sales even on the PLG track) has the Pro's *stated* goal in their own words — not just inferred firmographics.
* This is a **precursor requirement for the real signup flow**, where goal capture would actually live — not something the prototype builds. The prototype's intake page stands in for that future signup step; the CRM sync described here is what that real step would eventually do.

**Open question for the team:** field mapping and ownership on the Salesforce side, and whether goal data syncs in real time or batches — worth a conversation with sales ops before this is built.

---

## Core Experience Principles

1. **One next best action** — the Pro always knows the single most important thing to do next.
2. **Outcome-based** — framed around business outcomes, not product features ("Let customers book online," not "Set up Online Booking").
3. **Bite-sized progress** — large setup broken into manageable milestones.
4. **Contextual education** — guidance appears only when it helps complete the current task.
5. **Momentum & celebration** — completed milestones trigger reinforcement and visibility into what's next.

---

## Example User Journey

**Profile:** Maria — Coastline Comfort HVAC — 3 employees — HVAC

**Open goal (her words):**
> "Summer's our busy season and I keep losing customers because I'm slow to send quotes and follow up. I want to stop leaving money on the table."

**AI-inferred intent:**
* Primary: win more jobs through faster quoting and follow-up
* Secondary: customer communication
* Confidence: high

**Confirmation shown to Maria:**
> "Sounds like your main goal is winning more jobs by quoting and following up faster — did I get that right?" [Yes] [Not quite]

**Generated activation path (rules-based, given intent + HVAC + 3 employees):**
* Milestone 1 — Send your first estimate → *create an estimate template*
* Milestone 2 — Never miss a follow-up → *turn on automated estimate follow-ups*
* Milestone 3 — Let customers book you directly → *enable online booking*

A fixed dropdown would have flattened Maria into "book more jobs" and missed the quoting-and-follow-up nuance that defines her actual path. That gap is the AI's value.

---

## Prototype Scope (What We're Building for the Demo)

**Build:**
* A single **interstitial intake page** that stands in for the signup context: name, business name, number of employees, industry, plus the **open-ended goal field**
* AI parsing of the open field into structured intent, with the **confirmation step**
* A generated **guided activation view**: personalized milestone path, one recommended next action, and a celebration/progress state

**Explicitly NOT building:**
* The real signup flow or its steps (the interstitial page substitutes for context only)
* Voice capture (shown as a stubbed mic affordance; described, not wired)
* Full onboarding or dashboard redesign
* Backend persistence or real account provisioning
* Goal data capture/storage or CRM sync — see *Data Capture & CRM Integration* above; that's a real requirement for the future signup layer, not this prototype

This keeps the demo tight and centered on the one thing that matters: messy human input → AI interpretation → confirmed intent → personalized path.

---

## Product MVP Scope (Beyond the Prototype)

### Included
* Open-text (and eventually voice) goal capture in onboarding
* AI intent parsing with confidence and confirmation
* Rules-based personalized activation path
* Milestone-based progress tracking
* Contextual education
* Success and celebration states
* Adaptive re-prioritization as the Pro progresses

### Not Included
* AI that performs the Pro's setup work
* Full onboarding/dashboard redesign
* Cross-channel lifecycle messaging
* ML decisioning beyond intent parsing

---

## Success Metrics

### Primary (outcome)
* Trial-to-paid conversion rate
* Activation rate
* Time-to-first-value / time-to-activation
* **Breadth of feature engagement** — unique features touched, especially in session one (leading indicator)

### Secondary (engagement)
* Onboarding completion rate
* Recommended-action completion rate
* Milestones completed per user
* Day 7 / Day 14 engagement

### AI Quality (the model's own bar)
* Intent classification accuracy (top-1) on the eval set
* Confirmation acceptance rate — % of inferred goals accepted without edit
* Appropriate-abstention rate on ambiguous inputs
* Out-of-catalog rate (target ≈ 0)

### Instrumentation

What to actually log, so the above metrics are answerable two weeks after launch — not just defined:

* **Goal submitted** — event with raw goal text, parsed primary/secondary intent, confidence, abstain flag
* **Confirm shown** — and whether the Pro tapped "you got it" or "not quite" (this *is* the confirmation acceptance rate, captured directly rather than inferred)
* **Clarify selector shown** — which chip was tapped, or whether the Pro skipped
* **Milestone resolved** — per milestone: marked done, skipped, and time elapsed since goal confirmation (feeds time-to-first-value)
* **Goal completed** — all milestones resolved; whether the Pro started a second goal from the "want to set up another goal?" screen, and which one
* **Feature breadth** — distinct features touched in session one, derived from which milestones were marked done across any goals attempted

This list is also the direct answer to "how would you instrument this to know it's working two weeks after launch" — every primary and AI-quality metric above traces to one of these events.

---

## Quality Bar Before Ship

Before this ships, the intent parser must clear, on the eval set:
* Top-1 intent accuracy above an agreed threshold (set during eval calibration)
* Near-zero hallucinated or out-of-catalog goals
* Appropriate abstention on ambiguous inputs rather than confident wrong guesses

A confident wrong answer is worse than an abstention here, because the confirm step makes abstention cheap and a wrong path expensive.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| AI misinterprets the stated goal | Confirm-before-commit step; easy correction; abstain on low confidence |
| AI references a feature/goal HCP doesn't support | Constrain output to a known catalog |
| Open field intimidates users or comes back blank | Placeholder prompts and examples; allow skip to a safe default path |
| Pros want access to everything immediately | Keep the full product accessible alongside the guided path |
| (Future) voice transcription errors | Show an editable transcript before parsing |
| (Future) goal data syncs to CRM but field mapping/ownership isn't settled with sales ops | Treat as an open question to resolve before build, not an assumption baked into the schema |

---

## Vision

Housecall Pro becomes an onboarding guide that understands each Pro's real intent — in their own words — and routes them to their first meaningful outcome fast. Not by doing the work for them, and not with a one-size-fits-all checklist, but by listening to what they actually want and adapting the path to get them there.
