import { AlertTriangle, ArrowRight, Check, CircleHelp, Lightbulb, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Analysis } from "@/types/prompt";

export function AnalysisPanel({ analysis, onUsePrompt }: { analysis: Analysis; onUsePrompt: (prompt: string) => void }) {
  const statusMap = {
    READY: { label: "Ready", icon: <Check size={12} />, cls: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200" },
    NEEDS_CLARIFICATION: { label: "Needs clarification", icon: <CircleHelp size={12} />, cls: "border-amber-300/20 bg-amber-300/10 text-amber-200" },
    AMBIGUOUS: { label: "Ambiguous", icon: <AlertTriangle size={12} />, cls: "border-red-300/20 bg-red-300/10 text-red-200" },
    ALREADY_GOOD: { label: "Already good", icon: <Check size={12} />, cls: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200" },
  }[analysis.status];

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-white/8 p-4"><div className="flex flex-wrap items-center gap-2"><Badge className={statusMap.cls}>{statusMap.icon}{statusMap.label}</Badge><span className="text-xs text-zinc-600">Analysis</span></div><p className="mt-3 text-sm leading-6 text-zinc-300">{analysis.summary}</p></div>
      <div className="grid divide-y divide-white/8 md:grid-cols-2 md:divide-x md:divide-y-0">
        <div className="p-4"><div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-300"><Lightbulb size={14} className="text-cyan-200" /> What works</div><ul className="space-y-2 text-xs leading-5 text-zinc-500">{analysis.strengths.map((v) => <li key={v}>• {v}</li>)}</ul></div>
        <div className="p-4"><div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-300"><ShieldAlert size={14} className="text-amber-200" /> What matters</div><ul className="space-y-2 text-xs leading-5 text-zinc-500">{[...analysis.issues, ...analysis.assumptions, ...analysis.tradeoffs].slice(0, 4).map((v) => <li key={v}>• {v}</li>)}</ul></div>
      </div>
      {analysis.question && <div className="border-t border-white/8 bg-cyan-300/[0.035] p-4"><div className="mb-2 text-[10px] uppercase tracking-[.2em] text-cyan-200/60">One useful question</div><p className="text-sm leading-6 text-zinc-200">{analysis.question}</p></div>}
      {analysis.improvedPrompt && <div className="border-t border-white/8 p-4"><div className="mb-3 flex items-center justify-between gap-3"><div><div className="text-[10px] uppercase tracking-[.2em] text-zinc-600">Improved prompt</div><p className="mt-1 text-xs text-zinc-500">Only necessary structure was added.</p></div><Button size="sm" variant="secondary" onClick={() => onUsePrompt(analysis.improvedPrompt!)}>Use this <ArrowRight size={14} /></Button></div><pre className="whitespace-pre-wrap rounded-xl border border-white/8 bg-black/20 p-4 text-xs leading-6 text-zinc-300">{analysis.improvedPrompt}</pre></div>}
      {analysis.lesson && <div className="border-t border-white/8 p-4 text-xs leading-5 text-zinc-600"><span className="text-zinc-400">Learn:</span> {analysis.lesson}</div>}
    </Card>
  );
}
