import { Component as LuminaSlider } from "@/components/ui/lumina-interactive-list";
import { Navigation, Manifesto } from "@/components/ui/saa-s-template";

function ClosingLoop() {
  return (
    <section
      id="start"
      className="flex min-h-[60vh] flex-col items-center justify-center border-t border-white/10 px-6 py-24 text-center"
    >
      <h2 className="mb-4 max-w-2xl font-[var(--font-display)] text-3xl font-medium tracking-tight md:text-4xl">
        This is a loop, not a funnel.
      </h2>
      <p className="mb-10 max-w-md text-sm text-white/60">
        Every prompt teaches the next one. Start wherever your idea already is.
      </p>
      <a
        href="#top"
        className="text-sm text-[var(--color-accent)] underline underline-offset-4 transition hover:opacity-80"
      >
        Back to the beginning
      </a>
    </section>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 border-t border-white/10 px-6 py-8 text-xs text-white/40 sm:flex-row">
      <span className="font-[var(--font-display)] text-white/70">Prompt Manager</span>
      <span>Think first. Prompt second.</span>
    </footer>
  );
}

function App() {
  return (
    <div id="top" className="bg-[var(--color-bg)] text-white">
      <Navigation />

      <section id="loop">
        <LuminaSlider />
      </section>

      <Manifesto />
      <ClosingLoop />
      <Footer />
    </div>
  );
}

export default App;
