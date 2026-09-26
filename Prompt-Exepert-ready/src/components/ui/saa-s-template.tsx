import React from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SaaSTemplate() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  return (
    <main className="min-h-screen bg-[#050608] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-lg font-semibold tracking-tight">PromptThink</div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#how" className="text-sm text-zinc-400 transition hover:text-white">How it works</a>
            <a href="#why" className="text-sm text-zinc-400 transition hover:text-white">Why PromptThink</a>
            <a href="#app" className="text-sm text-zinc-400 transition hover:text-white">Workspace</a>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm">Sign in</Button>
            <Button variant="default" size="sm">Get started</Button>
          </div>
          <button className="text-zinc-300 md:hidden" onClick={() => setMobileMenuOpen((v) => !v)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-black/85 px-6 py-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-3">
              <a href="#how" className="py-2 text-sm text-zinc-400" onClick={() => setMobileMenuOpen(false)}>How it works</a>
              <a href="#why" className="py-2 text-sm text-zinc-400" onClick={() => setMobileMenuOpen(false)}>Why PromptThink</a>
              <a href="#app" className="py-2 text-sm text-zinc-400" onClick={() => setMobileMenuOpen(false)}>Workspace</a>
              <Button variant="accent" size="sm">Start thinking <ArrowRight size={15} /></Button>
            </div>
          </div>
        )}
      </header>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-24 pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,.12),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(59,130,246,.09),transparent_26%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-2 text-xs text-cyan-100/80">
            <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,.9)]" /> Think before you prompt
          </div>
          <h1 className="text-5xl font-medium tracking-[-0.055em] text-white sm:text-6xl md:text-8xl">
            Don't just write better prompts.
            <span className="block bg-gradient-to-b from-white via-white to-cyan-200/60 bg-clip-text text-transparent">Think better.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            PromptThink helps you understand what you're asking, spot ambiguity, make better decisions, and build prompts that actually serve your intended result.
          </p>
          <div className="mt-9 flex justify-center gap-3">
            <Button variant="accent" size="lg"><ArrowRight size={17} /> Open workspace</Button>
          </div>
          <div className="mx-auto mt-20 max-w-5xl rounded-[28px] border border-white/10 bg-white/[0.025] p-2 shadow-2xl shadow-cyan-950/20">
            <div className="rounded-[22px] border border-white/8 bg-[#0b0d11] p-5 text-left md:p-8">
              <div className="mb-5 flex items-center gap-2 text-xs text-zinc-500"><span className="size-2 rounded-full bg-red-400/60" /><span className="size-2 rounded-full bg-yellow-300/60" /><span className="size-2 rounded-full bg-green-400/60" /><span className="ml-3">Prompt analysis</span></div>
              <div className="grid gap-5 md:grid-cols-[1.15fr_.85fr]">
                <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
                  <div className="mb-3 text-[11px] uppercase tracking-[.18em] text-zinc-600">Your idea</div>
                  <p className="text-sm leading-6 text-zinc-300">“Make my prompt better. I want an AI tutor to help me learn Python.”</p>
                </div>
                <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.035] p-5">
                  <div className="mb-3 text-[11px] uppercase tracking-[.18em] text-cyan-200/60">PromptThink</div>
                  <p className="text-sm leading-6 text-zinc-300">Your goal is clear. One detail materially changes the prompt: your current Python level.</p>
                  <div className="mt-4 text-xs text-cyan-200">One useful question → then we can build it.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
