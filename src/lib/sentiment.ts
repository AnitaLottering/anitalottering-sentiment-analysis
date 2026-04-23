export type SentimentLabel = "positive" | "negative" | "neutral";

export interface SentimentScore {
  label: SentimentLabel;
  score: number;
  positive: number;
  negative: number;
  neutral: number;
}

// Lightweight lexicon-based sentiment analyzer (no external API required)
const POSITIVE_WORDS = [
  "good", "great", "awesome", "amazing", "love", "loved", "loving", "excellent",
  "fantastic", "wonderful", "best", "perfect", "happy", "delighted", "brilliant",
  "incredible", "outstanding", "superb", "enjoy", "enjoyed", "fabulous", "nice",
  "beautiful", "cool", "win", "winning", "success", "successful", "thanks",
  "thank", "appreciate", "recommend", "favorite", "fun", "exciting", "inspiring",
  "helpful", "kind", "smile", "celebrate", "yay", "wow", "epic", "stunning",
  "smart", "cute", "lovely", "glad", "pleased", "proud", "blessed", "joy",
];

const NEGATIVE_WORDS = [
  "bad", "terrible", "awful", "worst", "hate", "hated", "horrible", "poor",
  "disappointing", "disappointed", "sad", "angry", "annoying", "annoyed",
  "frustrated", "frustrating", "useless", "broken", "fail", "failed", "failure",
  "ugly", "boring", "stupid", "dumb", "trash", "garbage", "waste", "wasted",
  "sucks", "suck", "lame", "wrong", "problem", "issue", "bug", "crash",
  "slow", "expensive", "cheap", "fake", "scam", "lie", "lies", "liar",
  "regret", "sorry", "miserable", "pain", "painful", "rude", "mean", "cry",
  "crying", "depressed", "unhappy", "worse", "nightmare", "disaster",
];

const INTENSIFIERS = ["very", "really", "so", "extremely", "absolutely", "totally", "super"];
const NEGATIONS = ["not", "no", "never", "none", "nothing", "neither", "nor", "cant", "cannot", "dont", "doesnt", "didnt", "wont", "isnt", "arent"];

const tokenize = (text: string): string[] =>
  text.toLowerCase().replace(/[^a-z0-9'\s!?]/g, " ").split(/\s+/).filter(Boolean);

export async function analyzeSentiment(text: string): Promise<SentimentScore> {
  // Simulate light async work for nice loading UX
  await new Promise((r) => setTimeout(r, 350));

  const tokens = tokenize(text);
  let pos = 0;
  let neg = 0;

  for (let i = 0; i < tokens.length; i++) {
    const word = tokens[i].replace(/[!?']/g, "");
    const prev = tokens[i - 1] || "";
    const prev2 = tokens[i - 2] || "";
    const intensifier = INTENSIFIERS.includes(prev) || INTENSIFIERS.includes(prev2) ? 1.5 : 1;
    const negated = NEGATIONS.includes(prev) || NEGATIONS.includes(prev2);

    if (POSITIVE_WORDS.includes(word)) {
      if (negated) neg += 1 * intensifier;
      else pos += 1 * intensifier;
    } else if (NEGATIVE_WORDS.includes(word)) {
      if (negated) pos += 1 * intensifier;
      else neg += 1 * intensifier;
    }
  }

  // Punctuation emphasis
  const exclam = (text.match(/!/g) || []).length;
  if (exclam > 0 && pos > neg) pos += exclam * 0.3;
  if (exclam > 0 && neg > pos) neg += exclam * 0.3;

  // Emoji hints
  if (/[😀😁😂🤣😊😍🥰😘👍❤️🎉✨🔥]/u.test(text)) pos += 1.5;
  if (/[😞😢😭😡🤬👎💔😤😩]/u.test(text)) neg += 1.5;

  const total = pos + neg;
  let positive: number;
  let negative: number;
  let neutral: number;

  if (total === 0) {
    positive = 0.15;
    negative = 0.15;
    neutral = 0.7;
  } else {
    // Map raw counts to soft probabilities with a neutral baseline
    const strength = Math.min(1, total / Math.max(4, tokens.length / 3));
    const rawPos = pos / total;
    const rawNeg = neg / total;
    positive = +(rawPos * strength).toFixed(4);
    negative = +(rawNeg * strength).toFixed(4);
    neutral = +(1 - positive - negative).toFixed(4);
    if (neutral < 0) neutral = 0;
  }

  // Normalize to sum 1
  const sum = positive + negative + neutral || 1;
  positive = +(positive / sum).toFixed(4);
  negative = +(negative / sum).toFixed(4);
  neutral = +(neutral / sum).toFixed(4);

  const entries: Array<[SentimentLabel, number]> = [
    ["positive", positive],
    ["negative", negative],
    ["neutral", neutral],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  const [label, score] = entries[0];

  return { label, score, positive, negative, neutral };
}

export function explainSentiment(s: SentimentScore, text: string): string {
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
  const sample = text.length > 80 ? text.slice(0, 80) + "…" : text;
  if (s.label === "positive") {
    return `The text "${sample}" expresses a positive tone (${pct(s.positive)} confidence). It likely conveys appreciation, enthusiasm, or satisfaction. Great for engagement!`;
  }
  if (s.label === "negative") {
    return `The text "${sample}" carries a negative tone (${pct(s.negative)} confidence). Consider rephrasing to soften criticism or focus on solutions for better reception.`;
  }
  return `The text "${sample}" reads as neutral (${pct(s.neutral)} confidence). It is informative but lacks strong emotional cues — adding warmth or specifics could boost engagement.`;
}
