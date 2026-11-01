export type RelationshipStatus = "SINGLE" | "TALKING" | "DATING" | "IN A RELATIONSHIP" | "IT'S COMPLICATED";

export const MESSAGES: Record<
  RelationshipStatus,
  Record<"HIGH" | "GOOD" | "AVERAGE" | "LOW", { expertTitle: string; result: string; share: string }>
> = {
  "SINGLE": {
    "HIGH": { expertTitle: "FLAG EXPERT", result: "Wow… you're actually TOO good at this. How are you still single? 😭💚", share: "\"Send this to your crush. Maybe today is finally your day 👀\"" },
    "GOOD": { expertTitle: "GREEN FLAG", result: "Okayyy, you know your red flags… now you just need someone to test them on. 👀", share: "\"Share this with your friends and let them explain why you're still single 😂\"" },
    "AVERAGE": { expertTitle: "RED FLAG ENERGY", result: "You can identify red flags… but you probably date them anyway. 💀🚩", share: "\"Send this to your single friends. Someone needs to learn 😂\"" },
    "LOW": { expertTitle: "RED FLAG ALERT", result: "No wonder you're still single. You'd probably call a red flag ‘interesting personality.’ 🚩😭", share: "\"Share this with your friends. Maybe they can save your dating life 😂\"" }
  },
  "TALKING": {
    "HIGH": { expertTitle: "FLAG EXPERT", result: "You’re not just talking… you actually know what you're doing. 👀💚", share: "\"Send this to the person you're talking to. Let’s see if they agree 👀\"" },
    "GOOD": { expertTitle: "GREEN FLAG", result: "The talking stage is looking promising… just don't ignore the red flags now. 😭", share: "\"Share this with them and see what they score 👀\"" },
    "AVERAGE": { expertTitle: "RED FLAG ENERGY", result: "You two are talking… but your red flag is definitely showing. 💀🚩", share: "\"Send this to the person you're talking to. Time for a reality check 😂\"" },
    "LOW": { expertTitle: "RED FLAG ALERT", result: "Bro… you're one ‘it's just their personality’ away from disaster. 🚩💀", share: "\"Send this to your talking stage before it's too late 😭\"" }
  },
  "DATING": {
    "HIGH": { expertTitle: "FLAG EXPERT", result: "Okay, you're actually relationship material. Your date picked well. 💚👀", share: "\"Send this to your partner. They deserve to know they picked a Green Flag 💚\"" },
    "GOOD": { expertTitle: "GREEN FLAG", result: "Not bad… your relationship has more Green Flags than questionable decisions. 😂💚", share: "\"Share this with your date and see if they get the same score 👀\"" },
    "AVERAGE": { expertTitle: "RED FLAG ENERGY", result: "You're doing okay… but your red flags are starting to show. 😭🚩", share: "\"Send this to your date. Let them judge your score 😂\"" },
    "LOW": { expertTitle: "RED FLAG ALERT", result: "We need to talk about your dating choices… because the red flags are basically waving at you. 🚩💀", share: "\"Send this to your date. Let's see if they still want to go on another one 😂\"" }
  },
  "IN A RELATIONSHIP": {
    "HIGH": { expertTitle: "FLAG EXPERT", result: "Your partner is seriously lucky. You’re basically a walking Green Flag. 💚🏆", share: "\"Send this to your partner so they know how lucky they are 👀❤️\"" },
    "GOOD": { expertTitle: "GREEN FLAG", result: "Okay, we approve. Your partner made a pretty good choice. 💚😂", share: "\"Share this with your partner. They need some appreciation today ❤️\"" },
    "AVERAGE": { expertTitle: "RED FLAG ENERGY", result: "You're a Red Flag… with a few good intentions. 😭🚩", share: "\"Send this to your partner and let them decide if they agree 😂\"" },
    "LOW": { expertTitle: "RED FLAG ALERT", result: "Your partner deserves a medal for surviving your red flags. 💀🚩", share: "\"Share this with your partner. They deserve to know what they're dealing with 😭\"" }
  },
  "IT'S COMPLICATED": {
    "HIGH": { expertTitle: "FLAG EXPERT", result: "It's complicated… but at least YOU aren't the complicated one. 💚😭", share: "\"Send this to the person who makes your relationship complicated 👀\"" },
    "GOOD": { expertTitle: "GREEN FLAG", result: "Your relationship status is complicated, but your Green Flag detection isn't. Respect. 💚", share: "\"Share this with them and maybe finally figure out what's going on 😂\"" },
    "AVERAGE": { expertTitle: "RED FLAG ENERGY", result: "Yeah… your red flags explain why it's complicated. 💀🚩", share: "\"Send this to the person you're ‘complicated’ with 😂\"" },
    "LOW": { expertTitle: "RED FLAG ALERT", result: "It's complicated because apparently neither of you knows what a red flag looks like. 🚩💀", share: "\"Share this with them. Maybe this game can fix what your communication couldn't 😭\"" }
  }
};

export function getRelationshipMessage(
  relStatus: RelationshipStatus,
  scoreTier: "HIGH" | "GOOD" | "AVERAGE" | "LOW",
  percentage: number
) {
  const messageData = MESSAGES[relStatus]?.[scoreTier] ?? MESSAGES["SINGLE"][scoreTier];

  let personalityTitle = "FLAG EXPERT";
  if (percentage >= 90) personalityTitle = "FLAG EXPERT";
  else if (percentage >= 70) personalityTitle = "PRETTY AWARE";
  else if (percentage >= 40) personalityTitle = "RED FLAG ENERGY";
  else personalityTitle = "WE NEED TO TALK";

  const rawMsg = messageData.result;
  let mainPart = rawMsg;
  let subPart = "";

  if (rawMsg.includes(". ")) {
    const parts = rawMsg.split(". ");
    subPart = parts.pop() || "";
    mainPart = parts.join(". ") + ".";
  } else if (rawMsg.includes("? ")) {
    const parts = rawMsg.split("? ");
    subPart = parts.pop() || "";
    mainPart = parts.join("? ") + "?";
  } else if (rawMsg.includes("… ")) {
    const parts = rawMsg.split("… ");
    subPart = parts.pop() || "";
    mainPart = parts.join("… ") + "…";
  }

  const words = mainPart.split(" ");
  const lastTwoWords = words.length > 2 ? words.splice(-2).join(" ") : "";
  const firstWords = words.length > 2 ? words.join(" ") : mainPart;

  return {
    pillText: `YOU'RE ${relStatus}`,
    expertTitle: personalityTitle,
    firstWords,
    lastTwoWords,
    subPart,
    quote: messageData.share,
  };
}
