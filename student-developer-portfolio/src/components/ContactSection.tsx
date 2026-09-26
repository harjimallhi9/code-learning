import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  FileText, 
  Github, 
  Linkedin, 
  Copy, 
  Check, 
  MessageSquare, 
  ArrowUpRight, 
  Send,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortfolioData } from "@/data/portfolio";
import { openResumeInNewTab } from "@/lib/resumeHelper";

interface ContactSectionProps {
  portfolio: PortfolioData;
  onOpenResume?: () => void;
}

export function ContactSection({ portfolio, onOpenResume }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const [inquiryType, setInquiryType] = useState("Internship Opportunity");
  const [customMessage, setCustomMessage] = useState("");

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolio.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const inquiryOptions = [
    "Internship Opportunity",
    "Project Collaboration",
    "Open Source Contribution",
    "Coffee / Virtual Chat"
  ];

  const mailtoLink = `mailto:${portfolio.email}?subject=${encodeURIComponent(
    `[Portfolio Inquiry] ${inquiryType}`
  )}&body=${encodeURIComponent(
    customMessage || `Hi ${portfolio.name},\n\nI saw your portfolio and wanted to connect regarding ${inquiryType}.\n\nBest regards,\n`
  )}`;

  return (
    <section id="contact" className="relative py-28 bg-zinc-950 border-t border-zinc-900 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[450px] w-[800px] rounded-full bg-amber-500/5 blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main CTA Box */}
        <div className="rounded-3xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/80 via-zinc-900/40 to-zinc-950/90 p-8 sm:p-12 lg:p-16 backdrop-blur-2xl shadow-2xl text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Available for Opportunities</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Let's connect.
            </h2>

            <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Whether you have an internship opening, a project idea, or simply want to talk code and architecture, my inbox is always open.
            </p>
          </motion.div>

          {/* Inquiry Type Quick Selector */}
          <div className="mt-8 mb-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-zinc-500 font-mono mr-1">Inquiry Topic:</span>
            {inquiryOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setInquiryType(opt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  inquiryType === opt
                    ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Direct Email via mailto */}
            <a
              href={mailtoLink}
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-white px-7 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 shadow-lg shadow-white/10 transition-all hover:scale-[1.02]"
            >
              <Mail className="h-4 w-4 text-zinc-900" />
              <span>Email Me Directly</span>
              <ArrowUpRight className="h-4 w-4 text-zinc-500" />
            </a>

            {/* Copy Email Button */}
            <button
              onClick={handleCopyEmail}
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-zinc-700 bg-zinc-900/80 px-5 text-sm font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-zinc-400" />
                  <span>Copy: {portfolio.email}</span>
                </>
              )}
            </button>

            {/* Resume Button */}
            <button
              onClick={() => {
                if (onOpenResume) {
                  onOpenResume();
                } else {
                  openResumeInNewTab(portfolio.resume || "/resume.pdf");
                }
              }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/60 px-5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
              title="View Resume PDF Document"
            >
              <FileText className="h-4 w-4 text-amber-400" />
              <span>Resume PDF</span>
            </button>
          </div>

          {/* Social Profiles Grid */}
          <div className="mt-12 pt-8 border-t border-zinc-800/80 flex flex-wrap items-center justify-center gap-6 text-sm">
            <a
              href={portfolio.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub Profile</span>
            </a>

            <span className="text-zinc-700">•</span>

            <a
              href={portfolio.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn Network</span>
            </a>

            <span className="text-zinc-700">•</span>

            <span className="text-xs font-mono text-zinc-500">
              Location: {portfolio.location}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
