import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, children }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-300", className)}>
      {children}
    </span>
  );
}
