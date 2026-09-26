import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  FileText, 
  Sliders, 
  ExternalLink, 
  Code2,
  Sparkles,
  Lock,
  Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortfolioData } from "@/data/portfolio";
import { openResumeInNewTab } from "@/lib/resumeHelper";

interface NavbarProps {
  portfolio: PortfolioData;
  onOpenAdmin: () => void;
  activeSection: string;
  isOwnerUnlocked?: boolean;
  onOpenResume?: () => void;
}

export function Navbar({ portfolio, onOpenAdmin, activeSection, isOwnerUnlocked = false, onOpenResume }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const clickCountRef = React.useRef(0);
  const clickTimeoutRef = React.useRef<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSecretLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    handleNavClick(e, "#hero");
    clickCountRef.current += 1;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onOpenAdmin();
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 700);
    }
  };

  const navItems = [
    { label: "About", href: "#about", id: "about" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "Learning", href: "#learning", id: "learning" },
    { label: "Skills", href: "#skills", id: "skills" },
    { label: "Certificates", href: "#certificates", id: "certificates" },
    { label: "Contact", href: "#contact", id: "contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 shadow-lg shadow-black/20 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Initials with secret triple-click for owner login */}
          <a
            href="#hero"
            onClick={handleSecretLogoClick}
            className="group flex items-center gap-2.5 text-foreground focus:outline-none cursor-pointer"
            title={portfolio.name}
            aria-label="Back to top"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-700/70 text-zinc-100 font-bold shadow-inner group-hover:border-zinc-500 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all">
              <span className="text-sm font-semibold tracking-wider bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                {portfolio.shortName || "YN"}
              </span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors">
                {portfolio.name}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono tracking-wide">
                {portfolio.role}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 rounded-full bg-zinc-900/60 border border-zinc-800/80 px-3 py-1.5 backdrop-blur-md shadow-inner">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? "text-white font-semibold bg-zinc-800/90 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Resume Button */}
            <button
              onClick={() => {
                if (onOpenResume) {
                  onOpenResume();
                } else {
                  openResumeInNewTab(portfolio.resume || "/resume.pdf");
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all shadow-sm cursor-pointer"
              title="Open Resume PDF Viewer"
            >
              <FileText className="h-3.5 w-3.5 text-zinc-400" />
              <span>Resume</span>
              <ExternalLink className="h-3 w-3 text-zinc-500" />
            </button>

            {/* Owner Mode Toggle Button - ONLY shown when owner is unlocked */}
            {isOwnerUnlocked && (
              <Button
                onClick={onOpenAdmin}
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs font-semibold border-emerald-500/50 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                title="Owner Mode Active - Click to Edit Portfolio"
              >
                <Unlock className="h-3.5 w-3.5 text-emerald-400" />
                <span>Owner Mode: ON</span>
              </Button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {isOwnerUnlocked && (
              <Button
                onClick={onOpenAdmin}
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs font-semibold gap-1.5 border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                title="Owner Mode"
              >
                <Unlock className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px]">Owner: ON</span>
              </Button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[60px] z-30 md:hidden bg-zinc-950/95 border-b border-zinc-800/90 backdrop-blur-2xl px-6 py-6 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-zinc-800 text-white font-semibold"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
                  </a>
                );
              })}

              <div className="h-px w-full bg-zinc-800 my-2" />

              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenResume) {
                      onOpenResume();
                    } else {
                      openResumeInNewTab(portfolio.resume || "/resume.pdf");
                    }
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800 cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-amber-400" />
                  <span>View Resume</span>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
                </button>

                {isOwnerUnlocked && (
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    variant="outline"
                    className="w-full gap-2 text-sm font-semibold border-emerald-500/50 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                  >
                    <Unlock className="h-4 w-4 text-emerald-400" />
                    <span>Owner Mode: ON (Edit Content)</span>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
