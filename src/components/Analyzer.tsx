import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, Sparkles, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { analyzeSentiment, explainSentiment, type SentimentScore } from "@/lib/sentiment";
import { addHistory, type HistoryEntry } from "@/lib/storage";
import { SentimentCharts } from "./SentimentCharts";

const PLATFORMS = ["Twitter/X", "Instagram", "Facebook", "LinkedIn", "TikTok", "Other"];

const labelStyles: Record<string, string> = {
  positive: "bg-positive/10 text-positive border-positive/30",
  negative: "bg-negative/10 text-negative border-negative/30",
  neutral: "bg-neutral/10 text-neutral border-neutral/30",
};

interface Props {
  history: HistoryEntry[];
  onHistoryChange: (h: HistoryEntry[]) => void;
}

export const Analyzer = ({ history, onHistoryChange }: Props) => {
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState("Twitter/X");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SentimentScore | null>(null);
  const [explanation, setExplanation] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast.error("File too large (max 1MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result || "").slice(0, 5000));
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }
    setLoading(true);
    try {
      const r = await analyzeSentiment(text.trim());
      setResult(r);
      setExplanation(explainSentiment(r, text.trim()));
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        text: text.trim(),
        platform,
        result: r,
        timestamp: Date.now(),
      };
      onHistoryChange(addHistory(entry));
      toast.success(`Detected: ${r.label}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText("");
    setResult(null);
    setExplanation("");
    setPlatform("Twitter/X");
    toast.success("Cleared");
  };

  const exportResult = () => {
    if (!result) return;
    const blob = new Blob(
      [JSON.stringify({ text, platform, result, explanation, date: new Date().toISOString() }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sentiment-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="analyze" className="py-24 bg-gradient-soft">
      <div className="container max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Analyze <span className="text-gradient">sentiment</span></h2>
          <p className="text-muted-foreground text-lg">Paste a post or upload a file. Get instant insights — no API key required.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 p-6 md:p-8 rounded-2xl bg-card border border-border shadow-soft space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Text to analyze</label>
              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Paste a tweet, caption, or comment..."
                className="min-h-[160px] resize-none"
                maxLength={5000}
              />
              <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                <span>{text.length} / 5000</span>
                <label className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-smooth">
                  <Upload className="w-3.5 h-3.5" /> Upload .txt
                  <input type="file" accept=".txt,.md,text/plain" className="hidden" onChange={handleFile} />
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                size="lg"
                className="flex-1 bg-gradient-hero hover:opacity-90 hover:scale-[1.02] shadow-glow h-12 text-primary-foreground transition-smooth"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Analyze sentiment</>
                )}
              </Button>
              <Button
                onClick={handleReset}
                disabled={loading}
                size="lg"
                variant="outline"
                className="h-12 border-2 hover:bg-secondary hover:scale-[1.02] transition-smooth"
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Reset
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2 p-6 md:p-8 rounded-2xl bg-gradient-card border border-border shadow-soft">
            <h3 className="font-semibold mb-4">Result</h3>
            {loading ? (
              <div className="space-y-3">
                <div className="h-8 bg-secondary animate-pulse rounded-lg" />
                <div className="h-24 bg-secondary animate-pulse rounded-lg" />
                <div className="h-16 bg-secondary animate-pulse rounded-lg" />
              </div>
            ) : result ? (
              <div className="space-y-4 animate-fade-in-up">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border capitalize ${labelStyles[result.label]}`}>
                  {result.label} · {(result.score * 100).toFixed(1)}%
                </div>
                <div className="space-y-2">
                  {(["positive", "neutral", "negative"] as const).map(k => (
                    <div key={k}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="capitalize text-muted-foreground">{k}</span>
                        <span className="font-medium">{(result[k] * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${result[k] * 100}%`, backgroundColor: `hsl(var(--${k}))` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
                <Button variant="outline" size="sm" onClick={exportResult} className="w-full hover:bg-secondary transition-smooth">
                  <Download className="w-3.5 h-3.5 mr-2" /> Export JSON
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Run an analysis to see results here.</p>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="mt-10">
            <SentimentCharts history={history} />
          </div>
        )}
      </div>
    </section>
  );
};
