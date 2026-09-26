import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Sparkles, 
  Layers, 
  ArrowUpRight, 
  TrendingUp,
  Plus
} from "lucide-react";
import { LearningItem } from "@/data/portfolio";
import { Button } from "@/components/ui/button";

interface LearningSectionProps {
  learning: LearningItem[];
  onOpenAdmin: () => void;
  isOwnerUnlocked?: boolean;
}

export function LearningSection({ learning, onOpenAdmin, isOwnerUnlocked = false }: LearningSectionProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const statuses = ["all", "In Progress", "Exploring", "Next Up"];

  const filteredItems = learning.filter((item) => {
    if (selectedStatus === "all") return true;
    return item.status === selectedStatus;
  });

  const getStatusBadge = (status: LearningItem["status"]) => {
    switch (status) {
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            In Progress
          </span>
        );
      case "Exploring":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Exploring
          </span>
        );
      case "Next Up":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-300">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Next Up
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="learning" className="relative py-24 bg-zinc-950/60 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3">
              <BookOpen className="h-3.5 w-3.5 text-amber-400" />
              <span>03 // KNOWLEDGE EXPANSION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              What I'm Learning
            </h2>
            <p className="mt-2 text-zinc-400 max-w-xl text-sm sm:text-base">
              A transparent view of technologies, frameworks, and engineering concepts currently on my active radar.
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/80 border border-zinc-800 self-start sm:self-auto">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedStatus === st
                    ? "bg-zinc-800 text-white shadow-sm font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                }`}
              >
                {st === "all" ? "All Roadmap" : st}
              </button>
            ))}
          </div>
        </div>

        {/* Learning Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id || item.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-md transition-all hover:border-zinc-700 hover:bg-zinc-900/70 hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="rounded-md bg-zinc-800/90 border border-zinc-700/60 px-2 py-0.5 text-[11px] font-mono text-zinc-400">
                  {item.category}
                </span>
                {getStatusBadge(item.status)}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                {item.name}
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed min-h-[3rem]">
                {item.description}
              </p>

              {/* Progress Bar Indicator */}
              <div className="mt-4 pt-3 border-t border-zinc-800/80">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1.5">
                  <span className="text-[11px] text-zinc-500">Mastery Arc</span>
                  <span className="text-zinc-300 font-semibold">{item.progressPercentage}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.progressPercentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className={`h-full rounded-full ${
                      item.status === 'In Progress'
                        ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                        : item.status === 'Exploring'
                        ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                        : 'bg-gradient-to-r from-blue-400 to-indigo-400'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic add button in footer - Only visible in owner mode */}
        {isOwnerUnlocked && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={onOpenAdmin}
              variant="outline"
              size="sm"
              className="gap-2 border-amber-500/30 bg-amber-500/5 text-xs text-amber-300 hover:bg-amber-500/10"
            >
              <Plus className="h-3.5 w-3.5 text-amber-400" />
              <span>Add or Update Roadmap Tech</span>
            </Button>
          </div>
        )}

      </div>
    </section>
  );
}
