import { useState } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addRating } from "@/lib/storage";

export const Rating = () => {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!stars) return;
    addRating({ stars, comment, timestamp: Date.now() });
    setSubmitted(true);
  };

  return (
    <section id="rating" className="py-24 bg-gradient-soft">
      <div className="container max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How was your experience?</h2>
          <p className="text-muted-foreground text-lg">Your feedback helps us improve.</p>
        </div>
        <div className="p-8 md:p-10 rounded-2xl bg-card border border-border shadow-elegant">
          {submitted ? (
            <div className="text-center py-6 animate-fade-in-up">
              <CheckCircle2 className="w-16 h-16 text-positive mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Thank you!</h3>
              <p className="text-muted-foreground">Your feedback has been recorded.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setStars(n)}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-smooth hover:scale-110"
                    aria-label={`${n} stars`}
                  >
                    <Star
                      className={`w-10 h-10 ${
                        n <= (hover || stars) ? "fill-neutral text-neutral" : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Tell us more (optional)..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="min-h-[100px] mb-4 resize-none"
                maxLength={500}
              />
              <Button
                onClick={submit}
                disabled={!stars}
                size="lg"
                className="w-full bg-gradient-hero hover:opacity-90 shadow-glow"
              >
                <Send className="w-4 h-4 mr-2" /> Submit feedback
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
