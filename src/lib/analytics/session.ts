import { getQuestion } from "./questionBank";
import type { Flag, QuizAnswer } from "./types";

const STORAGE_KEY = "redflag_completed_round";

/**
 * Lets a refresh reopen the same report. Only card ids and swipes are kept, for
 * this session only, and the answer key is always re-read from the question bank.
 */
export function saveCompletedRound(answers: QuizAnswer[]) {
  try {
    const stored = answers.map(({ id, flag }) => ({ id, flag }));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Without storage the report still works; it just can't survive a refresh.
  }
}

export function loadCompletedRound(): QuizAnswer[] | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const stored: unknown = JSON.parse(raw);
    if (!Array.isArray(stored)) return null;

    const answers = stored.flatMap((entry: { id?: number; flag?: Flag }) => {
      const question = typeof entry?.id === "number" ? getQuestion(entry.id) : undefined;
      if (!question || (entry.flag !== "red" && entry.flag !== "green")) return [];
      return [{ id: question.id, flag: entry.flag, correctFlag: question.type }];
    });

    return answers.length > 0 ? answers : null;
  } catch {
    return null;
  }
}

export function clearCompletedRound() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing was saved if storage is unavailable.
  }
}
