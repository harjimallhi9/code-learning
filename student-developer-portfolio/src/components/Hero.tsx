import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowDown, 
  Github, 
  Linkedin, 
  Mail, 
  Code2, 
  Terminal, 
  Sparkles, 
  ExternalLink,
  ChevronDown,
  Layers,
  Cpu,
  Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortfolioData } from "@/data/portfolio";
import { openResumeInNewTab } from "@/lib/resumeHelper";

interface HeroProps {
  portfolio: PortfolioData;
  onExploreProjects: () => void;
  onContactClick: () => void;
  onOpenResume?: () => void;
}

export function Hero({ portfolio, onExploreProjects, onContactClick, onOpenResume }: HeroProps) {
  return (
    <section 
      id="hero" 
      className="relative flex min-h-[92vh] w-full flex-col items-center justify-center overflow-hidden bg-zinc-950 pt-28 pb-16 text-foreground"
    >
      {/* Background Animated Grid Pattern */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"
      />

      {/* Subtle Radial Glow Backdrops */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[750px] rounded-full bg-gradient-to-b from-amber-500/10 via-indigo-500/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-48 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-48 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Status Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 backdrop-blur-md shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">
            {portfolio.role}
          </span>
          <span className="h-3 w-px bg-zinc-700 mx-0.5" />
          <span className="text-xs text-zinc-400 font-mono">
            {portfolio.location}
          </span>
        </motion.div>

        {/* Avatar / Initials Circle with Spring Entrance */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 18 }}
          className="mb-6 inline-block"
        >
          <div className="relative mx-auto flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-3xl border border-zinc-700/80 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 shadow-2xl shadow-black/60 ring-1 ring-white/10 group cursor-pointer hover:border-amber-500/50 transition-colors">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-wider bg-gradient-to-br from-white via-zinc-200 to-amber-300/80 bg-clip-text text-transparent">
              {portfolio.shortName || "YN"}
            </span>
            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700 text-amber-400 shadow-md">
              <Code2 className="h-4 w-4" />
            </div>
          </div>
        </motion.div>

        {/* Large Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-7xl leading-[1.08]"
        >
          <span className="block text-zinc-100">
            {portfolio.name}
          </span>
          <span className="block mt-2 bg-gradient-to-r from-zinc-200 via-amber-200 to-orange-300 bg-clip-text text-transparent">
            {portfolio.headline || "Full Stack Developer"}
          </span>
        </motion.h1>

        {/* Short Introduction */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mx-auto mb-10 max-w-2xl text-base sm:text-lg md:text-xl text-zinc-400 leading-relaxed font-normal"
        >
          {portfolio.bio}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mb-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={onExploreProjects}
            className="gap-2.5 rounded-xl bg-white text-zinc-950 font-semibold hover:bg-zinc-200 shadow-lg shadow-white/5 cursor-pointer px-6"
          >
            <span>View Projects</span>
            <ArrowDown className="h-4 w-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={onContactClick}
            className="gap-2.5 rounded-xl border-zinc-700 bg-zinc-900/80 text-white hover:bg-zinc-800 hover:border-zinc-500 cursor-pointer px-6"
          >
            <Mail className="h-4 w-4 text-amber-400" />
            <span>Get in Touch</span>
          </Button>

          <button
            onClick={() => {
              if (onOpenResume) {
                onOpenResume();
              } else {
                openResumeInNewTab(portfolio.resume || "/resume.pdf");
              }
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 text-sm font-medium text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors cursor-pointer"
            title="View Resume PDF"
          >
            <span>Resume</span>
            <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
          </button>
        </motion.div>

        {/* Social Links Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="flex items-center justify-center gap-3.5"
        >
          {/* GitHub */}
          <motion.a
            href={portfolio.github}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-white shadow-sm"
            aria-label="GitHub Profile"
          >
            <Github className="h-5 w-5" />
          </motion.a>

          {/* LinkedIn */}
          <motion.a
            href={portfolio.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 transition-colors hover:border-blue-500/50 hover:bg-zinc-800 hover:text-blue-400 shadow-sm"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="h-5 w-5" />
          </motion.a>

          {/* Email Mailto */}
          <motion.a
            href={`mailto:${portfolio.email}`}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 transition-colors hover:border-amber-500/50 hover:bg-zinc-800 hover:text-amber-400 shadow-sm"
            aria-label="Send Email"
          >
            <Mail className="h-5 w-5" />
          </motion.a>
        </motion.div>

        {/* Featured Project Snippet Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="mt-12 inline-flex items-center gap-3 rounded-full border border-zinc-800/80 bg-zinc-900/60 px-4 py-2 text-xs text-zinc-400 backdrop-blur-md hover:border-zinc-700 transition-colors"
        >
          <span className="flex h-2 w-2 rounded-full bg-amber-400" />
          <span>Featured Build:</span>
          <span className="font-semibold text-zinc-200">Real-Time GPS Tracker</span>
          <span className="hidden sm:inline text-zinc-500 font-mono text-[11px]">(Node.js + Socket.IO + Geolocation)</span>
        </motion.div>
      </div>

      {/* Bouncing Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 0.8, duration: 0.6 },
          y: { delay: 1.2, duration: 1.8, repeat: Infinity, ease: "easeInOut" },
        }}
        className="mt-12 flex flex-col items-center gap-1.5 cursor-pointer text-zinc-500 hover:text-zinc-300 transition-colors"
        onClick={onExploreProjects}
      >
        <span className="text-[11px] uppercase tracking-widest font-mono">Scroll to explore</span>
        <ChevronDown className="h-4 w-4" />
      </motion.div>
    </section>
  );
}
