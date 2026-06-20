import type { GoalId } from './activationMap';

export interface FormState {
  firstName: string;
  businessName: string;
  employees: string;
  industry: string;
  goalText: string;
}

export interface ParseResponse {
  primaryGoal: GoalId | null;
  secondaryGoal: GoalId | null;
  confidence: 'high' | 'medium' | 'low';
  abstain: boolean;
  restatement: string;
}
