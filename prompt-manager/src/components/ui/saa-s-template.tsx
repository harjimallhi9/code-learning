import React from "react";

// Inline Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "gradient";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default: "bg-white text-black hover:bg-white/90 focus-visible:ring-white/60",
      secondary: "bg-white/10 text-white hover:bg-white/15 focus-visible:ring-white/40",
      ghost: "hover:bg-white/5 text-white/80 hover:text-white focus-visible:ring-white/30",
      gradient: "bg-[var(--color-accent)] text-black hover:brightness-110 active:scale-95 focus-visible:ring-[var(--color-accent)]",
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-9 px-4 text-sm",
      lg: "h-12 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

// Icons
const ArrowRight = ({ className = "", size = 16 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const Menu = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const X = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const NAV_LINKS = [
  { href: "#loop", label: "How it thinks" },
  { href: "#manifesto", label: "Philosophy" },
];

// Navigation Component — transparent, sits on top of the slider
export const Navigation = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="#top" className="font-[var(--font-display)] text-xl tracking-tight text-white">
            Prompt Manager
          </a>

          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <Button
              type="button"
              variant="gradient"
              size="sm"
              onClick={() => document.getElementById("start")?.scrollIntoView({ behavior: "smooth" })}
            >
              Get started
            </Button>
          </div>

          <button
            type="button"
            className="text-white md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-black/90 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="py-2 text-sm text-white/60 transition-colors hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
              <Button
                type="button"
                variant="gradient"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById("start")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Get started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

Navigation.displayName = "Navigation";

// Manifesto section — sits below the interactive loop slider.
// Replaces the template's placeholder headline/screenshot with real
// product copy and a small hand-built before/after prompt panel.
export const Manifesto = React.memo(() => {
  return (
    <section
      id="manifesto"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24"
    >
      <aside className="mb-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm">
        <span className="text-xs text-white/60">Not a prompt generator — a thinking partner</span>
        <a
          href="#loop"
          className="flex items-center gap-1 text-xs text-white/60 transition-all hover:text-white active:scale-95"
        >
          See how
          <ArrowRight size={12} />
        </a>
      </aside>

      <h2
        className="mb-6 max-w-3xl px-6 text-center font-[var(--font-display)] text-4xl font-medium leading-tight tracking-tight md:text-5xl lg:text-6xl"
        style={{
          background: "linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.7))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Think better. Prompt better.
      </h2>

      <p className="mb-10 max-w-xl px-6 text-center text-sm text-white/60 md:text-base">
        The goal was never a longer prompt. It's a clearer one — built from the minimum
        information your result actually needs, with the assumptions and trade-offs
        made visible along the way.
      </p>

      <div className="relative z-10 mb-16 flex items-center gap-4">
        <Button
          type="button"
          variant="gradient"
          size="lg"
          className="rounded-lg"
          onClick={() => document.getElementById("top")?.scrollIntoView({ behavior: "smooth" })}
        >
          Start thinking
        </Button>
      </div>

      {/* Before / after prompt panel — a real demonstration instead of a stock screenshot */}
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] font-[var(--font-mono)] text-sm">
        <div className="border-b border-white/10 px-5 py-4">
          <p className="mb-2 text-xs uppercase tracking-wider text-white/40">Before</p>
          <p className="text-white/70">"write me a good essay about climate change"</p>
        </div>
        <div className="px-5 py-4">
          <p className="mb-2 text-xs uppercase tracking-wider text-[var(--color-accent)]">After</p>
          <p className="text-white/90">
            "Write a 600-word essay on how rising sea levels are reshaping coastal city
            planning. Audience: general readers. Tone: measured, not alarmist."
          </p>
        </div>
        <div className="border-t border-white/10 bg-white/[0.02] px-5 py-3 font-[var(--font-sans)] text-xs italic text-white/40">
          Added: length, angle, audience, tone — the four things that were actually undefined.
        </div>
      </div>
    </section>
  );
});

Manifesto.displayName = "Manifesto";

// Default export kept for standalone preview / parity with the original demo.tsx
export default function Component() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-white">
      <Navigation />
      <Manifesto />
    </main>
  );
}
