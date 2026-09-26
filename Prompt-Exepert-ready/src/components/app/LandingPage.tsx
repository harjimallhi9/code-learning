import { ArrowRight, BrainCircuit, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LuminaInteractiveList } from "@/components/ui/lumina-interactive-list";

export function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <main className="min-h-svh overflow-hidden bg-[#050608] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-black/45 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2"><div className="grid size-8 place-items-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"><Sparkles size={15} /></div><span className="font-semibold tracking-tight">PromptThink</span></div>
          <div className="hidden items-center gap-8 md:flex"><a href="#how" className="text-sm text-zinc-500 hover:text-white">How it works</a><a href="#why" className="text-sm text-zinc-500 hover:text-white">Why</a><a href="#app" className="text-sm text-zinc-500 hover:text-white">Workspace</a></div>
          <Button variant="accent" size="sm" onClick={onStart}>Start thinking <ArrowRight size={14} /></Button>
        </nav>
      </header>

      <section className="relative isolate flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_25%,rgba(34,211,238,.10),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(37,99,235,.08),transparent_28%)]" />
        <LuminaInteractiveList />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <Badge className="border-cyan-300/15 bg-cyan-300/[0.05] text-cyan-100/75">Prompt-thinking assistant</Badge>
          <h1 className="mt-7 text-5xl font-medium tracking-[-0.06em] sm:text-6xl md:text-8xl">Don't just write better prompts.<span className="block bg-gradient-to-b from-white via-white to-cyan-200/55 bg-clip-text text-transparent">Think better.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">Turn rough ideas into reliable prompts by understanding intent, spotting ambiguity, making better decisions, and learning why the prompt works.</p>
          <div className="mt-9 flex justify-center"><Button variant="accent" size="lg" onClick={onStart}>Open workspace <ArrowRight size={17} /></Button></div>
          <div className="mx-auto mt-20 max-w-4xl rounded-[28px] border border-white/10 bg-black/35 p-2 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm">
            <div className="rounded-[22px] border border-white/8 bg-[#0b0d11]/90 p-5 text-left md:p-7">
              <div className="mb-5 flex items-center gap-2 text-xs text-zinc-600"><BrainCircuit size={14} className="text-cyan-200" /> Thinking preview</div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["01", "Understand", "What are you actually trying to achieve?"],
                  ["02", "Question", "What missing detail materially changes the result?"],
                  ["03", "Improve", "Build the minimum prompt needed for reliability."],
                ].map(([n, title, body]) => <div key={n} className="rounded-2xl border border-white/8 bg-white/[0.025] p-4"><div className="text-[10px] text-cyan-200/50">{n}</div><div className="mt-2 text-sm text-zinc-200">{title}</div><p className="mt-2 text-xs leading-5 text-zinc-600">{body}</p></div>)}
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600"><Check size={13} className="text-emerald-300" /> Clearer intent. Better prompt. Better thinker.</div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="border-t border-white/8 px-6 py-24"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><div className="text-xs uppercase tracking-[.22em] text-cyan-200/50">How it works</div><h2 className="mt-3 text-3xl tracking-tight md:text-5xl">The assistant doesn't rush to rewrite.</h2><p className="mt-4 text-sm leading-7 text-zinc-500">It first decides whether you need an answer, a suggestion, a question, a challenge, or a better-built prompt.</p></div></div></section>
    </main>
  );
}
