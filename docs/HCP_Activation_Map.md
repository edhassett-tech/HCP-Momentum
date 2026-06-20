# HCP Activation Map: Feature Catalog & Goal Paths

## How to read this

Two layers:

1. **Feature Catalog** — the full set of HCP capabilities from the "Compare all features" page. This is the AI's **constraint set**: the model may map a stated goal only to things in here, and may never invent a feature outside it. This is also what the eval scores "out-of-catalog" against.
2. **Goal Paths** — the ~5 activation goals, each decomposed into milestones → feature → subtasks (setup + first-use). This is what the rules engine assembles *after* the AI classifies intent, and what the prototype renders.

**Scope note:** the case is limited to *up to conversion to paid*. So activation paths use only features that drive first value during the trial. Post-enroll / growth features (recurring service plans, payroll, accounting, advanced reporting, add-ons) stay in the catalog as constraint set but are **not** part of activation paths.

Plan key: **B** = Basic · **E** = Essentials · **M** = MAX. ★ = activation-relevant (used in a goal path).

---

## Part 1 — Feature Catalog (constraint set)

### Complete jobs
* ★ Drag & drop scheduling (B/E/M)
* ★ Paperless invoicing (B/E/M)
* ★ Customizable text notifications (B/E/M)
* ★ Price book management (B/E/M)
* Flat rate pricing (E/M)

### Receive & manage money
* ★ Mobile payment processing & tracking (B/E/M)
* ★ Instant credit card payouts (B/E/M)
* Credit card rates as low as 2.59% (B/E/M)
* Competitive consumer financing (B/E/M)
* Custom checklists (E/M)

### Reporting & tracking
* Customizable dashboard (B/E/M)
* Track & report cost of jobs (B/E/M)
* Employee time tracking (B/E/M)
* Save key performance reports (B/E/M)
* Expense cards (B/E/M)
* QuickBooks integration (E/M)
* Detailed job & estimate reporting (E/M)
* Technician performance (E/M)
* Equipment tracking (E/M)
* Employee GPS tracking (E/M)
* Advanced reporting (M)
* Integrate data via open API (M)

### Business solutions
* ★ Custom local phone number (B/E/M)
* ★ Live website visitor chat (E/M)
* In-app employee chat (B/E/M)
* Mobile app for iOS & Android (B/E/M)
* Pro community membership (B/E/M)
* Zapier integration (E/M)
* Key accounts onboarding specialist (M)
* Escalated phone support (M)
* Add users for $35/mo each (M)

### Drive sales
* ★ Online booking (B/E/M)
* ★ Easy estimates (B/E/M)
* ★ Review generation (B/E/M)
* ★ Premium review management (B/E/M)
* ★ Visual price book (E/M)
* Postcard & email marketing (E/M)
* Sales proposal tool ($40/mo B/E · incl. M)
* Recurring service plans ($40/mo B/E · incl. M)

### Add-ons (paid)
Accounting · Business Coaching · CSR AI · Dashcams · HCP Assist · Campaigns · HCP Payroll · Pipeline · Sales Proposal Tool · Service Plans · Tap to Pay on Mobile · Tax · Vehicle GPS Tracking

---

## Part 2 — Goal Paths

For each goal: a short milestone path, each milestone tied to a feature and split into **Setup** (turn it on) and **First value** (the celebrated value moment).

### Goal 1 — Book more jobs
* **M1 · Let customers book you online** — Online booking
  * Setup: set availability, publish booking page
  * First value: receive your first online booking 🎉
* **M2 · Quote on the spot** — Easy estimates + Visual price book
  * Setup: build a starter price book, create an estimate template
  * First value: send your first estimate (online approval) 🎉
* **M3 · Fill your calendar** — Drag & drop scheduling
  * Setup: add availability / connect calendar
  * First value: schedule your first job 🎉

### Goal 2 — Get paid faster
* **M1 · Turn on payments** — Mobile payment processing
  * Setup: set up payments, connect payout account
  * First value: accept your first payment 🎉
* **M2 · Send your first invoice** — Paperless invoicing
  * Setup: create an invoice template
  * First value: send an invoice with online pay 🎉
* **M3 · Get paid instantly** — Instant credit card payouts
  * Setup: enable instant payout
  * First value: first instant payout 🎉

### Goal 3 — Improve customer communication
* **M1 · Keep customers in the loop** — Customizable text notifications
  * Setup: turn on job notifications
  * First value: first automated text sent 🎉
* **M2 · Be reachable** — Custom local phone number / Live website chat
  * Setup: claim local number, enable site chat
  * First value: first inbound message handled 🎉
* **M3 · Follow up automatically** — Text notifications / reminders
  * Setup: enable reminders
  * First value: first reminder sent 🎉

### Goal 4 — Win repeat business / reviews
* **M1 · Ask for reviews automatically** — Review generation
  * Setup: turn on automatic review requests
  * First value: first review request sent 🎉
* **M2 · Manage your reputation** — Premium review management
  * Setup: connect Google reviews
  * First value: respond to your first review 🎉
* **M3 · Stay top of mind** — Postcard & email marketing
  * Setup: pick a campaign template
  * First value: first campaign sent 🎉

### Goal 5 — Stay on top of the day-to-day
* **M1 · See your whole day** — Drag & drop scheduling + Customizable dashboard
  * Setup: configure dashboard / calendar
  * First value: first day fully scheduled 🎉
* **M2 · Standardize your jobs** — Custom checklists
  * Setup: create a job checklist
  * First value: checklist applied to first job 🎉
* **M3 · Bring your business in** — Import ("bring your data")
  * Setup: import customers
  * First value: first imported customer scheduled 🎉

---

## Notes & open decisions

* **Goal set (tightened to 5):** book more jobs · get paid faster · improve customer communication · win repeat business/reviews · stay on top of the day-to-day. This merges the old "stay organized" + "reduce admin" (they mapped to the same features) and adds reviews (a first-class onboarding action that wasn't represented). Confirm this is the catalog you want the AI to classify into.
* **Tier gating:** a few activation features (Visual price book, Custom checklists, Live chat, Flat rate pricing) are Essentials+. Trial likely exposes a full tier, so I'd ignore gating in the prototype — but it's worth one line in the deck.
* **Shared features are fine:** scheduling, price book, and text notifications appear in multiple paths. The AI only picks the goal; shared features just show up in more than one path.
* **Excluded from activation paths:** Pipeline, Recurring service plans, accounting, payroll, advanced reporting, GPS/equipment tracking — post-enroll or add-on. Kept in the catalog as constraint set only.
* **Competitive intel for the deck:** HCP already sells AI — **CSR AI** and **HCP Assist** are paid add-ons, and the Home dashboard has an AI prompt bar. So "AI in onboarding" is consistent with where they're already headed, not a foreign concept to the org.
