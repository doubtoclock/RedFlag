import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CATEGORY_COPY } from "../src/lib/analytics/copy";
import { MIN_ANSWERS_TO_RANK, buildAnalyticsReport } from "../src/lib/analytics/engine";
import { PERSONALITY_RULES } from "../src/lib/analytics/personalities";
import { CATEGORIES, QUESTION_BANK, getQuestion } from "../src/lib/analytics/questionBank";
import type { AnalyticsReport, CategoryId, Flag, Question, QuizAnswer } from "../src/lib/analytics/types";

const answer = (question: Question, flag: Flag): QuizAnswer => ({ id: question.id, flag, correctFlag: question.type });
const agree = (question: Question) => answer(question, question.type);
const disagree = (question: Question) => answer(question, question.type === "red" ? "green" : "red");

const inCategory = (id: CategoryId) => QUESTION_BANK.filter((question) => question.category === id);
const category = (report: AnalyticsReport, id: CategoryId) => report.categories.find((entry) => entry.id === id)!;

/** The formula QuizResults used before the engine existed, kept here as the regression oracle. */
function legacyResult(results: QuizAnswer[]) {
  const score = results.filter((result) => result.flag === result.correctFlag).length;
  const percentage = results.length > 0 ? Math.round((score / results.length) * 100) : 0;
  let tier = "LOW";
  if (percentage >= 90) tier = "HIGH";
  else if (percentage >= 70) tier = "GOOD";
  else if (percentage >= 40) tier = "AVERAGE";
  return { percentage, tier, isRedFlag: percentage < 70 };
}

