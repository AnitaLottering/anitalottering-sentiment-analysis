import { Brain, BarChart3, MessageCircle, Library, Shield, Zap } from "lucide-react";

const items = [
  { icon: Brain, title: "AI Sentiment", desc: "Powered by Hugging Face transformer models trained on social media." },
  { icon: BarChart3, title: "Rich Visuals", desc: "Pie, bar, and trend charts make insights easy to digest." },
  { icon: MessageCircle, title: "Smart Assistant", desc: "Built-in chatbot explains results and suggests tone improvements." },
  { icon: Library, title: "Prompt Library", desc: "Every analysis is saved locally — re-run or delete anytime." },
  { icon: Shield, title: "Private by Default", desc: "Your API key and history live in your browser. Nothing leaves." },
  { icon: Zap, title: "Multi-Platform", desc: "Twitter/X, Instagram, Facebook, LinkedIn, TikTok — all supported." },
];

export const Features = () => (
  <section id="features" className="py-24">
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need</h2>
        <p className="text-muted-foreground text-lg">A complete toolkit for understanding your audience.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it, i) => (
          <div
            key={it.title}
            className="group p-6 rounded-2xl bg-gradient-card border border-border shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-smooth"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
              <it.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{it.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
