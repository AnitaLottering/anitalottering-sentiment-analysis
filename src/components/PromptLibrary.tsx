import { Button } from "@/components/ui/button";
import { Trash2, RotateCw, Clock } from "lucide-react";
import { removeHistory, type HistoryEntry } from "@/lib/storage";

const colorBy: Record<string, string> = {
  positive: "bg-positive/10 text-positive border-positive/30",
  negative: "bg-negative/10 text-negative border-negative/30",
  neutral: "bg-neutral/10 text-neutral border-neutral/30",
};

const ago = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

interface Props {
  history: HistoryEntry[];
  onChange: (h: HistoryEntry[]) => void;
  onRerun: (text: string, platform: string) => void;
}

export const PromptLibrary = ({ history, onChange, onRerun }: Props) => {
  return (
    <section id="library" className="py-24">
      <div className="container max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Prompt library</h2>
          <p className="text-muted-foreground text-lg">All your past analyses, saved locally and ready to revisit.</p>
        </div>
        {history.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-gradient-card border border-dashed border-border">
            <p className="text-muted-foreground">No analyses yet. Start by analyzing some text above.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map(h => (
              <div key={h.id} className="p-5 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elegant transition-smooth flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${colorBy[h.result.label]}`}>
                    {h.result.label} · {(h.result.score * 100).toFixed(0)}%
                  </span>
                  <span className="text-xs text-muted-foreground">{h.platform}</span>
                </div>
                <p className="text-sm leading-relaxed mb-4 flex-1 line-clamp-4">{h.text}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ago(h.timestamp)}
                  </span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => onRerun(h.text, h.platform)} title="Re-run">
                      <RotateCw className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onChange(removeHistory(h.id))} title="Delete">
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
