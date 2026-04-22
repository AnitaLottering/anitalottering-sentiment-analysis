import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section id="top" className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-soft -z-10" />
      <div className="absolute top-20 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl -z-10" />
      <div className="absolute top-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl -z-10" />

      <div className="container text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary border border-border text-xs font-medium mb-6 animate-fade-in-up">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          AI-powered social media intelligence
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-up">
          Understand the <span className="text-gradient">sentiment</span><br />
          behind every post
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up">
          Analyze text from Twitter, Instagram, Facebook, LinkedIn, and TikTok in seconds.
          Beautiful charts, AI insights, and smart suggestions — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up">
          <Button asChild size="lg" className="bg-gradient-hero hover:opacity-90 shadow-glow text-base h-12 px-8">
            <a href="#analyze">
              Start analyzing <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8">
            <a href="#features"><BarChart3 className="mr-2 w-4 h-4" /> See features</a>
          </Button>
        </div>
      </div>
    </section>
  );
};
