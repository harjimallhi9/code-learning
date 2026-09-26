import React, { useEffect, useState } from "react";
import { 
  X, 
  Download, 
  ExternalLink, 
  FileText, 
  Check, 
  Copy, 
  Mail, 
  Maximize2,
  FileCheck
} from "lucide-react";
import { 
  getSafeResumeUrl, 
  downloadResume, 
  openResumeInNewTab,
  isGoogleDriveUrl
} from "@/lib/resumeHelper";
import { PortfolioData } from "@/data/portfolio";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
}

export function ResumeModal({ isOpen, onClose, portfolio }: ResumeModalProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [safeBlobUrl, setSafeBlobUrl] = useState<string>("");

  useEffect(() => {
    if (!isOpen) return;

    const url = getSafeResumeUrl(portfolio.resume || "/resume.pdf");
    setSafeBlobUrl(url);

    // Escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // Clean up blob URL if it was created
      if (url.startsWith("blob:")) {
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    };
  }, [isOpen, portfolio.resume]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolio.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleDownload = () => {
    const formattedName = (portfolio.name || "Harji_Mallhi").replace(/\s+/g, "_") + "_Resume.pdf";
    downloadResume(portfolio.resume || "/resume.pdf", formattedName);
  };

  const handleOpenNewTab = () => {
    openResumeInNewTab(portfolio.resume || "/resume.pdf");
  };

  const isDrive = isGoogleDriveUrl(portfolio.resume || "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative flex flex-col w-full max-w-5xl h-[92vh] max-h-[950px] rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                  {portfolio.name} — Resume
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-300">
                  <FileCheck className="h-3 w-3 text-emerald-400" />
                  PDF
                </span>
              </div>
              <p className="text-xs text-zinc-400 truncate">
                {portfolio.role} • {portfolio.studentStatus || "Computer Science"}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-amber-400 transition-colors shadow-sm cursor-pointer"
              title="Download Resume PDF file to your device"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">Download</span>
            </button>

            <button
              onClick={handleOpenNewTab}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
              title="Open full PDF in a new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open in New Tab</span>
            </button>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer ml-1"
              title="Close viewer (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="relative flex-1 bg-zinc-900 overflow-hidden flex flex-col">
          {safeBlobUrl ? (
            <iframe
              src={safeBlobUrl}
              className="w-full h-full border-0 bg-zinc-950"
              title={`${portfolio.name} Resume PDF Preview`}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-zinc-400">
              <FileText className="h-12 w-12 text-zinc-600 mb-3 animate-pulse" />
              <p className="text-sm">Preparing resume document...</p>
            </div>
          )}

          {/* If Google Drive or iframe doesn't render, provide floating helper */}
          {isDrive && (
            <div className="absolute top-2 right-2 bg-zinc-950/90 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300 flex items-center gap-2 shadow-lg backdrop-blur-sm">
              <span>Google Drive hosted document</span>
              <button
                onClick={handleOpenNewTab}
                className="text-amber-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Direct Link</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Quick Contact Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2.5 border-t border-zinc-800 bg-zinc-950 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span>Interested in hiring or discussing opportunities?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 rounded bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
            >
              {copiedEmail ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-zinc-400" />
                  <span>{portfolio.email}</span>
                </>
              )}
            </button>
            <a
              href={`mailto:${portfolio.email}?subject=Opportunity%20Inquiry%20via%20Portfolio`}
              className="inline-flex items-center gap-1.5 rounded bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 text-zinc-200 hover:text-white transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-amber-400" />
              <span>Send Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
