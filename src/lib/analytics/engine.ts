import { reflectionExplanation, strengthExplanation, verdictCommentary } from "./copy";
import { assignPersonality } from "./personalities";
import { CATEGORIES, QUESTION_BANK, getQuestion } from "./questionBank";
import type {
  AnalyticsReport,
  AnswerOutcome,
  AnswerPattern,
  CategoryAnalytics,
  CategoryHighlight,
  Flag,
  OverallResult,
  QuizAnswer,
  ScoreBand,
  ScoredAnswer,
  ScoreTier,
} from "./types";

/**
 * The game's existing thresholds. The overall score is deliberately the plain
 * "swipes that match the classification" percentage, unchanged by anything below.
 */
const RED_FLAG_BELOW = 70;
const TIER_HIGH_FROM = 90;
const TIER_GOOD_FROM = 70;
const TIER_AVERAGE_FROM = 40;

/**
 * Category points. A right swipe is constructive on a green statement and the
 * opposite on a red one, so every answer is judged against its own statement's
 * classification rather than by swipe direction.
 */
export const OUTCOME_POINTS: Record<AnswerOutcome, number> = {
  constructive: 2,
  contextual: 1,
  reflect: 0,
};

/** One swipe can't support a ranking, however clean its percentage looks. */
export const MIN_ANSWERS_TO_RANK = 2;
const MAX_HIGHLIGHTS = 3;
/** A strength has to be net positive; a reflection area has to be short of the Green Flag line. */
const STRENGTH_FROM = 60;
const REFLECTION_BELOW = 70;

const BAND_HIGH_FROM = 70;
const BAND_MEDIUM_FROM = 40;

function isFlag(value: unknown): value is Flag {
  return value === "red" || value === "green";
}

function scoreAnswers(answers: QuizAnswer[]): ScoredAnswer[] {
  // A map keeps the latest swipe per question and quietly drops anything malformed.
  const latestById = new Map<number, ScoredAnswer>();

  for (const answer of answers) {
    const question = getQuestion(answer?.id);
    if (!question || !isFlag(answer.flag)) continue;

    const outcome: AnswerOutcome = answer.flag === question.type
      ? "constructive"
      : question.nuance === "contextual" ? "contextual" : "reflect";

    latestById.set(question.id, { question, flag: answer.flag, outcome, points: OUTCOME_POINTS[outcome] });
  }

  return [...latestById.values()];
}

function getTier(percentage: number): ScoreTier {
  if (percentage >= TIER_HIGH_FROM) return "HIGH";
  if (percentage >= TIER_GOOD_FROM) return "GOOD";
  if (percentage >= TIER_AVERAGE_FROM) return "AVERAGE";
  return "LOW";
}

function getBand(percent: number): ScoreBand {
  if (percent >= BAND_HIGH_FROM) return "high";
  if (percent >= BAND_MEDIUM_FROM) return "medium";
  return "low";
}

function getOverall(scored: ScoredAnswer[]): OverallResult {
  const answered = scored.length;
  const matched = scored.filter((answer) => answer.flag === answer.question.type).length;
  const greenPercent = answered > 0 ? Math.round((matched / answered) * 100) : 0;

  return {
    answered,
    matched,
    greenPercent,
    redPercent: answered > 0 ? 100 - greenPercent : 0,
    isRedFlag: greenPercent < RED_FLAG_BELOW,
    tier: getTier(greenPercent),
  };
}

function getCategories(scored: ScoredAnswer[]): CategoryAnalytics[] {
  return CATEGORIES.map(({ id, name }) => {
    const answers = scored.filter((answer) => answer.question.category === id);
    const answered = answers.length;
    const score = answers.reduce((total, answer) => total + answer.points, 0);
    const maxScore = answered * OUTCOME_POINTS.constructive;
    const minScore = answers.reduce(
      (total, answer) => total + (answer.question.nuance === "contextual" ? OUTCOME_POINTS.contextual : OUTCOME_POINTS.reflect),
      0,
    );
    // Normalized against maxScore, not (max - min): a context-dependent answer
    // earns its neutral half credit, and min-max scaling would turn that back into 0%.
    const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : null;

    return {
      id,
      name,
      questionsInBank: QUESTION_BANK.filter((question) => question.category === id).length,
      answered,
      score,
      minScore,
      maxScore,
      percent,
      band: percent === null ? null : getBand(percent),
      rankable: answered >= MIN_ANSWERS_TO_RANK,
      constructiveCount: answers.filter((answer) => answer.outcome === "constructive").length,
      contextualCount: answers.filter((answer) => answer.outcome === "contextual").length,
      reflectCount: answers.filter((answer) => answer.outcome === "reflect").length,
      answers,
    };
  });
}

function getStrongest(categories: CategoryAnalytics[]): CategoryAnalytics[] {
  return categories
    .filter((category) => category.rankable && category.percent! >= STRENGTH_FROM)
    .sort((a, b) => b.percent! - a.percent! || b.answered - a.answered)
    .slice(0, MAX_HIGHLIGHTS);
}

/**
 * Strengths are chosen first, so a category never appears on both lists. A
 * category needs at least one clear-cut answer behind it to be listed here:
 * context-dependent preferences alone can never become a Red Flag.
 */
function getWeakest(categories: CategoryAnalytics[], strongest: CategoryAnalytics[]): CategoryAnalytics[] {
  return categories
    .filter((category) =>
      category.rankable &&
      category.percent! < REFLECTION_BELOW &&
      category.reflectCount > 0 &&
      !strongest.includes(category))
    .sort((a, b) => a.percent! - b.percent! || b.reflectCount - a.reflectCount || b.answered - a.answered)
    .slice(0, MAX_HIGHLIGHTS);
}

function toHighlight(category: CategoryAnalytics, explanation: string): CategoryHighlight {
  return { id: category.id, name: category.name, percent: category.percent!, explanation };
}

function getPattern(scored: ScoredAnswer[]): AnswerPattern {
  const redStatements = scored.filter((answer) => answer.question.type === "red");
  const greenStatements = scored.filter((answer) => answer.question.type === "green");

  return {
    answered: scored.length,
    redStatements: redStatements.length,
    redStatementsFlagged: redStatements.filter((answer) => answer.flag === "red").length,
    greenStatements: greenStatements.length,
    greenStatementsBacked: greenStatements.filter((answer) => answer.flag === "green").length,
  };
}

/** Every number and label in the report and on the share card comes from this one object. */
export function buildAnalyticsReport(answers: QuizAnswer[]): AnalyticsReport {
  const scored = scoreAnswers(answers);
  const overall = getOverall(scored);
  const categories = getCategories(scored);
  const pattern = getPattern(scored);

  const strongestCategories = getStrongest(categories);
  const strongest = strongestCategories.map((category) => toHighlight(category, strengthExplanation(category)));
  const weakest = getWeakest(categories, strongestCategories).map((category) => toHighlight(category, reflectionExplanation(category)));

  const personality = assignPersonality(overall, pattern, categories, strongest, weakest);

  return {
    overall,
    commentary: verdictCommentary(overall),
    categories,
    strongest,
    weakest,
    pattern,
    personality,
    share: {
      greenPercent: overall.greenPercent,
      isRedFlag: overall.isRedFlag,
      personalityTitle: personality.title,
      biggestGreenFlag: strongest[0]?.name ?? null,
      biggestRedFlag: weakest[0]?.name ?? null,
    },
  };
}
