# Momentum

AI-powered guided activation prototype for Housecall Pro's free trial — built for the Director, Product Management (Growth & PLG) case study.

A Pro states their first goal in their own words. AI parses it into structured intent, the Pro confirms or corrects it, and a personalized activation path is generated from there. AI is used in exactly one place — interpreting ambiguous input — everything downstream is deterministic.

## Process docs

See [`docs/`](./docs) for the full process trail:
* `PRD_Momentum.md` — problem framing, solution design, AI architecture, scope
* `HCP_Activation_Map.md` — feature catalog and goal→milestone decomposition
* `Eval_Spec_Goal_Intent_Parser.md` — success criteria, error taxonomy, test set
* `Eval_Results.md` — actual eval run output and analysis
* `Build_Spec_Momentum_Prototype.md` — architecture and build order

## Run it locally

The app lives in `hcp-momentum/`.

```
cd hcp-momentum
npm install
```

Create a `.env.local` file in `hcp-momentum/` with:
```
ANTHROPIC_API_KEY=your-key-here
```

Then:
```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Best viewed at mobile width — the UI is designed mobile-first.

## Stack

Next.js (App Router) + TypeScript + Tailwind. One server route (`/api/parse`) calls the Anthropic API (Claude Haiku) to keep the key server-side. Everything else — path generation, milestone sequencing — is deterministic, driven by `lib/activationMap.ts`.
