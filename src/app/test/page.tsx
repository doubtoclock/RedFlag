"use client";

import { SwipeQuiz } from "@/components/quiz/SwipeQuiz";
import { QUESTION_BANK } from "@/lib/analytics/questionBank";

export default function TestPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-[100dvh] w-full flex justify-center">
      <div className="relative min-h-[100dvh] w-full max-w-[430px] overflow-hidden flex flex-col px-6 [padding-top:var(--app-top-inset)] [padding-bottom:var(--app-bottom-inset)] shadow-2xl shadow-black/50 bg-black">
        <SwipeQuiz questions={QUESTION_BANK} />
      </div>
    </div>
  );
}
