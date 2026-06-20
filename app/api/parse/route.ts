import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { GOALS, GoalId } from '@/lib/activationMap';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const VALID_IDS = new Set<string>(GOALS.map(g => g.id));

// Build system prompt from the catalog so descriptions stay in one place.
const CATALOG = GOALS.map(g => `- ${g.id}: ${g.description}`).join('\n');

const SYSTEM = `You are a goal classifier for Housecall Pro, a field service management platform.

Classify the pro's stated goal into exactly one of these catalog goals, or abstain.

Catalog:
${CATALOG}

Rules:
1. "primaryGoal" must be one of the catalog IDs above, or null.
2. Abstain (set "abstain": true, "primaryGoal": null) when the goal is vague ("grow my business", "make more money"), empty, or clearly outside the catalog (unrelated to running a field service business).
3. "secondaryGoal" is a second catalog ID if a clear secondary theme is present, otherwise null.
4. "confidence": "high" for a clean match, "medium" if plausible but implicit, "low" if a stretch.
5. "restatement":
   - If NOT abstaining: one plain-language sentence that echoes the pro's actual words and names their core intent.
   - If abstaining: one short, warm, curious sentence addressed to the pro. If they wrote something, weave in their actual words and invite them to narrow down (e.g. "Growing your business can mean a lot of things — what feels most pressing right now?"). If they wrote nothing, invite them to share what they want first. Never name a catalog goal ID, never promise a specific feature, never explain that you are abstaining or why.
6. Return ONLY valid JSON — no prose, no markdown fences, no extra keys.

Schema:
{"primaryGoal":"<id|null>","secondaryGoal":"<id|null>","confidence":"high|medium|low","abstain":false,"restatement":"..."}`;

function isGoalId(v: unknown): v is GoalId {
  return typeof v === 'string' && VALID_IDS.has(v);
}

export interface ParseResponse {
  primaryGoal: GoalId | null;
  secondaryGoal: GoalId | null;
  confidence: 'high' | 'medium' | 'low';
  abstain: boolean;
  restatement: string;
}

const FALLBACK: ParseResponse = {
  primaryGoal: null,
  secondaryGoal: null,
  confidence: 'low',
  abstain: true,
  restatement: '',
};

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(FALLBACK);
  }

  const { firstName, businessName, employees, industry, goalText } = body;

  const userMsg = [
    `Pro: ${firstName ?? ''}, ${businessName ?? ''}`,
    `Team size: ${employees ?? ''}`,
    `Industry: ${industry ?? ''}`,
    `Goal: ${goalText?.trim() || '(no goal provided)'}`,
  ].join('\n');

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM,
      messages: [{ role: 'user', content: userMsg }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text.trim() : '';
    // Strip markdown code fences if the model wraps its output
    const raw = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    const response: ParseResponse = {
      primaryGoal: isGoalId(parsed.primaryGoal) ? parsed.primaryGoal : null,
      secondaryGoal: isGoalId(parsed.secondaryGoal) ? parsed.secondaryGoal : null,
      confidence: (['high', 'medium', 'low'] as const).includes(parsed.confidence as 'high' | 'medium' | 'low')
        ? (parsed.confidence as 'high' | 'medium' | 'low')
        : 'low',
      abstain: parsed.abstain === true,
      restatement: typeof parsed.restatement === 'string' ? parsed.restatement : '',
    };

    return NextResponse.json(response);
  } catch {
    // API failure or unparseable output → fall back to clarify selector
    return NextResponse.json(FALLBACK);
  }
}
