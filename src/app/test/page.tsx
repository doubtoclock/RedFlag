"use client";

import { SwipeQuiz } from "@/components/quiz/SwipeQuiz";

const questions = [
  // Green flags
  { id: 1, type: "green" as const, image: "/questions/green%20flag/1.jpeg", text: "I like my own space and my me time.", subtext: "Everyone needs time for themselves. It's healthy, not a red flag." },
  { id: 2, type: "green" as const, image: "/questions/green%20flag/2.jpeg", text: "I do not need to know your location at all times. You're not a missing child.", subtext: "Trust is key. Constant updates breed anxiety." },
  { id: 3, type: "green" as const, image: "/questions/green%20flag/3.jpeg", text: "I don't want us to spend 24 hours together.", subtext: "Independence keeps the spark alive." },
  { id: 4, type: "green" as const, image: "/questions/green%20flag/4.jpeg", text: "I don't care if you find other people attractive.", subtext: "Acknowledging beauty isn't a threat to the relationship." },
  { id: 5, type: "green" as const, image: "/questions/green%20flag/5.jpeg", text: "I don't need you to agree with me on every argument. I'd be concerned if you did.", subtext: "Debates show we both have our own minds." },
  { id: 6, type: "green" as const, image: "/questions/green%20flag/6.jpeg", text: "I don't need your phone password.", subtext: "Privacy is a fundamental right, even in love." },
  { id: 7, type: "green" as const, image: "/questions/green%20flag/7.jpeg", text: "I actually like it when my partner goes for a trip without me.", subtext: "Distance makes the heart grow fonder." },
  { id: 8, type: "green" as const, image: "/questions/green%20flag/8.jpeg", text: "You don't need to ask me before making a plan.", subtext: "We are partners, not parents." },
  
  // Red flags
  { id: 9, type: "red" as const, image: "/questions/red%20flag/1.jpeg", text: "I don’t want to put a label on us but i think you shouldn’t see other people", subtext: "Demanding loyalty while avoiding commitment is a major trap." },
  { id: 10, type: "red" as const, image: "/questions/red%20flag/2.jpeg", text: "I won’t be the first to apologise", subtext: "Refusing to apologize shows a severe lack of accountability." },
  { id: 11, type: "red" as const, image: "/questions/red%20flag/3.jpeg", text: "I like to keep them thinking", subtext: "Mind games aren't cute; they're manipulative." },
  { id: 12, type: "red" as const, image: "/questions/red%20flag/4.jpeg", text: "I don’t respect people who forgive so easily", subtext: "Holding grudges usually means they're looking for control." },
  { id: 13, type: "red" as const, image: "/questions/red%20flag/5.jpeg", text: "I cannot date ugly people", subtext: "Superficial standards often hide deep insecurities." },
  { id: 14, type: "red" as const, image: "/questions/red%20flag/6.jpeg", text: "I prefer my partner to be low maintenance", subtext: "Translation: 'I don't want to put any effort in.'" },
  { id: 15, type: "red" as const, image: "/questions/red%20flag/7.jpeg", text: "My partner can have friends of the opposite gender but should tell me everything they do with them real time", subtext: "This level of monitoring is exhausting, not protective." },
  { id: 16, type: "red" as const, image: "/questions/red%20flag/8.jpeg", text: "Couples should have separate finances", subtext: "Rigid separation can sometimes indicate a lack of long-term trust." },
  { id: 17, type: "red" as const, image: "/questions/red%20flag/9.jpeg", text: "I don’t want to post our relationship status on social media", subtext: "Hiding a relationship often means keeping options open." },
  { id: 18, type: "red" as const, image: "/questions/red%20flag/10.jpeg", text: "I don’t want to date people who have way too many friends", subtext: "Isolating you from a healthy social life is classic manipulation." },
  { id: 19, type: "red" as const, image: "/questions/red%20flag/11.jpeg", text: "My partner can wear whatever they want. I’d just prefer they dress in a way that doesn’t attract attention", subtext: "Dictating someone's wardrobe is textbook controlling behavior." },
  { id: 20, type: "red" as const, image: "/questions/red%20flag/12.jpeg", text: "I’m not controlling. I’m just particular about certain things.", subtext: "A polite way of saying 'My way or the highway.'" },
  { id: 21, type: "red" as const, image: "/questions/red%20flag/13.jpeg", text: "I just want people near me to have basic common sense about everything", subtext: "'Common sense' is often just an excuse to be condescending." },
  { id: 22, type: "red" as const, image: "/questions/red%20flag/14.jpeg", text: "I don’t argue. I just withdraw if something bothers me", subtext: "Stonewalling prevents any real issues from getting solved." },
  { id: 23, type: "red" as const, image: "/questions/red%20flag/15.jpeg", text: "I’m just straightforward and honest.", subtext: "'Brutally honest' usually means more brutal than honest." },
  { id: 24, type: "red" as const, image: "/questions/red%20flag/16.jpeg", text: "I’m not possessive. I just have a good memory", subtext: "Keeping score of past mistakes isn't a superpower, it's toxic." },
  { id: 25, type: "red" as const, image: "/questions/red%20flag/17.jpeg", text: "I don’t like a lot of disagreement between us.", subtext: "Healthy relationships require safe spaces for disagreement." },
  { id: 26, type: "red" as const, image: "/questions/red%20flag/18.jpeg", text: "I like it when my partner prioritises me over their friends", subtext: "Demanding constant priority can lead to isolation." },
  { id: 27, type: "red" as const, image: "/questions/red%20flag/19.jpeg", text: "I think a little mystery is important for any relationship.", subtext: "Mystery is for novels, not healthy communication." },
  { id: 28, type: "red" as const, image: "/questions/red%20flag/20.jpeg", text: "I may not remember birthdays but I’ll remember that thing you said at a party 5 years ago", subtext: "Using the past as ammo instead of celebrating the present." },
];

export default function TestPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-[100dvh] w-full flex justify-center">
      <div className="relative min-h-[100dvh] w-full max-w-[430px] overflow-hidden flex flex-col pt-12 pb-8 px-6 shadow-2xl shadow-black/50 border-x border-white/5 bg-black">
        <SwipeQuiz questions={questions} />
      </div>
    </div>
  );
}
