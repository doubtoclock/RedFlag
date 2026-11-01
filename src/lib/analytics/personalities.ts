import { CATEGORY_COPY } from "./copy";
import type {
  AnswerPattern,
  CategoryAnalytics,
  CategoryHighlight,
  CategoryId,
  OverallResult,
  Personality,
} from "./types";

interface PersonalityContext {
  overall: OverallResult;
  pattern: AnswerPattern;
  /** A category's percentage, or null when too few answers exist to lean on it. */
  score: (id: CategoryId) => number | null;
}

interface PersonalityRule {
  id: string;
  title: string;
  description: string;
  emoji: string;
  accent: string;
  image: string;
  tip: string;
  matches: (context: PersonalityContext) => boolean;
}

export const ARCHETYPE_IMAGES: Record<string, string> = {
  "plot-twist": "/images/Plot_Twist.jpeg",
  "professional-skeptic": "/images/Professional_Skeptic.jpeg",
  "hopeless-romantic": "/images/Hopeless_Romantic.jpeg",
  "green-flag-enthusiast": "/images/Green_Flag_Enthusiast.jpeg",
  "independent-romantic": "/images/Independent_Romantic.jpeg",
  "talk-it-out-legend": "/images/Talk_It_Out_Loud.jpeg",
  "supportive-romantic": "/images/Supportive_Romantic.jpeg",
  "receipt-keeper": "/images/Receipt_Keeper.jpeg",
  "overthinker": "/images/Overthinker.jpeg",
  "velcro-romantic": "/images/Velcro_Romantic.jpeg",
  "balanced-partner": "/images/Balanced_Partner.jpeg",
  "work-in-progress": "/images/Work_In_Progress.jpeg",
};

export function getArchetypeImage(id: string): string {
  if (ARCHETYPE_IMAGES[id]) return ARCHETYPE_IMAGES[id];
  const normalized = id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return ARCHETYPE_IMAGES[normalized] ?? "/images/Work_In_Progress.jpeg";
}

const MIN_ANSWERS_FOR_PERSONALITY = 6;
/** Flattering types should not contradict a verdict that went badly overall. */
const MIN_PERCENT_FOR_POSITIVE_TYPE = 50;

const atLeast = (value: number | null, threshold: number) => value !== null && value >= threshold;
const below = (value: number | null, threshold: number) => value !== null && value < threshold;

