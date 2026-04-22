import type { SentimentScore } from "./sentiment";

const HISTORY_KEY = "sa_history_v1";
const KEY_KEY = "sa_hf_key_v1";
const RATING_KEY = "sa_ratings_v1";

export interface HistoryEntry {
  id: string;
  text: string;
  platform: string;
  result: SentimentScore;
  timestamp: number;
}

export const getHistory = (): HistoryEntry[] => {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
};
export const saveHistory = (h: HistoryEntry[]) => localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
export const addHistory = (e: HistoryEntry) => {
  const h = [e, ...getHistory()].slice(0, 100);
  saveHistory(h);
  return h;
};
export const removeHistory = (id: string) => {
  const h = getHistory().filter(x => x.id !== id);
  saveHistory(h);
  return h;
};

export const getApiKey = () => localStorage.getItem(KEY_KEY) || "";
export const setApiKey = (k: string) => localStorage.setItem(KEY_KEY, k);

export interface Rating { stars: number; comment: string; timestamp: number }
export const getRatings = (): Rating[] => {
  try { return JSON.parse(localStorage.getItem(RATING_KEY) || "[]"); } catch { return []; }
};
export const addRating = (r: Rating) => {
  const list = [r, ...getRatings()];
  localStorage.setItem(RATING_KEY, JSON.stringify(list));
  return list;
};
