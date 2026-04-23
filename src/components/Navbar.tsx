import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#analyze", label: "Analyze" },
  { href: "#library", label: "Library" },
  { href: "#rating", label: "Rating" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-smooth bg-nav text-nav-foreground border-b border-nav-border ${
        scrolled ? "backdrop-blur-lg shadow-glow" : ""
      }`}
    >
      <nav className="container flex items-center justify-between h-16">
        <a href="#top" className="font-bold text-lg text-nav-foreground">
          Social Media Analysis
        </a>
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-sm font-medium text-nav-foreground/70 hover:text-nav-foreground rounded-lg hover:bg-white/10 transition-smooth"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setDark(d => !d)} aria-label="Toggle theme" className="text-nav-foreground hover:bg-white/10 hover:text-nav-foreground">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button asChild className="bg-white text-primary hover:bg-white/90 shadow-glow hidden sm:inline-flex font-semibold">
            <a href="#analyze">Try it free</a>
          </Button>
        </div>
      </nav>
    </header>
  );
};
