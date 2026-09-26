import React from "react";
import { ArrowUp, Heart, Code2, Sliders, Lock, Unlock } from "lucide-react";
import { PortfolioData } from "@/data/portfolio";

interface FooterProps {
  portfolio: PortfolioData;
  onOpenAdmin: () => void;
  isOwnerUnlocked?: boolean;
}

export function Footer({ portfolio, onOpenAdmin, isOwnerUnlocked = false }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-zinc-950 border-t border-zinc-900 py-12 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Left info */}
          <div className="flex flex-col sm:items-start items-center gap-1.5 text-center sm:text-left">
            <div className="flex items-center gap-2 text-zinc-200 font-bold">
              <Code2 className="h-4 w-4 text-amber-400" />
              <span>{portfolio.name}</span>
              <span className="text-zinc-600">/</span>
              <span className="text-xs font-mono text-zinc-400">{portfolio.role}</span>
            </div>
            <p className="text-xs text-zinc-500">
              © {currentYear} {portfolio.name}. Crafted with clean code, React, TypeScript & Tailwind.
            </p>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {isOwnerUnlocked ? (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                title="Owner Mode Active - Click to Edit"
              >
                <Unlock className="h-3.5 w-3.5 text-emerald-400" />
                <span>Owner Mode: ON</span>
              </button>
            ) : (
              /* Discreet trigger hidden in plain sight: subtle lock with no loud label */
              <button
                onClick={onOpenAdmin}
                className="text-zinc-700 hover:text-zinc-500 transition-colors p-1"
                aria-label="Owner sign in"
                title="Owner login"
              >
                <Lock className="h-3 w-3 opacity-30 hover:opacity-80 transition-opacity" />
              </button>
            )}

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
