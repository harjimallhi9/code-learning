import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn("min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white placeholder:text-zinc-600 outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10", className)}
      {...props}
    />
  );
}
