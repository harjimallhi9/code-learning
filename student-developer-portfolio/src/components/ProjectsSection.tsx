import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Github, 
  ExternalLink, 
  Star, 
  Code2, 
  FolderGit2, 
  Plus, 
  Layers, 
  Radio, 
  Check, 
  Info,
  X
} from "lucide-react";
import { Project } from "@/data/portfolio";
import { Button } from "@/components/ui/button";

interface ProjectsSectionProps {
  projects: Project[];
  onOpenAdmin: () => void;
  isOwnerUnlocked?: boolean;
}

export function ProjectsSection({ projects, onOpenAdmin, isOwnerUnlocked = false }: ProjectsSectionProps) {
  const [filter, setFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ["all", "featured", "Full Stack", "Frontend", "Tooling"];

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    if (filter === "featured") return project.featured;
    return project.category === filter;
  });

  return (
    <section id="projects" className="relative py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3">
              <FolderGit2 className="h-3.5 w-3.5 text-amber-400" />
              <span>02 // PORTFOLIO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Featured Projects
            </h2>
            <p className="mt-2 text-zinc-400 max-w-xl text-sm sm:text-base">
              Real projects built to solve tangible problems and explore software engineering architecture.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-900/80 border border-zinc-800 self-start sm:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                  filter === cat
                    ? "bg-zinc-800 text-white shadow-sm font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                }`}
              >
                {cat === "all" ? "All Projects" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id || project.title}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-zinc-700/90 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1"
              >
                {/* Top Row: Category & Badges */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      {project.featured && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>Featured</span>
                        </span>
                      )}
                      {project.category && (
                        <span className="rounded-md bg-zinc-800/80 border border-zinc-700/50 px-2 py-0.5 text-[11px] font-mono text-zinc-400">
                          {project.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* GitHub Link */}
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                        aria-label={`View ${project.title} on GitHub`}
                        title="View GitHub Repository"
                      >
                        <Github className="h-4 w-4" />
                      </a>

                      {/* Live Demo or External Link */}
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                          aria-label={`Open demo for ${project.title}`}
                          title="Open Live Demo or Repo"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors tracking-tight">
                    {project.title}
                  </h3>

                  {/* Project Description */}
                  <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Bottom Row: Tech Stack Pills & Actions */}
                <div className="mt-8 pt-5 border-t border-zinc-800/80">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map((techItem) => (
                      <span
                        key={techItem}
                        className="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900/90 px-2.5 py-1 text-xs font-mono text-zinc-300"
                      >
                        {techItem}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Info className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Architecture Notes</span>
                    </button>

                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <span>Explore Code</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-zinc-800 bg-zinc-900/30">
            <p className="text-zinc-400 text-sm">No projects found in this category.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter("all")}
              className="mt-3 text-xs border-zinc-700"
            >
              Show All Projects
            </Button>
          </div>
        )}

        {/* Add Project Quick Banner - Only visible when owner mode is active */}
        {isOwnerUnlocked && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-dashed border-amber-500/30 bg-amber-500/5 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Owner Mode: Project Management</h4>
                <p className="text-xs text-zinc-400">
                  You can add, edit, or delete projects directly from your dashboard.
                </p>
              </div>
            </div>

            <Button
              onClick={onOpenAdmin}
              variant="outline"
              size="sm"
              className="gap-2 border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Manage / Add Project</span>
            </Button>
          </div>
        )}

      </div>

      {/* Architecture Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl border border-zinc-700 bg-zinc-900 p-6 sm:p-8 shadow-2xl shadow-black/80 text-left"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                {selectedProject.featured && (
                  <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                    Featured
                  </span>
                )}
                <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                  {selectedProject.category || "Full Stack"}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                {selectedProject.title}
              </h3>

              <div className="space-y-4 text-zinc-300 text-sm leading-relaxed mb-6">
                <p>{selectedProject.description}</p>
                {selectedProject.longDescription && (
                  <p className="text-zinc-400 bg-zinc-950/70 p-4 rounded-xl border border-zinc-800">
                    {selectedProject.longDescription}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-zinc-500 font-mono mb-2">Technologies Used</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.tech.map((t) => (
                    <span key={t} className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs font-mono text-amber-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-200"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>View Repository</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
