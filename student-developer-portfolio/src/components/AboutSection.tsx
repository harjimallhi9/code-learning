import React from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Flame, 
  Brain, 
  Terminal, 
  Sparkles, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Code2
} from "lucide-react";
import { PortfolioData } from "@/data/portfolio";

interface AboutSectionProps {
  portfolio: PortfolioData;
}

export function AboutSection({ portfolio }: AboutSectionProps) {
  return (
    <section id="about" className="relative py-24 bg-zinc-950/60 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3">
            <Terminal className="h-3.5 w-3.5 text-amber-400" />
            <span>01 // BACKGROUND</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            About Me
          </h2>
          <p className="mt-3 text-zinc-400 max-w-xl text-sm sm:text-base">
            Bridging academic computer science foundations with real-world, hands-on software development.
          </p>
        </div>

        {/* Bento Grid Layout for About Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          
          {/* Main Biography Card (Spans 7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col justify-between hover:border-zinc-700/80 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Student & Builder Profile</h3>
                    <p className="text-xs text-zinc-400 font-mono">Continuous Growth Path</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Enrolled & Coding</span>
                </div>
              </div>

              <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed">
                <p>
                  {portfolio.bio}
                </p>
                <p className="text-zinc-400 text-sm">
                  {portfolio.studentStatus}
                </p>
              </div>
            </div>

            {/* Quick Highlights */}
            <div className="mt-8 pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/60 p-3">
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Focus</div>
                <div className="text-sm font-semibold text-zinc-200 mt-0.5">Full Stack Web</div>
              </div>
              <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/60 p-3">
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Location</div>
                <div className="text-sm font-semibold text-zinc-200 mt-0.5">{portfolio.location}</div>
              </div>
              <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/60 p-3 col-span-2 sm:col-span-1">
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Codebase</div>
                <div className="text-sm font-semibold text-amber-300 mt-0.5">TypeScript & Node</div>
              </div>
            </div>
          </motion.div>

          {/* Current Focus Card (Spans 5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col justify-between hover:border-zinc-700/80 transition-all"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Current Active Focus</h3>
                  <p className="text-xs text-zinc-400 font-mono">What I'm building today</p>
                </div>
              </div>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6">
                {portfolio.currentFocus}
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50 p-3">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-zinc-300">
                    <span className="font-semibold text-white">Real-Time Architectures: </span>
                    Leveraging WebSockets and Socket.IO for low-latency client-server state sync.
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50 p-3">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-zinc-300">
                    <span className="font-semibold text-white">Type Safety End-to-End: </span>
                    Adopting strict TypeScript across interfaces, API contracts, and frontends.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Actively expanding project portfolio</span>
            </div>
          </motion.div>

          {/* Learning Mindset & Philosophy Card (Spans 12 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-12 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-md shadow-xl hover:border-zinc-700/80 transition-all"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Learning Mindset</h3>
                  <p className="text-xs text-zinc-400 font-mono">Engineering Philosophy</p>
                </div>
              </div>

              <div className="md:col-span-8">
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed italic border-l-2 border-amber-500/40 pl-4 py-1">
                  "{portfolio.learningMindset}"
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