function seededRandom(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function randomRound(random: () => number, pickFlag: (question: Question) => Flag) {
  const deck = [...QUESTION_BANK].sort(() => random() - 0.5).slice(0, 20);
  return deck.map((question) => answer(question, pickFlag(question)));
}

describe("question bank", () => {
  it("has 28 uniquely identified statements: 20 red and 8 green", () => {
    assert.equal(QUESTION_BANK.length, 28);
    assert.equal(new Set(QUESTION_BANK.map((question) => question.id)).size, 28);
    assert.equal(QUESTION_BANK.filter((question) => question.type === "red").length, 20);
    assert.equal(QUESTION_BANK.filter((question) => question.type === "green").length, 8);
  });

  it("gives every statement exactly one known category and copy for it", () => {
    const known = new Set(CATEGORIES.map(({ id }) => id));
    for (const question of QUESTION_BANK) {
      assert.ok(known.has(question.category), `question ${question.id}`);
      assert.ok(CATEGORY_COPY[question.category]);
    }
    for (const { id } of CATEGORIES) assert.ok(inCategory(id).length > 0, id);
  });

  it("treats the statements named as context-dependent as contextual", () => {
    for (const text of ["separate finances", "relationship status on social media", "low maintenance"]) {
      const question = QUESTION_BANK.find((entry) => entry.text.includes(text))!;
      assert.equal(question.nuance, "contextual", text);
      assert.equal(question.type, "red", "the game's own classification stays as it was");
    }
  });
});

describe("overall result", () => {
  it("matches the legacy score, tier and verdict across 2,000 random rounds", () => {
    const random = seededRandom(7);
    for (let round = 0; round < 2000; round++) {
      const results = randomRound(random, () => (random() < 0.5 ? "red" : "green"));
      const { overall } = buildAnalyticsReport(results);
      const legacy = legacyResult(results);
      assert.equal(overall.greenPercent, legacy.percentage);
      assert.equal(overall.tier, legacy.tier);
      assert.equal(overall.isRedFlag, legacy.isRedFlag);
      assert.equal(overall.greenPercent + overall.redPercent, 100);
    }
  });

  it("keeps the exact 40, 70 and 90 boundaries, including rounding", () => {
    const cases: [matched: number, total: number, percent: number, tier: string, isRedFlag: boolean][] = [
      [11, 28, 39, "LOW", true],
      [8, 20, 40, "AVERAGE", true],
      [9, 13, 69, "AVERAGE", true],
      [14, 20, 70, "GOOD", false],
      [8, 9, 89, "GOOD", false],
      [18, 20, 90, "HIGH", false],
      [20, 20, 100, "HIGH", false],
    ];

    for (const [matched, total, percent, tier, isRedFlag] of cases) {
      const results = QUESTION_BANK.slice(0, total).map((question, index) => (index < matched ? agree(question) : disagree(question)));
      const { overall } = buildAnalyticsReport(results);
      assert.deepEqual(
        { percent: overall.greenPercent, tier: overall.tier, isRedFlag: overall.isRedFlag },
        { percent, tier, isRedFlag },
      );
      assert.deepEqual(legacyResult(results), { percentage: percent, tier, isRedFlag });
    }
  });
});

describe("all answers agree or disagree with the game", () => {
  it("scores a perfect round at 100% everywhere with nothing to reflect on", () => {
    const report = buildAnalyticsReport(QUESTION_BANK.map(agree));
    assert.equal(report.overall.greenPercent, 100);
    for (const entry of report.categories) assert.equal(entry.percent, 100, entry.id);
    assert.equal(report.strongest.length, 3);
    assert.equal(report.weakest.length, 0);
    assert.equal(report.share.biggestRedFlag, null);
    assert.equal(report.personality.id, "green-flag-enthusiast");
  });

  it("scores a fully opposite round at 0% overall and never flags a context-only category", () => {
    const report = buildAnalyticsReport(QUESTION_BANK.map(disagree));
    assert.equal(report.overall.greenPercent, 0);
    assert.equal(report.overall.isRedFlag, true);
    assert.equal(report.strongest.length, 0);
    assert.equal(report.share.biggestGreenFlag, null);
    assert.equal(report.weakest.length, 3);
    assert.equal(category(report, "support").percent, 50);
    assert.ok(!report.weakest.some((entry) => entry.id === "support"));
  });

  it("swiping green on everything is judged per statement, not by direction", () => {
    const report = buildAnalyticsReport(QUESTION_BANK.map((question) => answer(question, "green")));
    assert.equal(report.overall.greenPercent, 29); // 8 of 28 cards are green
    assert.equal(category(report, "respect").reflectCount, 2);
    assert.equal(category(report, "boundaries").constructiveCount, 4);
    assert.equal(report.personality.id, "hopeless-romantic");
  });

  it("swiping red on everything is judged per statement too", () => {
    const report = buildAnalyticsReport(QUESTION_BANK.map((question) => answer(question, "red")));
    assert.equal(report.overall.greenPercent, 71); // 20 of 28 cards are red
    assert.equal(report.overall.isRedFlag, false);
    assert.equal(category(report, "respect").percent, 100);
    assert.equal(report.personality.id, "professional-skeptic");
  });
});

describe("category scoring", () => {
  it("uses each statement's own direction", () => {
    const [green] = inCategory("trust").filter((question) => question.type === "green");
    const red = inCategory("jealousy").find((question) => question.type === "red")!;

    assert.equal(category(buildAnalyticsReport([answer(green, "green")]), "trust").percent, 100);
    assert.equal(category(buildAnalyticsReport([answer(red, "green")]), "jealousy").percent, 0);
    assert.equal(category(buildAnalyticsReport([answer(red, "red")]), "jealousy").percent, 100);
  });

  it("gives a context-dependent disagreement neutral credit, not zero", () => {
    const finances = QUESTION_BANK.find((question) => question.id === 16)!;
    const entry = category(buildAnalyticsReport([disagree(finances)]), "commitment");
    assert.equal(entry.percent, 50);
    assert.equal(entry.band, "medium");
    assert.equal(entry.contextualCount, 1);
    assert.equal(entry.reflectCount, 0);
  });

  it("reports score, minimum and maximum for the answers actually given", () => {
    const report = buildAnalyticsReport(inCategory("commitment").map(disagree));
    const entry = category(report, "commitment");
    assert.deepEqual(
      { answered: entry.answered, score: entry.score, min: entry.minScore, max: entry.maxScore },
      { answered: 3, score: 2, min: 2, max: 6 },
    );
    assert.equal(entry.percent, 33);
  });

  it("handles categories of different sizes", () => {
    const report = buildAnalyticsReport(QUESTION_BANK.map(agree));
    assert.deepEqual(
      report.categories.map((entry) => [entry.id, entry.questionsInBank]),
      [["communication", 3], ["trust", 3], ["boundaries", 5], ["jealousy", 4], ["respect", 3], ["maturity", 5], ["commitment", 3], ["support", 2]],
    );
    for (const entry of report.categories) assert.equal(entry.maxScore, entry.answered * 2);
  });

  it("stays within bounds for every category across random rounds", () => {
    const random = seededRandom(11);
    for (let round = 0; round < 500; round++) {
      const report = buildAnalyticsReport(randomRound(random, () => (random() < 0.5 ? "red" : "green")));
      for (const entry of report.categories) {
        if (entry.answered === 0) continue;
        assert.ok(entry.score >= entry.minScore && entry.score <= entry.maxScore);
        assert.ok(entry.percent! >= 0 && entry.percent! <= 100);
      }
    }
  });
});

describe("empty, missing and malformed answers", () => {
  it("does not invent scores for an empty round", () => {
    const report = buildAnalyticsReport([]);
    assert.equal(report.overall.answered, 0);
    assert.equal(report.overall.greenPercent, 0);
    assert.equal(report.overall.redPercent, 0);
    assert.equal(report.personality.id, "plot-twist");
    assert.equal(report.personality.insights.length, 2);
    assert.equal(report.strongest.length + report.weakest.length, 0);
    for (const entry of report.categories) {
      assert.equal(entry.percent, null);
      assert.equal(entry.band, null);
    }
  });

  it("leaves unanswered categories out instead of scoring them as negative", () => {
    const report = buildAnalyticsReport(inCategory("boundaries").map(agree));
    assert.equal(category(report, "boundaries").percent, 100);
    for (const entry of report.categories.filter((item) => item.id !== "boundaries")) {
      assert.equal(entry.answered, 0);
      assert.equal(entry.percent, null);
    }
    assert.equal(report.overall.greenPercent, 100);
  });

  it("ignores unknown ids, bad flags and null entries, and keeps the latest repeat", () => {
    const [first, second] = QUESTION_BANK;
    const messy = [
      null,
      { id: 999, flag: "red", correctFlag: "red" },
      { id: first.id, flag: "purple", correctFlag: first.type },
      disagree(second),
      agree(second),
    ] as unknown as QuizAnswer[];

    const report = buildAnalyticsReport(messy);
    assert.equal(report.overall.answered, 1);
    assert.equal(report.overall.greenPercent, 100);
  });

  it("does not rank a category on a single answer", () => {
    const report = buildAnalyticsReport([agree(inCategory("trust")[0]), disagree(inCategory("jealousy")[0])]);
    assert.ok(MIN_ANSWERS_TO_RANK > 1);
    assert.equal(category(report, "trust").percent, 100);
    assert.equal(category(report, "trust").rankable, false);
    assert.equal(report.strongest.length + report.weakest.length, 0);
  });
});

describe("strongest and weakest categories", () => {
  it("is ordered, disjoint, limited to three, and only uses rankable categories", () => {
    const random = seededRandom(23);
    for (let round = 0; round < 1000; round++) {
      const lean = random();
      const report = buildAnalyticsReport(randomRound(random, (question) => (random() < lean ? question.type : question.type === "red" ? "green" : "red")));
      const strong = report.strongest.map((entry) => entry.percent);
      const weak = report.weakest.map((entry) => entry.percent);

      assert.ok(report.strongest.length <= 3 && report.weakest.length <= 3);
      assert.deepEqual(strong, [...strong].sort((a, b) => b - a));
      assert.deepEqual(weak, [...weak].sort((a, b) => a - b));

      const ids = [...report.strongest, ...report.weakest].map((entry) => entry.id);
      assert.equal(new Set(ids).size, ids.length);

      for (const highlight of [...report.strongest, ...report.weakest]) {
        const entry = category(report, highlight.id);
        assert.ok(entry.rankable);
        assert.equal(entry.percent, highlight.percent);
      }
      for (const highlight of report.weakest) assert.ok(category(report, highlight.id).reflectCount > 0);
    }
  });

  it("quotes the player's own card in the explanation", () => {
    const report = buildAnalyticsReport(QUESTION_BANK.map(disagree));
    const worst = report.weakest[0];
    const quoted = category(report, worst.id).answers.filter((entry) => entry.outcome === "reflect");
    assert.ok(quoted.some((entry) => worst.explanation.includes(entry.question.text.replace(/\.$/, ""))));
  });

  it("never quotes a context-dependent statement as a concern", () => {
    const random = seededRandom(31);
    const contextual = QUESTION_BANK.filter((question) => question.nuance === "contextual");
    for (let round = 0; round < 500; round++) {
      const report = buildAnalyticsReport(randomRound(random, () => (random() < 0.5 ? "red" : "green")));
      for (const highlight of report.weakest) {
        for (const question of contextual) {
          assert.ok(!highlight.explanation.includes(question.text.replace(/\.$/, "")), question.text);
        }
      }
    }
  });

  it("is deterministic: the same answers in any order give the same report", () => {
    const results = QUESTION_BANK.slice(0, 20).map((question, index) => (index % 3 === 0 ? disagree(question) : agree(question)));
    // A category's raw answer list follows swipe order; everything derived from it must not.
    const summarize = (report: AnalyticsReport) => JSON.stringify(report, (key, value) => (key === "answers" ? undefined : value));
    assert.equal(summarize(buildAnalyticsReport(results)), summarize(buildAnalyticsReport([...results].reverse())));
  });
});

describe("personalities", () => {
  it("defines 8 to 12 unique types and always assigns one", () => {
    assert.ok(PERSONALITY_RULES.length >= 8 && PERSONALITY_RULES.length <= 12);
    assert.equal(new Set(PERSONALITY_RULES.map((rule) => rule.title)).size, PERSONALITY_RULES.length);

    const random = seededRandom(41);
    for (let round = 0; round < 500; round++) {
      const { personality } = buildAnalyticsReport(randomRound(random, () => (random() < random() ? "red" : "green")));
      assert.ok(personality.title && personality.description && personality.emoji);
      assert.ok(personality.insights.length >= 2 && personality.insights.length <= 3);
    }
  });

  it("can reach every type from real swipes", () => {
    const random = seededRandom(53);
    const seen = new Set<string>([buildAnalyticsReport([]).personality.id]);

    for (let round = 0; round < 60000; round++) {
      const accuracy = random();
      const weakSpot = CATEGORIES[Math.floor(random() * CATEGORIES.length)].id;
      const strongSpot = CATEGORIES[Math.floor(random() * CATEGORIES.length)].id;
      const report = buildAnalyticsReport(randomRound(random, (question) => {
        const chance = question.category === weakSpot ? 0.15 : question.category === strongSpot ? 0.98 : accuracy;
        return random() < chance ? question.type : question.type === "red" ? "green" : "red";
      }));
      seen.add(report.personality.id);
    }

    assert.deepEqual([...seen].sort(), PERSONALITY_RULES.map((rule) => rule.id).sort());
  });

  it("does not hand a flattering type to a poor overall score", () => {
    const positive = new Set(["independent-romantic", "talk-it-out-legend", "supportive-romantic"]);
    const random = seededRandom(61);
    for (let round = 0; round < 2000; round++) {
      const accuracy = random();
      const report = buildAnalyticsReport(randomRound(random, (question) => (random() < accuracy ? question.type : question.type === "red" ? "green" : "red")));
      if (positive.has(report.personality.id)) assert.ok(report.overall.greenPercent >= 50);
    }
  });

  it("states pattern numbers that match the answers", () => {
    const random = seededRandom(71);
    for (let round = 0; round < 200; round++) {
      const results = randomRound(random, () => (random() < 0.5 ? "red" : "green"));
      const { pattern } = buildAnalyticsReport(results);
      const reds = results.filter((result) => getQuestion(result.id)!.type === "red");
      assert.equal(pattern.redStatements, reds.length);
      assert.equal(pattern.redStatementsFlagged, reds.filter((result) => result.flag === "red").length);
      assert.equal(pattern.answered, results.length);
    }
  });
});

describe("report consistency", () => {
  it("feeds the share summary from the same report object", () => {
    const report = buildAnalyticsReport(QUESTION_BANK.slice(0, 20).map((question, index) => (index % 4 === 0 ? disagree(question) : agree(question))));
    assert.equal(report.share.greenPercent, report.overall.greenPercent);
    assert.equal(report.share.isRedFlag, report.overall.isRedFlag);
    assert.equal(report.share.personalityTitle, report.personality.title);
    assert.equal(report.share.biggestGreenFlag, report.strongest[0]?.name ?? null);
    assert.equal(report.share.biggestRedFlag, report.weakest[0]?.name ?? null);
  });

  it("never claims more green than red when that isn't true", () => {
    const random = seededRandom(83);
    for (let round = 0; round < 2000; round++) {
      const accuracy = random();
      const { commentary, overall } = buildAnalyticsReport(randomRound(random, (question) => (random() < accuracy ? question.type : question.type === "red" ? "green" : "red")));
      if (/more green/i.test(commentary)) assert.ok(overall.greenPercent > overall.redPercent);
    }
  });

  it("stays free of clinical or insulting language", () => {
    const banned = /\b(toxic|narciss|manipulat|gaslight|disorder|attachment|anxious|anxiety|trauma|abus|stonewall|insecure|pathetic|stupid)\w*/i;
    const copy = [
      ...Object.values(CATEGORY_COPY).flatMap((entry) => Object.values(entry)),
      ...PERSONALITY_RULES.flatMap((rule) => [rule.title, rule.description, rule.tip]),
    ];
    for (const line of copy) assert.ok(!banned.test(line), line);
  });
});
