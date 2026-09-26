import { useEffect, useMemo, useState } from "react";
import { ArrowUp, BrainCircuit, Copy, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnalysisPanel } from "@/components/app/AnalysisPanel";
import { analyzePrompt } from "@/lib/think-engine";
import type { Analysis, Chat, ChatMessage } from "@/types/prompt";

interface Props {
  chat: Chat;
  onMessagesChange: (messages: ChatMessage[]) => void;
}

export function Workspace({ chat, onMessagesChange }: Props) {
  const [draft, setDraft] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [copied, setCopied] = useState(false);

  const hasMessages = chat.messages.length > 0;
  useEffect(() => {
    const latest = [...chat.messages].reverse().find((m) => m.role === "assistant" && m.analysis)?.analysis;
    if (latest) setAnalysis(latest);
  }, [chat.id]);

  const send = () => {
    const value = draft.trim();
    if (!value) return;
    const result = analyzePrompt(value);
    const now = Date.now();
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: value, createdAt: now };
    const assistantContent = result.question ? result.question : result.improvedPrompt ? "I’ve analysed the request and prepared a focused improvement." : "I’ve reviewed the prompt. There’s nothing major blocking you.";
    const assistantMessage: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: assistantContent, analysis: result, createdAt: now + 1 };
    onMessagesChange([...chat.messages, userMessage, assistantMessage]);
    setAnalysis(result);
    setDraft("");
  };

  const applyPrompt = (prompt: string) => setDraft(prompt);
  const copyPrompt = async () => {
    if (!analysis?.improvedPrompt) return;
    await navigator.clipboard.writeText(analysis.improvedPrompt);
    setCopied(true); window.setTimeout(() => setCopied(false), 1400);
  };
  const reset = () => { setDraft(""); setAnalysis(null); };

  const quickIdeas = useMemo(() => [
    "Make my prompt better",
    "Create a prompt for a Python tutor",
    "Help me write a professional email",
  ], []);

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-[radial-gradient(circle_at_70%_0%,rgba(34,211,238,.05),transparent_35%)]">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/8 px-4 md:px-7"><div className="min-w-0"><div className="truncate text-sm font-medium text-white">{chat.title}</div><div className="text-[10px] uppercase tracking-[.18em] text-zinc-700">Prompt workspace</div></div><div className="flex items-center gap-2"><Button variant="ghost" size="icon" onClick={reset} aria-label="Reset draft"><RotateCcw size={15} /></Button>{analysis?.improvedPrompt && <Button variant="secondary" size="sm" onClick={copyPrompt}><Copy size={14} /> {copied ? "Copied" : "Copy prompt"}</Button>}</div></header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-7">
        <div className="mx-auto max-w-4xl space-y-5 pb-6">
          {!hasMessages && !analysis && (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="mb-5 grid size-14 place-items-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] text-cyan-200"><BrainCircuit size={25} /></div>
              <div className="text-3xl font-medium tracking-tight md:text-5xl">What are you trying to make clearer?</div>
              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">Start with a rough request. It does not need to be a perfect prompt. PromptThink will help you understand it before improving it.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">{quickIdeas.map((idea) => <button key={idea} onClick={() => setDraft(idea)} className="rounded-full border border-white/8 bg-white/[0.025] px-3 py-2 text-xs text-zinc-500 transition hover:border-white/15 hover:text-zinc-300">{idea}</button>)}</div>
            </div>
          )}

          {chat.messages.map((message) => (
            <div key={message.id} className={message.role === "user" ? "ml-auto max-w-2xl" : "max-w-3xl"}>
              <div className={message.role === "user" ? "rounded-2xl border border-white/8 bg-white/[0.05] px-4 py-3 text-sm leading-6 text-zinc-200" : "px-1 py-2"}>
                {message.role === "assistant" && <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[.18em] text-cyan-200/60"><Sparkles size={12} /> PromptThink</div>}
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.analysis && <div className="mt-3"><AnalysisPanel analysis={message.analysis} onUsePrompt={applyPrompt} /></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 border-t border-white/8 bg-[#07080b]/90 p-4 backdrop-blur-xl md:p-5">
        <div className="mx-auto max-w-4xl">
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.025] p-2 focus-within:border-cyan-300/20">
            <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") send(); }} placeholder="Start with the idea in your own words…" className="min-h-28 border-0 bg-transparent pr-14 focus:ring-0" />
            <Button aria-label="Send prompt" variant="accent" size="icon" className="absolute bottom-3 right-3 rounded-xl" onClick={send} disabled={!draft.trim()}><ArrowUp size={16} /></Button>
          </div>
          <div className="mt-2 flex items-center justify-between px-1 text-[10px] uppercase tracking-[.16em] text-zinc-700"><span>Ctrl/Cmd + Enter</span><span>Think before you prompt</span></div>
        </div>
      </div>
    </section>
  );
}
