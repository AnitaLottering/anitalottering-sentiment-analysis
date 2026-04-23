import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Analyzer } from "@/components/Analyzer";
import { PromptLibrary } from "@/components/PromptLibrary";
import { Rating } from "@/components/Rating";
import { Chatbot } from "@/components/Chatbot";
import { getHistory, type HistoryEntry } from "@/lib/storage";

const Index = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
    document.title = "Social Media Analysis — AI Sentiment Insights";
    const meta = document.querySelector('meta[name="description"]');
    const desc = "Analyze sentiment of social media posts from Twitter, Instagram, Facebook, LinkedIn and TikTok with AI-powered insights and beautiful charts.";
    if (meta) meta.setAttribute("content", desc);
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = desc;
      document.head.appendChild(m);
    }
  }, []);

  const handleRerun = (text: string, _platform: string) => {
    const ta = document.querySelector<HTMLTextAreaElement>("#analyze textarea");
    if (ta) {
      ta.focus();
      ta.value = text;
      ta.dispatchEvent(new Event("input", { bubbles: true }));
    }
    document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Analyzer history={history} onHistoryChange={setHistory} />
        <PromptLibrary history={history} onChange={setHistory} onRerun={handleRerun} />
        <Rating />
      </main>
      <footer className="py-10 border-t border-border text-center text-sm text-muted-foreground">
        <div className="container">
          Built with ❤️ · Powered by Hugging Face · Your data stays in your browser
        </div>
      </footer>
      <Chatbot history={history} />
    </div>
  );
};

export default Index;
