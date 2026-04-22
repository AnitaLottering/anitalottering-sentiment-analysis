export type SentimentLabel = "positive" | "negative" | "neutral";

export interface SentimentScore {
  label: SentimentLabel;
  score: number;
  positive: number;
  negative: number;
  neutral: number;
}

const HF_MODEL = "cardiffnlp/twitter-roberta-base-sentiment-latest";

const LABEL_MAP: Record<string, SentimentLabel> = {
  positive: "positive",
  negative: "negative",
  neutral: "neutral",
  LABEL_0: "negative",
  LABEL_1: "neutral",
  LABEL_2: "positive",
};

export async function analyzeSentiment(text: string, apiKey: string): Promise<SentimentScore> {
  if (!apiKey) throw new Error("Hugging Face API key is required");
  const res = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`HF API error (${res.status}): ${msg.slice(0, 200)}`);
  }
  const data = await res.json();
  const arr: Array<{ label: string; score: number }> = Array.isArray(data?.[0]) ? data[0] : data;
  const scores = { positive: 0, negative: 0, neutral: 0 };
  for (const item of arr) {
    const key = LABEL_MAP[item.label] || LABEL_MAP[item.label?.toLowerCase()] || "neutral";
    scores[key] = item.score;
  }
  const top = (Object.entries(scores) as Array<[SentimentLabel, number]>).sort((a, b) => b[1] - a[1])[0];
  return { label: top[0], score: top[1], ...scores };
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
