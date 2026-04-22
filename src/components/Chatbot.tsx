import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { HistoryEntry } from "@/lib/storage";

interface Msg { role: "user" | "bot"; text: string }

const QUICK = [
  "What does my latest result mean?",
  "How can I improve my tone?",
  "How does this tool work?",
];

const generateReply = (q: string, history: HistoryEntry[]): string => {
  const lower = q.toLowerCase();
  const last = history[0];

  if (/how|work|use|tool|what is/.test(lower)) {
    return "I help you analyze the sentiment of social media text using AI. Just paste your text in the Analyze section, pick a platform, and click Analyze. You'll see positive/negative/neutral confidence scores and trend charts. Need an API key? Get one free at huggingface.co/settings/tokens.";
  }
  if (/improve|better|tone|suggest|tip/.test(lower)) {
    if (last?.result.label === "negative") {
      return "Your last post leaned negative. Try: (1) replacing absolute words ('always', 'never') with softer phrasing, (2) leading with what you appreciate before raising concerns, (3) ending with a constructive call to action. Positive framing boosts engagement by ~30%.";
    }
    if (last?.result.label === "neutral") {
      return "Your last post was neutral. To increase engagement: (1) add a personal anecdote or emotion word, (2) ask a question to invite replies, (3) use vivid verbs instead of 'is/was', (4) include a clear CTA.";
    }
    return "Great content tips: lead with emotion, keep sentences under 20 words, use specific numbers, and end with a question or CTA. Posts with positive sentiment typically get 2x more shares.";
  }
  if (/result|mean|score|sentiment|last|latest/.test(lower)) {
    if (!last) return "You haven't analyzed any text yet. Head to the Analyze section and paste some content first!";
    const pct = (n: number) => `${(n * 100).toFixed(0)}%`;
    return `Your latest analysis on ${last.platform} came back as **${last.result.label}** with ${pct(last.result.score)} confidence. Breakdown: positive ${pct(last.result.positive)}, neutral ${pct(last.result.neutral)}, negative ${pct(last.result.negative)}. ${last.result.label === "positive" ? "Nice — your audience will likely respond well!" : last.result.label === "negative" ? "Consider rewording for a warmer tone." : "Adding emotion or a question could boost engagement."}`;
  }
  if (/api|key|hugging/.test(lower)) {
    return "You need a free Hugging Face API key. Visit huggingface.co/settings/tokens, create a 'Read' token, and paste it into the API key field in the Analyze section. It's stored only in your browser.";
  }
  if (/hi|hello|hey/.test(lower)) {
    return "Hey there! 👋 I'm your sentiment assistant. Ask me about your results, tone tips, or how the tool works.";
  }
  return "I can help with: understanding your sentiment results, suggesting tone improvements, or explaining how the tool works. What would you like to know?";
};

export const Chatbot = ({ history }: { history: HistoryEntry[] }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hi! I'm your sentiment assistant. Ask me anything about your results or how to improve your content." },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs(m => [...m, { role: "user", text: t }]);
    setInput("");
    setTimeout(() => {
      setMsgs(m => [...m, { role: "bot", text: generateReply(t, history) }]);
    }, 400);
  };

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-hero shadow-glow flex items-center justify-center text-primary-foreground hover:scale-110 transition-smooth animate-pulse-glow"
        aria-label="Open chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[520px] bg-card border border-border rounded-2xl shadow-elegant flex flex-col overflow-hidden animate-fade-in-up">
          <div className="p-4 bg-gradient-hero text-primary-foreground flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold">Sentiment Assistant</div>
              <div className="text-xs opacity-90">Online · ready to help</div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-hero text-primary-foreground rounded-br-sm"
                    : "bg-secondary text-foreground rounded-bl-sm"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {msgs.length <= 1 && (
              <div className="pt-2 space-y-1.5">
                {QUICK.map(q => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="block w-full text-left px-3 py-2 text-xs rounded-lg bg-secondary/50 hover:bg-secondary border border-border transition-smooth"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="p-3 border-t border-border flex gap-2"
          >
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1"
            />
            <Button type="submit" size="icon" className="bg-gradient-hero hover:opacity-90 shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};