/** Ordered: the first rule that matches wins, and the last rule always matches. */
export const PERSONALITY_RULES: PersonalityRule[] = [
  {
    id: "plot-twist",
    title: "The Plot Twist",
    description: "Not enough swipes to pin you down. Mysterious, or just busy.",
    emoji: "🎭",
    accent: "#c4b5fd",
    image: "/images/Plot_Twist.jpeg",
    tip: "Finish a full round and we'll tell you exactly who you are.",
    matches: ({ overall }) => overall.answered < MIN_ANSWERS_FOR_PERSONALITY,
  },
  {
    id: "professional-skeptic",
    title: "The Professional Skeptic",
    description: "You could find a red flag in a golden retriever. Nobody is getting past you.",
    emoji: "🕵️",
    accent: "#fbbf24",
    image: "/images/Professional_Skeptic.jpeg",
    tip: "Some green flags are just green flags. You're allowed to enjoy them.",
    matches: ({ pattern }) => pattern.greenStatements >= 3 && pattern.greenStatementsBacked / pattern.greenStatements <= 0.25,
  },
  {
    id: "hopeless-romantic",
    title: "The Hopeless Romantic",
    description: "You see the best in everyone, including the ones who are currently waving the flag at you.",
    emoji: "💘",
    accent: "#f9a8d4",
    image: "/images/Hopeless_Romantic.jpeg",
    tip: "Benefit of the doubt is lovely. Just keep some for yourself.",
    matches: ({ pattern }) => pattern.redStatements >= 5 && pattern.redStatementsFlagged / pattern.redStatements <= 0.4,
  },
  {
    id: "green-flag-enthusiast",
    title: "The Green Flag Enthusiast",
    description: "Your instincts are annoyingly good. Whoever gets you is doing fine.",
    emoji: "🏆",
    accent: "#4ade80",
    image: "/images/Green_Flag_Enthusiast.jpeg",
    tip: "Keep trusting your read. It's clearly working.",
    matches: ({ overall }) => overall.greenPercent >= 90,
  },
  {
    id: "independent-romantic",
    title: "The Independent Romantic",
    description: "All in on love, and all in on your own Saturday plans. You've figured out both.",
    emoji: "🦋",
    accent: "#67e8f9",
    image: "/images/Independent_Romantic.jpeg",
    tip: "Let them see how much you like them too. Independence isn't the same as distance.",
    matches: ({ overall, score }) =>
      overall.greenPercent >= MIN_PERCENT_FOR_POSITIVE_TYPE &&
      atLeast(score("boundaries"), 85) &&
      (atLeast(score("trust"), 75) || atLeast(score("jealousy"), 75)),
  },
  {
    id: "talk-it-out-legend",
    title: "The Talk-It-Out Legend",
    description: "Other people go quiet. You book a meeting with the problem and fix it.",
    emoji: "🎙️",
    accent: "#93c5fd",
    image: "/images/Talk_It_Out_Loud.jpeg",
    tip: "Not every moment needs a debrief. Sometimes a hug is the whole conversation.",
    matches: ({ overall, score }) =>
      overall.greenPercent >= MIN_PERCENT_FOR_POSITIVE_TYPE &&
      atLeast(score("communication"), 75) &&
      atLeast(score("maturity"), 75),
  },
  {
    id: "supportive-romantic",
    title: "The Supportive Romantic",
    description: "You show up, you stay clear about what this is, and you remember the snacks.",
    emoji: "🤝",
    accent: "#86efac",
    image: "/images/Supportive_Romantic.jpeg",
    tip: "Make sure someone is showing up for you the same way.",
    matches: ({ overall, score }) =>
      overall.greenPercent >= MIN_PERCENT_FOR_POSITIVE_TYPE &&
      atLeast(score("support"), 75) &&
      atLeast(score("commitment"), 75),
  },
  {
    id: "receipt-keeper",
    title: "The Receipt Keeper",
    description: "You forgot their birthday, but you have the screenshots from 2021. Filed and dated.",
    emoji: "🧾",
    accent: "#fdba74",
    image: "/images/Receipt_Keeper.jpeg",
    tip: "Try letting one thing go this week. You can keep the rest of the archive.",
    matches: ({ score }) => below(score("maturity"), 50),
  },
  {
    id: "overthinker",
    title: "The Overthinker",
    description: "Three dots appeared and then disappeared. You've already written the whole movie.",
    emoji: "🌀",
    accent: "#a5b4fc",
    image: "/images/Overthinker.jpeg",
    tip: "Ask the question before your brain writes the sequel.",
    matches: ({ score }) => below(score("jealousy"), 50) && below(score("trust"), 75),
  },
  {
    id: "velcro-romantic",
    title: "The Velcro Romantic",
    description: "Why have one toothbrush at their place when you could just move in? You love being close.",
    emoji: "🧲",
    accent: "#fda4af",
    image: "/images/Velcro_Romantic.jpeg",
    tip: "A little time apart gives you something to talk about at dinner.",
    matches: ({ score }) => below(score("boundaries"), 50),
  },
  {
    id: "balanced-partner",
    title: "The Balanced Partner",
    description: "No big dramas, no wild extremes. You are the calm friend everyone calls after the breakup.",
    emoji: "⚖️",
    accent: "#d6d3d1",
    image: "/images/Balanced_Partner.jpeg",
    tip: "Balanced is a real strength. Pick one area and take it from good to great.",
    matches: ({ overall }) => overall.greenPercent >= 60,
  },
  {
    id: "work-in-progress",
    title: "The Work in Progress",
    description: "Some flags, some growth, plenty of plot left. The best characters always start here.",
    emoji: "🌱",
    accent: "#bef264",
    image: "/images/Work_In_Progress.jpeg",
    tip: "Pick one thing from this report and try it this week. That's the whole assignment.",
    matches: () => true,
  },
];

function strengthInsight(strongest: CategoryHighlight[]): string {
  const top = strongest[0];
  if (!top) return "No single strength stood out this round, so there's room to surprise yourself.";
  return `${top.name} is your best card. ${CATEGORY_COPY[top.id].strengthInsight}`;
}

function growthInsight(weakest: CategoryHighlight[]): string {
  const bottom = weakest[0];
  if (!bottom) return "Nothing needs fixing right now. Don't let it go to your head.";
  return `${bottom.name} is your one to work on. ${CATEGORY_COPY[bottom.id].growthInsight}`;
}

function patternInsight({ redStatements, redStatementsFlagged, greenStatements, greenStatementsBacked }: AnswerPattern): string | null {
  if (redStatements === 0 && greenStatements === 0) return null;
  if (greenStatements === 0) return `You called out ${redStatementsFlagged} of the ${redStatements} red flag cards you saw.`;
  if (redStatements === 0) return `You backed ${greenStatementsBacked} of the ${greenStatements} green flag cards you saw.`;
  return `You called out ${redStatementsFlagged} of ${redStatements} red flag cards and backed ${greenStatementsBacked} of ${greenStatements} green ones.`;
}

export function assignPersonality(
  overall: OverallResult,
  pattern: AnswerPattern,
  categories: CategoryAnalytics[],
  strongest: CategoryHighlight[],
  weakest: CategoryHighlight[],
): Personality {
  const scoreFor = (id: CategoryId) => {
    const category = categories.find((entry) => entry.id === id);
    return category?.rankable ? category.percent : null;
  };

  const context: PersonalityContext = { overall, pattern, score: scoreFor };
  const ruleIndex = PERSONALITY_RULES.findIndex((candidate) => candidate.matches(context));
  const { id, title, description, emoji, accent, image, tip } = PERSONALITY_RULES[ruleIndex];

  const insights = id === "plot-twist"
    ? [tip, patternInsight(pattern) ?? "Every card you swipe sharpens the picture."]
    : [strengthInsight(strongest), growthInsight(weakest), patternInsight(pattern) ?? tip];

  return { id, title, description, emoji, accent, image: image ?? getArchetypeImage(id), index: ruleIndex + 1, insights };
}
