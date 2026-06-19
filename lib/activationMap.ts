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
