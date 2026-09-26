import React, { useState, useEffect } from "react";
import { 
  loadPortfolioData, 
  savePortfolioData,
  PortfolioData, 
  initialPortfolioData 
} from "@/data/portfolio";
import { 
  fetchPortfolioFromFirestore, 
  savePortfolioToFirestore, 
  validateFirestoreConnection,
  updateOwnerPasscode 
} from "@/lib/firebase";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { LearningSection } from "@/components/LearningSection";
import { SkillsSection } from "@/components/SkillsSection";
import { CertificatesSection } from "@/components/CertificatesSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { AdminAuthModal } from "@/components/AdminAuthModal";
import { AdminDashboardModal } from "@/components/AdminDashboardModal";
import { ResumeModal } from "@/components/ResumeModal";
import HeroSection from "@/components/ui/glassmorphism-trust-hero";
import { Sliders, Sparkles, LayoutTemplate, ShieldCheck, Lock, Unlock, Check, Cloud } from "lucide-react";

export default function App() {
  const [portfolio, setPortfolio] = useState<PortfolioData>(loadPortfolioData);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("admin") === "true") return true;
      return localStorage.getItem("portfolio_owner_unlocked") === "true";
    }
    return false;
  });
  const [activeSection, setActiveSection] = useState("hero");
  const [showTrustHeroView, setShowTrustHeroView] = useState(false);
  const [cloudSynced, setCloudSynced] = useState(false);

  // Firestore sync and migration on app boot
  useEffect(() => {
    let isMounted = true;

    async function syncCloudState() {
      try {
        await validateFirestoreConnection();
        const cloudData = await fetchPortfolioFromFirestore();

        if (!isMounted) return;

        if (cloudData) {
          // Cloud data exists, sync to state & local cache
          setPortfolio(cloudData);
          savePortfolioData(cloudData);
          setCloudSynced(true);
        } else {
          // No cloud data yet: migrate existing local custom data to Firestore so it becomes available across devices
          const localData = loadPortfolioData();
          const hasCustomResume = localData.resume && localData.resume !== initialPortfolioData.resume;
          const hasCustomData = localData.name !== initialPortfolioData.name || hasCustomResume;

          if (hasCustomData) {
            await savePortfolioToFirestore(localData);
          } else {
            // Seed defaults to cloud
            await savePortfolioToFirestore(initialPortfolioData);
          }
          setCloudSynced(true);

          // If user previously set a custom pin locally, migrate it to Firestore
          const localPin = localStorage.getItem("portfolio_owner_pin");
          if (localPin && localPin !== "1234") {
            await updateOwnerPasscode(localPin).catch(() => {});
          }
        }
      } catch (err) {
        console.warn("Cloud synchronization error on startup:", err);
      }
    }

    syncCloudState();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("admin") === "true" || urlParams.get("owner") === "true" || urlParams.get("edit") === "true") {
      if (!isOwnerUnlocked) {
        setIsAuthOpen(true);
      }
    }
  }, [isOwnerUnlocked]);

  // Keyboard shortcut Ctrl+Shift+E to toggle owner login
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "e") || (e.altKey && e.key.toLowerCase() === "e")) {
        e.preventDefault();
        if (isOwnerUnlocked) {
          setIsAdminOpen((prev) => !prev);
        } else {
          setIsAuthOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOwnerUnlocked]);

  // Active section tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "projects", "learning", "skills", "certificates", "contact"];
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRequestAdmin = () => {
    if (isOwnerUnlocked) {
      setIsAdminOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleUnlockSuccess = () => {
    setIsOwnerUnlocked(true);
    localStorage.setItem("portfolio_owner_unlocked", "true");
    setIsAuthOpen(false);
    setIsAdminOpen(true);
  };

  const handleLockOwner = () => {
    setIsOwnerUnlocked(false);
    localStorage.removeItem("portfolio_owner_unlocked");
    setIsAdminOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-foreground selection:bg-amber-400 selection:text-zinc-950">
      
      {/* Top Banner when Owner Mode is Unlocked */}
      {isOwnerUnlocked && (
        <div className="sticky top-0 z-50 bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-2 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">Owner Mode Active:</span>
            <span className="hidden sm:inline text-zinc-300">
              You can edit projects, skills, certificates & personal bio.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-white underline cursor-pointer"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Open Content Editor</span>
            </button>
            <span className="text-zinc-600">|</span>
            <button
              onClick={handleLockOwner}
              className="rounded-md bg-zinc-900 border border-zinc-700 px-2.5 py-0.5 text-[11px] text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Switch to standard visitor view"
            >
              Lock / View as Visitor
            </button>
          </div>
        </div>
      )}

      {/* Sticky Top Navbar */}
      <Navbar
        portfolio={portfolio}
        onOpenAdmin={handleRequestAdmin}
        activeSection={activeSection}
        isOwnerUnlocked={isOwnerUnlocked}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Floating Owner Mode Pill - ONLY visible when owner has unlocked */}
      {isOwnerUnlocked && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-1.5 p-1 rounded-full border border-amber-500/50 bg-zinc-900/95 backdrop-blur-xl shadow-2xl shadow-black/80">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition-all shadow-md cursor-pointer"
            title="Open Content Editor"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Edit Portfolio</span>
          </button>
          <button
            onClick={handleLockOwner}
            className="flex items-center justify-center h-7 w-7 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Lock Owner Mode (Switch to Visitor View)"
          >
            <Lock className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <main className="flex flex-col">
        {/* Conditional Hero rendering or toggle */}
        {showTrustHeroView ? (
          <div className="pt-16">
            <div className="bg-zinc-900/80 border-b border-zinc-800 px-4 py-2 text-center text-xs text-zinc-400 flex items-center justify-center gap-3">
              <span>Previewing <strong>glassmorphism-trust-hero.tsx</strong> component</span>
              <button
                onClick={() => setShowTrustHeroView(false)}
                className="text-amber-400 hover:underline font-semibold"
              >
                Switch back to Student Hero
              </button>
            </div>
            <HeroSection
              onExploreProjects={() => scrollToSection("projects")}
              onContactClick={() => scrollToSection("contact")}
              title={portfolio.headline}
              subtitle={portfolio.bio}
            />
          </div>
        ) : (
          <Hero
            portfolio={portfolio}
            onExploreProjects={() => scrollToSection("projects")}
            onContactClick={() => scrollToSection("contact")}
            onOpenResume={() => setIsResumeOpen(true)}
          />
        )}

        {/* 01 About Section */}
        <AboutSection portfolio={portfolio} />

        {/* 02 Projects Section (Data-Driven, with real GPS Tracker & code-learning repo) */}
        <ProjectsSection
          projects={portfolio.projects}
          onOpenAdmin={handleRequestAdmin}
          isOwnerUnlocked={isOwnerUnlocked}
        />

        {/* 03 Learning Section */}
        <LearningSection
          learning={portfolio.learning}
          onOpenAdmin={handleRequestAdmin}
          isOwnerUnlocked={isOwnerUnlocked}
        />

        {/* 04 Skills Section */}
        <SkillsSection
          skills={portfolio.skills}
          onOpenAdmin={handleRequestAdmin}
          isOwnerUnlocked={isOwnerUnlocked}
        />

        {/* 05 Certificates Section */}
        <CertificatesSection
          certificates={portfolio.certificates}
          onOpenAdmin={handleRequestAdmin}
          isOwnerUnlocked={isOwnerUnlocked}
        />

        {/* 06 Contact Section */}
        <ContactSection 
          portfolio={portfolio} 
          onOpenResume={() => setIsResumeOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        portfolio={portfolio}
        onOpenAdmin={handleRequestAdmin}
        isOwnerUnlocked={isOwnerUnlocked}
      />

      {/* Owner Auth PIN Modal */}
      <AdminAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleUnlockSuccess}
      />

      {/* Content Management Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        portfolio={portfolio}
        onUpdatePortfolio={(updated) => setPortfolio(updated)}
      />

      {/* Interactive Resume PDF Viewer & Downloader Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        portfolio={portfolio}
      />

    </div>
  );
}
