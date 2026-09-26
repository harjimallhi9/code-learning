import React from "react";
import { motion } from "framer-motion";
import { 
  Award, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  CheckCircle, 
  Plus 
} from "lucide-react";
import { Certificate } from "@/data/portfolio";
import { Button } from "@/components/ui/button";

interface CertificatesSectionProps {
  certificates: Certificate[];
  onOpenAdmin: () => void;
  isOwnerUnlocked?: boolean;
}

export function CertificatesSection({ certificates, onOpenAdmin, isOwnerUnlocked = false }: CertificatesSectionProps) {
  return (
    <section id="certificates" className="relative py-24 bg-zinc-950/60 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span>05 // CREDENTIALS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Certificates & Courses
            </h2>
            <p className="mt-2 text-zinc-400 max-w-xl text-sm sm:text-base">
              Verified certifications, coursework, and milestones completed alongside degree studies.
            </p>
          </div>

          {isOwnerUnlocked && (
            <Button
              onClick={onOpenAdmin}
              variant="outline"
              size="sm"
              className="gap-2 border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Certificate</span>
            </Button>
          )}
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, idx) => (
            <motion.a
              key={cert.id || cert.title}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-md transition-all hover:border-amber-500/40 hover:bg-zinc-900/80 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                    <Award className="h-5 w-5" />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{cert.year}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {cert.title}
                </h3>

                <p className="mt-1 text-sm text-zinc-400 font-medium">
                  {cert.issuer}
                </p>

                {cert.credentialId && (
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-zinc-950/70 border border-zinc-800 px-2.5 py-1 text-[11px] font-mono text-zinc-400">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    <span>ID: {cert.credentialId}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 group-hover:text-amber-400 transition-colors">
                <span className="font-semibold">Verify Credential</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </div>
            </motion.a>
          ))}
        </div>

        {certificates.length === 0 && (
          <div className="text-center py-12 rounded-2xl border border-zinc-800 bg-zinc-900/30">
            <p className="text-zinc-400 text-sm">No certificates added yet.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAdmin}
              className="mt-3 text-xs border-zinc-700"
            >
              Add Your First Certificate
            </Button>
          </div>
        )}

      </div>
    </section>
  );
}
