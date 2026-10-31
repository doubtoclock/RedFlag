import type { CategoryAnalytics, CategoryId, OverallResult, ScoredAnswer } from "./types";

interface CategoryCopy {
  strength: string;
  reflection: string;
  strengthInsight: string;
  growthInsight: string;
}

export const CATEGORY_COPY: Record<CategoryId, CategoryCopy> = {
  communication: {
    strength: "You would rather say the thing than leave someone guessing.",
    reflection: "Saying what you need out loud beats hoping they work it out.",
    strengthInsight: "When something is off, people around you probably hear about it from you first.",
    growthInsight: "Next time you want to go quiet, try one honest sentence first.",
  },
  trust: {
    strength: "You can love someone without tracking their every move.",
    reflection: "Worth asking what would help you feel sure without needing to check.",
    strengthInsight: "You give people room and assume the best, which is rarer than it should be.",
    growthInsight: "Try asking for the reassurance you want instead of looking for proof.",
  },
  boundaries: {
    strength: "You treat a relationship as two whole people, not one shared calendar.",
    reflection: "Time apart can be a good sign. It does not have to mean drifting.",
    strengthInsight: "You protect your own time and you are happy for them to have theirs.",
    growthInsight: "Plan one thing this week that is just for you, and let them do the same.",
  },
  jealousy: {
    strength: "Their friends and their outfits are not a threat to you.",
    reflection: "Worth noticing when a rule is really about feeling left out.",
    strengthInsight: "You are secure enough to let someone have a life outside of you.",
    growthInsight: "When jealousy shows up, name the feeling before you make a rule about it.",
  },
  respect: {
    strength: "You let people be people, flaws and all.",
    reflection: "A little more patience for how other people do things goes a long way.",
    strengthInsight: "You are slow to judge, and people notice how easy that makes you to be around.",
    growthInsight: "Before you judge the choice, try asking how they got there.",
  },
  maturity: {
    strength: "You can disagree, make up, and actually let it go.",
    reflection: "A disagreement does not have to be won to be over.",
    strengthInsight: "You would rather fix the problem than win the argument.",
    growthInsight: "Pick one old grievance and officially retire it.",
  },
  commitment: {
    strength: "You know what you want and you are willing to say it.",
    reflection: "Saying what you want out loud is kinder than keeping it vague.",
    strengthInsight: "Nobody has to guess where they stand with you.",
    growthInsight: "Have the \"so what are we?\" talk before the other person has to ask.",
  },
  support: {
    strength: "You show up for people and you keep their world big.",
    reflection: "Worth checking that the effort is going both ways.",
    strengthInsight: "You are generous with your time, and you do not keep a tally of it.",
    growthInsight: "Ask what support looks like for them. It may not match your version.",
  },
};

/** Quotes a statement mid-sentence, where its own closing period would read oddly. */
function quote(text: string): string {
  return `“${text.replace(/\.$/, "")}”`;
}

function firstByQuestionId(answers: ScoredAnswer[]): ScoredAnswer | undefined {
  return [...answers].sort((a, b) => a.question.id - b.question.id)[0];
}

export function strengthExplanation(category: CategoryAnalytics): string {
  const constructive = category.answers.filter((answer) => answer.outcome === "constructive");
  const evidence = firstByQuestionId(constructive.filter((answer) => answer.question.nuance === "clear")) ?? firstByQuestionId(constructive);
  const copy = CATEGORY_COPY[category.id];
  if (!evidence) return copy.strength;

  const line = evidence.question.type === "red"
    ? `You saw ${quote(evidence.question.text)} and called it out.`
    : `You backed ${quote(evidence.question.text)}.`;
  return `${line} ${copy.strength}`;
}

/** Only clear-cut answers are quoted: a context-dependent preference is never presented as a problem. */
export function reflectionExplanation(category: CategoryAnalytics): string {
  const evidence = firstByQuestionId(category.answers.filter((answer) => answer.outcome === "reflect"));
  const copy = CATEGORY_COPY[category.id];
  if (!evidence) return copy.reflection;

  const line = evidence.question.type === "red"
    ? `You let ${quote(evidence.question.text)} slide.`
    : `You flagged ${quote(evidence.question.text)}, which this game reads as a good sign.`;
  return `${line} ${copy.reflection}`;
}

/** Stays truthful at every score: a 60% result is a Red Flag verdict with more green than red. */
export function verdictCommentary(overall: OverallResult): string {
  if (overall.answered === 0) return "No swipes, no verdict. Play a round and we'll talk.";

  switch (overall.tier) {
    case "HIGH":
      return "Suspiciously healthy. Nobody is this well adjusted, so let's check your work...";
    case "GOOD":
      return "Looks like you have more green flags than red ones. But there's more to discover...";
    case "AVERAGE":
      if (overall.greenPercent > 50) return "More green than red, but the red ones are loud. Let's find out where they live...";
      if (overall.greenPercent === 50) return "Perfectly split. Half green flag, half plot twist. Let's see which half is winning...";
      return "The red flags are ahead, but it's not over yet. Let's see what we're working with...";
    case "LOW":
      return "We've seen a lot of flags today. Most of them were yours. Let's talk about it...";
  }
}

export const NO_GREEN_FLAGS_MESSAGE = "No clear standouts this round. That's what round two is for.";
export const NO_RED_FLAGS_MESSAGE = "Nothing big to flag. Honestly, it's a little annoying.";
