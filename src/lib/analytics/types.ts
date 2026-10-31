export type Flag = "red" | "green";

export type CategoryId =
  | "communication"
  | "trust"
  | "boundaries"
  | "jealousy"
  | "respect"
  | "maturity"
  | "commitment"
  | "support";

/**
 * "clear": the game's classification reads the same in almost any relationship.
 * "contextual": a reasonable preference that only becomes a concern in some
 * relationships, so disagreeing with the game on it is never held against the player.
 */
export type QuestionNuance = "clear" | "contextual";

export interface Question {
  id: number;
  /** The game's own Red Flag / Green Flag classification. Also the answer key. */
  type: Flag;
  image: string;
  text: string;
  subtext: string;
  category: CategoryId;
  nuance: QuestionNuance;
}

/** One swipe, in the exact shape the quiz records it. */
export interface QuizAnswer {
  id: number;
  flag: Flag;
  correctFlag: Flag;
}

/**
 * - constructive: the swipe matches the game's classification.
 * - contextual: the swipe differs, but on a statement that depends on context.
 * - reflect: the swipe differs on a clear-cut statement.
 */
export type AnswerOutcome = "constructive" | "contextual" | "reflect";

export interface ScoredAnswer {
  question: Question;
  flag: Flag;
  outcome: AnswerOutcome;
  points: number;
}

export type ScoreTier = "HIGH" | "GOOD" | "AVERAGE" | "LOW";
export type ScoreBand = "high" | "medium" | "low";

export interface OverallResult {
  answered: number;
  matched: number;
  greenPercent: number;
  redPercent: number;
  isRedFlag: boolean;
  tier: ScoreTier;
}

export interface CategoryAnalytics {
  id: CategoryId;
  name: string;
  questionsInBank: number;
  answered: number;
  score: number;
  minScore: number;
  maxScore: number;
  /** null when the round produced no answers in this category. */
  percent: number | null;
  band: ScoreBand | null;
  /** False when one swipe is all we know, so the category is never ranked. */
  rankable: boolean;
  constructiveCount: number;
  contextualCount: number;
  reflectCount: number;
  answers: ScoredAnswer[];
}

export interface CategoryHighlight {
  id: CategoryId;
  name: string;
  percent: number;
  explanation: string;
}

export interface AnswerPattern {
  answered: number;
  redStatements: number;
  redStatementsFlagged: number;
  greenStatements: number;
  greenStatementsBacked: number;
}

export interface Personality {
  id: string;
  title: string;
  description: string;
  emoji: string;
  /** Text and glow color for the personality's badge. */
  accent: string;
  /** Position in the collection, shown as "Type 03 of 12". */
  index: number;
  insights: string[];
}

export interface ShareSummary {
  greenPercent: number;
  isRedFlag: boolean;
  personalityTitle: string;
  biggestGreenFlag: string | null;
  biggestRedFlag: string | null;
}

export interface AnalyticsReport {
  overall: OverallResult;
  commentary: string;
  categories: CategoryAnalytics[];
  strongest: CategoryHighlight[];
  weakest: CategoryHighlight[];
  pattern: AnswerPattern;
  personality: Personality;
  share: ShareSummary;
}
