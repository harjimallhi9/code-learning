import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Cpu, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  Wrench, 
  Code, 
  ShieldCheck,
  Plus
} from "lucide-react";
import { Skill } from "@/data/portfolio";
import { Button } from "@/components/ui/button";

interface SkillsSectionProps {
  skills: Skill[];
  onOpenAdmin: () => void;
  isOwnerUnlocked?: boolean;
}

export function SkillsSection({ skills, onOpenAdmin, isOwnerUnlocked = false }: SkillsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["all", "Languages", "Frontend", "Backend", "Tools & DevOps"];

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: Skill["status"]) => {
    switch (status) {
      case "Comfortable":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Comfortable
          </span>
        );
      case "Learning & Building":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Learning & Building
          </span>
        );
      case "Learning":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Learning
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="skills" className="relative py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3">
              <Cpu className="h-3.5 w-3.5 text-amber-400" />
              <span>04 // CAPABILITIES MATRIX</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Technical Skills
            </h2>
            <p className="mt-2 text-zinc-400 max-w-xl text-sm sm:text-base">
              An authentic breakdown of my active tools and proficiencies without inflated claims.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-zinc-800 text-white border border-zinc-700 font-semibold shadow-sm"
                  : "bg-zinc-900/50 text-zinc-400 border border-zinc-800/80 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              {cat === "all" ? "All Domains" : cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSkills.map((skill, idx) => (
            <motion.div
              key={skill.id || skill.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
              className="group relative rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 backdrop-blur-sm transition-all hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {skill.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {skill.category}
                </span>
              </div>

              <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                {getStatusBadge(skill.status)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend / Status Guide Banner */}
        <div className="mt-12 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
            <div className="text-xs text-zinc-400">
              <span className="font-semibold text-zinc-200">Honest Evaluation: </span>
              <span className="text-zinc-400">
                "Comfortable" means shipped in working projects; "Learning & Building" means actively practicing; "Learning" means studying documentation and fundamentals.
              </span>
            </div>
          </div>

          {isOwnerUnlocked && (
            <Button
              onClick={onOpenAdmin}
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 shrink-0 border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Manage Skills</span>
            </Button>
          )}
        </div>

      </div>
    </section>
  );
}
