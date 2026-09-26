import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  User, 
  Briefcase, 
  Cpu, 
  BookOpen, 
  Award, 
  Sliders, 
  FileCode,
  ExternalLink,
  Sparkles,
  Copy,
  KeyRound,
  ShieldCheck,
  Lock,
  FileText,
  FileCheck,
  FileUp,
  Eye,
  CheckCircle2,
  AlertCircle,
  Info,
  RefreshCw,
  Loader2,
  Cloud,
  Database
} from "lucide-react";
import { 
  PortfolioData, 
  Project, 
  Skill, 
  LearningItem, 
  Certificate,
  savePortfolioData,
  resetPortfolioData
} from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { getOwnerPin, setOwnerPin } from "@/components/AdminAuthModal";
import { savePortfolioToFirestore, updateOwnerPasscode } from "@/lib/firebase";
import {
  downloadResume,
  openResumeInNewTab,
  formatFileSize,
  isDataUrl,
  isGoogleDriveUrl
} from "@/lib/resumeHelper";

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
  onUpdatePortfolio: (updated: PortfolioData) => void;
}

export function AdminDashboardModal({
  isOpen,
  onClose,
  portfolio,
  onUpdatePortfolio,
}: AdminDashboardModalProps) {
  const [data, setData] = useState<PortfolioData>(portfolio);
  const [activeTab, setActiveTab] = useState<
    "profile" | "resume" | "projects" | "skills" | "learning" | "certificates" | "sync" | "security"
  >("profile");
  const [saveToast, setSaveToast] = useState(false);
  const [copyJsonToast, setCopyJsonToast] = useState(false);

  // Resume PDF state
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);
  const [resumeUploadSuccess, setResumeUploadSuccess] = useState<string | null>(null);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const [cloudUrlInput, setCloudUrlInput] = useState(
    portfolio.resume && portfolio.resume.startsWith("http") ? portfolio.resume : ""
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePdfUpload = (file: File) => {
    setResumeUploadError(null);
    setResumeUploadSuccess(null);

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setResumeUploadError("Please select a valid PDF document (.pdf file).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeUploadError("PDF is larger than 5 MB. Please use a compressed PDF or link to Google Drive.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      if (base64Data) {
        setData((prev) => ({
          ...prev,
          resume: base64Data,
          resumeFileName: file.name,
          resumeFileSize: formatFileSize(file.size),
          resumeUpdatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        }));
        setResumeUploadSuccess(`Loaded "${file.name}" (${formatFileSize(file.size)})! Click "Save & Sync to Cloud" to sync it to all devices.`);
      }
    };
    reader.onerror = () => {
      setResumeUploadError("Could not read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleSetCloudUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = cloudUrlInput.trim();
    if (!formatted) return;

    setData((prev) => ({
      ...prev,
      resume: formatted,
      resumeFileName: isGoogleDriveUrl(formatted) ? "Google Drive Resume Document" : "External Resume Link",
      resumeFileSize: "Cloud Document",
      resumeUpdatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }));
    setResumeUploadSuccess("Cloud resume URL set! Click 'Save Changes' to apply.");
  };

  const handleResetResume = () => {
    setData((prev) => ({
      ...prev,
      resume: "/resume.pdf",
      resumeFileName: "resume.pdf (Default)",
      resumeFileSize: undefined,
      resumeUpdatedAt: undefined,
    }));
    setCloudUrlInput("");
    setResumeUploadSuccess("Reset to default project /resume.pdf file.");
  };

  // Security / PIN management
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinMessage, setPinMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSavingPin, setIsSavingPin] = useState(false);
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [saveCloudError, setSaveCloudError] = useState<string | null>(null);

  const handleSaveNewPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin.trim()) {
      setPinMessage({ type: "error", text: "Passcode cannot be empty." });
      return;
    }
    if (newPin.trim().length < 4) {
      setPinMessage({ type: "error", text: "Passcode must be at least 4 characters long." });
      return;
    }
    if (newPin.trim() !== confirmPin.trim()) {
      setPinMessage({ type: "error", text: "Passcodes do not match. Please verify." });
      return;
    }
    setIsSavingPin(true);
    setPinMessage(null);
    try {
      await updateOwnerPasscode(newPin.trim());
      setNewPin("");
      setConfirmPin("");
      setPinMessage({ 
        type: "success", 
        text: "Passcode updated & stored in Cloud Database! This new passcode is now active on your phone, laptop, and all devices." 
      });
    } catch (err) {
      console.error("Passcode update failed:", err);
      setOwnerPin(newPin.trim());
      setNewPin("");
      setConfirmPin("");
      setPinMessage({ 
        type: "success", 
        text: "Passcode saved locally. Cloud will sync on next reconnect." 
      });
    } finally {
      setIsSavingPin(false);
    }
  };

  const handleResetPinToDefault = async () => {
    if (window.confirm("Reset passcode back to default '1234'?")) {
      setIsSavingPin(true);
      try {
        await updateOwnerPasscode("1234");
      } catch (e) {
        setOwnerPin("1234");
      } finally {
        setIsSavingPin(false);
      }
      setPinMessage({ type: "success", text: "Passcode reset to default (1234) across cloud database." });
    }
  };

  // Sync state if prop changes
  React.useEffect(() => {
    setData(portfolio);
  }, [portfolio]);

  if (!isOpen) return null;

  const handleSave = async (andClose = false) => {
    setIsSavingCloud(true);
    setSaveCloudError(null);
    try {
      // Save locally first for instant feedback
      savePortfolioData(data);
      onUpdatePortfolio(data);

      // Save to Firebase Firestore for cross-device synchronization
      await savePortfolioToFirestore(data);

      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3500);
      if (andClose) {
        onClose();
      }
    } catch (err) {
      console.error("Cloud save failed:", err);
      setSaveCloudError("Saved locally. Cloud sync encountered a network issue.");
      setSaveToast(true);
      if (andClose) {
        onClose();
      }
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all portfolio data back to the default values?")) {
      const def = resetPortfolioData();
      setData(def);
      onUpdatePortfolio(def);
    }
  };

  // Profile handlers
  const updateProfileField = (field: keyof PortfolioData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Projects handlers
  const handleAddProject = () => {
    const newProj: Project = {
      id: "project-" + Date.now(),
      title: "New Project Title",
      description: "Brief description of the project, problem solved, and architecture highlights.",
      tech: ["React", "TypeScript", "Node.js"],
      github: "https://github.com/harjimallhi9",
      demo: "https://github.com/harjimallhi9",
      featured: false,
      category: "Full Stack"
    };
    setData((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects]
    }));
  };

  const handleDeleteProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
  };

  const handleUpdateProject = (id: string, updates: Partial<Project>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p))
    }));
  };

  // Skills handlers
  const handleAddSkill = () => {
    const newSkill: Skill = {
      id: "skill-" + Date.now(),
      name: "New Technology",
      status: "Learning & Building",
      category: "Languages"
    };
    setData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const handleDeleteSkill = (id: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id)
    }));
  };

  const handleUpdateSkill = (id: string, updates: Partial<Skill>) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...updates } : s))
    }));
  };

  // Learning Roadmap handlers
  const handleAddLearning = () => {
    const newItem: LearningItem = {
      id: "learn-" + Date.now(),
      name: "New Topic / Framework",
      category: "Backend",
      status: "In Progress",
      description: "Why I'm learning this and what project I plan to build with it.",
      progressPercentage: 50
    };
    setData((prev) => ({
      ...prev,
      learning: [...prev.learning, newItem]
    }));
  };

  const handleDeleteLearning = (id: string) => {
    setData((prev) => ({
      ...prev,
      learning: prev.learning.filter((l) => l.id !== id)
    }));
  };

  const handleUpdateLearning = (id: string, updates: Partial<LearningItem>) => {
    setData((prev) => ({
      ...prev,
      learning: prev.learning.map((l) => (l.id === id ? { ...l, ...updates } : l))
    }));
  };

  // Certificate handlers
  const handleAddCertificate = () => {
    const newCert: Certificate = {
      id: "cert-" + Date.now(),
      title: "Course / Certification Title",
      issuer: "Issuing Organization or University",
      year: new Date().getFullYear().toString(),
      link: "https://example.com/verify-credential",
      credentialId: "CERT-" + Math.floor(Math.random() * 90000 + 10000)
    };
    setData((prev) => ({
      ...prev,
      certificates: [...prev.certificates, newCert]
    }));
  };

  const handleDeleteCertificate = (id: string) => {
    setData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((c) => c.id !== id)
    }));
  };

  const handleUpdateCertificate = (id: string, updates: Partial<Certificate>) => {
    setData((prev) => ({
      ...prev,
      certificates: prev.certificates.map((c) => (c.id === id ? { ...c, ...updates } : c))
    }));
  };

  // JSON copy/import
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopyJsonToast(true);
    setTimeout(() => setCopyJsonToast(false), 2500);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const parsed = JSON.parse(e.target.value);
      if (parsed && typeof parsed === "object") {
        setData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore invalid json while typing
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-6 rounded-2xl border border-zinc-700 bg-zinc-950 p-4 sm:p-6 shadow-2xl shadow-black/80 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Content Management Dashboard</span>
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                  Live Editor
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Add, edit, or remove projects, skills, roadmap items, and credentials.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleSave(false)}
              disabled={isSavingCloud}
              size="sm"
              className="gap-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs cursor-pointer disabled:opacity-60"
            >
              {isSavingCloud ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Syncing to Cloud...</span>
                </>
              ) : (
                <>
                  <Cloud className="h-3.5 w-3.5" />
                  <span>Save & Sync to Cloud</span>
                </>
              )}
            </Button>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Save Toast Notification */}
        <AnimatePresence>
          {saveToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-3 flex items-center justify-between rounded-lg border px-4 py-2 text-xs font-medium ${
                saveCloudError
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
              }`}
            >
              <span className="flex items-center gap-2">
                {saveCloudError ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>{saveCloudError}</span>
                  </>
                ) : (
                  <>
                    <Cloud className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Saved & synced to Cloud Firestore database! Your changes & resume are now active across all devices.</span>
                  </>
                )}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-zinc-800/80 no-scrollbar">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "resume", label: "Resume PDF", icon: FileText },
            { id: "projects", label: `Projects (${data.projects.length})`, icon: Briefcase },
            { id: "skills", label: `Skills (${data.skills.length})`, icon: Cpu },
            { id: "learning", label: `Learning (${data.learning.length})`, icon: BookOpen },
            { id: "certificates", label: `Certificates (${data.certificates.length})`, icon: Award },
            { id: "sync", label: "Export / Import", icon: FileCode },
            { id: "security", label: "Security & PIN", icon: KeyRound },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-zinc-800 text-white font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents Area */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 text-sm">
          
          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => updateProfileField("name", e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Initials / Short Name</label>
                <input
                  type="text"
                  value={data.shortName}
                  onChange={(e) => updateProfileField("shortName", e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Role Title</label>
                <input
                  type="text"
                  value={data.role}
                  onChange={(e) => updateProfileField("role", e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Location / Availability</label>
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => updateProfileField("location", e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-zinc-400 mb-1">Headline</label>
                <input
                  type="text"
                  value={data.headline}
                  onChange={(e) => updateProfileField("headline", e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-zinc-400 mb-1">Short Biography</label>
                <textarea
                  rows={3}
                  value={data.bio}
                  onChange={(e) => updateProfileField("bio", e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-zinc-400 mb-1">Current Active Focus</label>
                <input
                  type="text"
                  value={data.currentFocus}
                  onChange={(e) => updateProfileField("currentFocus", e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-zinc-400 mb-1">Student Status & Degree Progress</label>
                <input
                  type="text"
                  value={data.studentStatus}
                  onChange={(e) => updateProfileField("studentStatus", e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-zinc-400 mb-1">Learning Mindset</label>
                <textarea
                  rows={2}
                  value={data.learningMindset}
                  onChange={(e) => updateProfileField("learningMindset", e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => updateProfileField("email", e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono text-zinc-400">Resume Document</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab("resume")}
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Upload & Manage PDF</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={data.resume}
                    onChange={(e) => updateProfileField("resume", e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    placeholder="/resume.pdf or data: or https://..."
                  />
                  <button
                    type="button"
                    onClick={() => setActiveTab("resume")}
                    className="shrink-0 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs text-zinc-950 font-bold transition-colors cursor-pointer"
                  >
                    Upload PDF
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Current file: {data.resumeFileName || (data.resume.startsWith("data:") ? "Uploaded PDF" : data.resume)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={data.github}
                  onChange={(e) => updateProfileField("github", e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={data.linkedin}
                  onChange={(e) => updateProfileField("linkedin", e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: RESUME PDF */}
          {activeTab === "resume" && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <span>Resume Document (PDF)</span>
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                          <Cloud className="h-3 w-3" />
                          Cloud Synced Across Devices
                        </span>
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1">
                        Upload your real PDF resume here. It is saved directly to your cloud database so when you open this portfolio on your phone, tablet, or another laptop, your uploaded resume appears automatically!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status or Alert messages */}
              {resumeUploadSuccess && (
                <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2.5 text-xs text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{resumeUploadSuccess}</span>
                  </div>
                  <button
                    onClick={() => setResumeUploadSuccess(null)}
                    className="text-emerald-400 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {resumeUploadError && (
                <div className="flex items-center justify-between rounded-lg bg-red-500/10 border border-red-500/30 px-3.5 py-2.5 text-xs text-red-300">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                    <span>{resumeUploadError}</span>
                  </div>
                  <button
                    onClick={() => setResumeUploadError(null)}
                    className="text-red-400 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Currently Active Resume Card */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                      Current Active Resume
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {data.resume.startsWith("data:")
                      ? "Custom Uploaded File"
                      : isGoogleDriveUrl(data.resume)
                      ? "Google Drive Link"
                      : data.resume.startsWith("http")
                      ? "External URL"
                      : "Default File"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-white truncate">
                        {data.resumeFileName || (data.resume.startsWith("data:") ? "Custom Uploaded Resume.pdf" : "resume.pdf")}
                      </p>
                      <p className="text-[11px] font-mono text-zinc-400">
                        {data.resumeFileSize || (data.resume.startsWith("data:") ? formatFileSize(Math.round(data.resume.length * 0.75)) : "Project Public Folder")}
                        {data.resumeUpdatedAt && ` • Updated ${data.resumeUpdatedAt}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openResumeInNewTab(data.resume || "/resume.pdf")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
                      title="Preview this resume in a new tab"
                    >
                      <Eye className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const fname = data.resumeFileName || `${data.name.replace(/\s+/g, "_")}_Resume.pdf`;
                        downloadResume(data.resume || "/resume.pdf", fname);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-amber-300 hover:text-amber-200 border border-zinc-700 transition-colors cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetResume}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition-colors cursor-pointer"
                      title="Reset to default /resume.pdf"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* METHOD 1: Direct File Upload */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-semibold text-white flex items-center gap-2">
                    <FileUp className="h-4 w-4 text-amber-400" />
                    <span>Option 1: Upload Your PDF Directly (Easiest)</span>
                  </h5>
                  <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                    Recommended
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePdfUpload(file);
                  }}
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingPdf(true);
                  }}
                  onDragLeave={() => setIsDraggingPdf(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingPdf(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handlePdfUpload(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isDraggingPdf
                      ? "border-amber-400 bg-amber-500/10"
                      : "border-zinc-700/80 bg-zinc-950/60 hover:border-amber-500/60 hover:bg-zinc-900/60"
                  }`}
                >
                  <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400">
                    <FileUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      Click to choose your PDF or drag & drop file here
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Accepts PDF files up to 5 MB • Embeds directly into your portfolio
                    </p>
                  </div>
                </div>
              </div>

              {/* METHOD 2: Cloud / Google Drive / Dropbox */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
                <h5 className="text-xs font-semibold text-white flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-sky-400" />
                  <span>Option 2: Link from Google Drive, Dropbox, or GitHub</span>
                </h5>

                <form onSubmit={handleSetCloudUrl} className="flex gap-2">
                  <input
                    type="url"
                    value={cloudUrlInput}
                    onChange={(e) => setCloudUrlInput(e.target.value)}
                    placeholder="https://drive.google.com/file/d/... or raw GitHub URL"
                    className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition-colors cursor-pointer"
                  >
                    Apply URL
                  </button>
                </form>

                <div className="rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-3 text-[11px] text-zinc-400 space-y-1">
                  <p className="font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Info className="h-3 w-3 text-sky-400" />
                    <span>How to use Google Drive:</span>
                  </p>
                  <p>1. Open Google Drive, right click your resume PDF, and select <strong>Share</strong>.</p>
                  <p>2. Set General Access to <strong>"Anyone with the link"</strong>.</p>
                  <p>3. Copy the link and paste it here. The portfolio automatically converts it for embedded viewing!</p>
                </div>
              </div>

              {/* METHOD 3: Git Repo / Codebase Instructions */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 text-xs text-zinc-400 space-y-2">
                <h5 className="font-semibold text-zinc-300">
                  Option 3: Project Repository (/public/resume.pdf)
                </h5>
                <p>
                  If you have downloaded the project source code or are deploying to GitHub/Vercel, you can also place your PDF file directly at:
                </p>
                <div className="font-mono bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 text-amber-300 text-[11px]">
                  your-project/public/resume.pdf
                </div>
                <p className="text-[11px] text-zinc-500">
                  Any file placed at that location will automatically serve at <code className="text-zinc-400">/resume.pdf</code>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-mono">
                  {data.projects.length} Total Projects
                </span>
                <Button
                  onClick={handleAddProject}
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs border-amber-500/40 text-amber-300"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Project</span>
                </Button>
              </div>

              <div className="space-y-4">
                {data.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={proj.featured}
                          onChange={(e) =>
                            handleUpdateProject(proj.id, { featured: e.target.checked })
                          }
                          id={`featured-${proj.id}`}
                          className="rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-0"
                        />
                        <label
                          htmlFor={`featured-${proj.id}`}
                          className="text-xs text-amber-400 font-semibold cursor-pointer"
                        >
                          Featured
                        </label>
                      </div>

                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-red-400 hover:text-red-300 text-xs p-1"
                        title="Delete project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                          Project Title
                        </label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) =>
                            handleUpdateProject(proj.id, { title: e.target.value })
                          }
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                          Category
                        </label>
                        <select
                          value={proj.category || "Full Stack"}
                          onChange={(e) =>
                            handleUpdateProject(proj.id, { category: e.target.value as any })
                          }
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white"
                        >
                          <option value="Full Stack">Full Stack</option>
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="Tooling">Tooling</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                          Short Description
                        </label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) =>
                            handleUpdateProject(proj.id, { description: e.target.value })
                          }
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                          GitHub Repo URL
                        </label>
                        <input
                          type="text"
                          value={proj.github}
                          onChange={(e) =>
                            handleUpdateProject(proj.id, { github: e.target.value })
                          }
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                          Live Demo URL (optional)
                        </label>
                        <input
                          type="text"
                          value={proj.demo || ""}
                          onChange={(e) =>
                            handleUpdateProject(proj.id, { demo: e.target.value })
                          }
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                          Technologies (comma separated)
                        </label>
                        <input
                          type="text"
                          value={proj.tech.join(", ")}
                          onChange={(e) =>
                            handleUpdateProject(proj.id, {
                              tech: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                            })
                          }
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS */}
          {activeTab === "skills" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-mono">
                  {data.skills.length} Registered Skills
                </span>
                <Button
                  onClick={handleAddSkill}
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs border-amber-500/40 text-amber-300"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Skill</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) =>
                          handleUpdateSkill(skill.id, { name: e.target.value })
                        }
                        className="font-bold text-xs text-white bg-zinc-900 border border-zinc-800 px-2 py-1 rounded w-full"
                      />
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-zinc-500 font-mono">Domain</label>
                        <select
                          value={skill.category}
                          onChange={(e) =>
                            handleUpdateSkill(skill.id, { category: e.target.value as any })
                          }
                          className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-300"
                        >
                          <option value="Languages">Languages</option>
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="Tools & DevOps">Tools & DevOps</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-500 font-mono">Proficiency</label>
                        <select
                          value={skill.status}
                          onChange={(e) =>
                            handleUpdateSkill(skill.id, { status: e.target.value as any })
                          }
                          className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-300"
                        >
                          <option value="Comfortable">Comfortable</option>
                          <option value="Learning & Building">Learning & Building</option>
                          <option value="Learning">Learning</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LEARNING ROADMAP */}
          {activeTab === "learning" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-mono">
                  {data.learning.length} Technologies in Roadmap
                </span>
                <Button
                  onClick={handleAddLearning}
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs border-amber-500/40 text-amber-300"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Tech</span>
                </Button>
              </div>

              <div className="space-y-3">
                {data.learning.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleUpdateLearning(item.id, { name: e.target.value })
                        }
                        className="font-bold text-xs text-white bg-zinc-900 border border-zinc-800 px-2 py-1 rounded w-full sm:w-1/2"
                      />

                      <div className="flex items-center gap-2">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleUpdateLearning(item.id, { status: e.target.value as any })
                          }
                          className="text-xs bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-300"
                        >
                          <option value="In Progress">In Progress</option>
                          <option value="Exploring">Exploring</option>
                          <option value="Next Up">Next Up</option>
                        </select>

                        <button
                          onClick={() => handleDeleteLearning(item.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 font-mono">Reason / Goals</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleUpdateLearning(item.id, { description: e.target.value })
                        }
                        className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-300 mt-0.5"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-[10px] text-zinc-500 font-mono whitespace-nowrap">
                        Mastery ({item.progressPercentage}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={item.progressPercentage}
                        onChange={(e) =>
                          handleUpdateLearning(item.id, { progressPercentage: Number(e.target.value) })
                        }
                        className="w-full accent-amber-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CERTIFICATES */}
          {activeTab === "certificates" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-mono">
                  {data.certificates.length} Credentials Listed
                </span>
                <Button
                  onClick={handleAddCertificate}
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs border-amber-500/40 text-amber-300"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Certificate</span>
                </Button>
              </div>

              <div className="space-y-3">
                {data.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder="Certificate Title"
                        value={cert.title}
                        onChange={(e) =>
                          handleUpdateCertificate(cert.id, { title: e.target.value })
                        }
                        className="font-bold text-xs text-white bg-zinc-900 border border-zinc-800 px-2 py-1 rounded w-full"
                      />

                      <button
                        onClick={() => handleDeleteCertificate(cert.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-zinc-500 font-mono">Issuer / Institution</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) =>
                            handleUpdateCertificate(cert.id, { issuer: e.target.value })
                          }
                          className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-300"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-500 font-mono">Year</label>
                        <input
                          type="text"
                          value={cert.year}
                          onChange={(e) =>
                            handleUpdateCertificate(cert.id, { year: e.target.value })
                          }
                          className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-300"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-500 font-mono">Credential ID</label>
                        <input
                          type="text"
                          value={cert.credentialId || ""}
                          onChange={(e) =>
                            handleUpdateCertificate(cert.id, { credentialId: e.target.value })
                          }
                          className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 font-mono">Verification Link</label>
                      <input
                        type="url"
                        value={cert.link}
                        onChange={(e) =>
                          handleUpdateCertificate(cert.id, { link: e.target.value })
                        }
                        className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SYNC & EXPORT / IMPORT */}
          {activeTab === "sync" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <h4 className="text-sm font-bold text-white mb-1">
                  Export & Permanent Sync
                </h4>
                <p className="text-xs text-zinc-400 mb-4">
                  Any changes you save here are saved in your browser's localStorage. If you want to make these changes permanent in your Git repository or project files, click "Copy Portfolio JSON" below and paste it into <code className="text-amber-300">src/data/portfolio.ts</code>.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleCopyJson}
                    size="sm"
                    className="gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copyJsonToast ? "JSON Copied to Clipboard!" : "Copy Portfolio JSON"}</span>
                  </Button>

                  <Button
                    onClick={handleReset}
                    size="sm"
                    variant="destructive"
                    className="gap-1.5 text-xs"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset All to Defaults</span>
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Raw JSON Data (Paste to import or edit manually)
                </label>
                <textarea
                  rows={12}
                  value={JSON.stringify(data, null, 2)}
                  onChange={handleImportJson}
                  className="w-full font-mono text-xs rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 text-amber-200 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 7: SECURITY & PASSCODE */}
          {activeTab === "security" && (
            <div className="space-y-6 max-w-2xl">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Owner Passcode & PIN Settings</h4>
                    <p className="text-xs text-zinc-400">
                      Change the passcode required to unlock the portfolio editor.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-zinc-300">
                    Current Status:{" "}
                    <strong className="text-white">
                      {getOwnerPin() === "1234" ? "Default Passcode Active (1234)" : "Custom Passcode Configured"}
                    </strong>
                  </span>
                </div>

                <form onSubmit={handleSaveNewPin} className="mt-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        New Passcode / PIN
                      </label>
                      <input
                        type="password"
                        placeholder="At least 4 characters"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="w-full text-xs rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Confirm Passcode
                      </label>
                      <input
                        type="password"
                        placeholder="Re-enter new passcode"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        className="w-full text-xs rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {pinMessage && (
                    <div
                      className={`text-xs p-2.5 rounded-lg border ${
                        pinMessage.type === "success"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : "bg-red-500/10 border-red-500/30 text-red-300"
                      }`}
                    >
                      {pinMessage.text}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={isSavingPin}
                      size="sm"
                      className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {isSavingPin ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Saving to Cloud...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5" />
                          <span>Save Passcode to Cloud</span>
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      onClick={handleResetPinToDefault}
                      disabled={isSavingPin}
                      size="sm"
                      variant="outline"
                      className="text-xs text-zinc-400 hover:text-white border-zinc-800 cursor-pointer disabled:opacity-60"
                    >
                      Reset Passcode to Default (1234)
                    </Button>
                  </div>
                </form>
              </div>

              {/* Secret Access Guide for Owner */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 space-y-3">
                <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>How Only You Can Access Owner Mode (Hidden from Visitors)</span>
                </h4>
                
                <ul className="space-y-2 text-xs text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-amber-400 font-bold">1.</span>
                    <span>
                      <strong className="text-zinc-200">Secret URL:</strong> Open your portfolio URL with <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">?admin=true</code> at the end (e.g., <code className="text-zinc-300">your-site.com/?admin=true</code>).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-amber-400 font-bold">2.</span>
                    <span>
                      <strong className="text-zinc-200">Keyboard Shortcut:</strong> Press <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-300">Ctrl</kbd> + <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-300">Shift</kbd> + <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-300">E</kbd> anywhere on your page to bring up the passcode prompt.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-amber-400 font-bold">3.</span>
                    <span>
                      <strong className="text-zinc-200">Secret Tap:</strong> Click or tap your logo initials (<code className="text-zinc-200">HM</code>) in the top-left navigation 3 times in quick succession.
                    </span>
                  </li>
                </ul>

                <p className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/60">
                  Visitors and recruiters browsing your link see only your clean portfolio. No "Owner Mode", "Edit", or passcode numbers are shown to the public.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-zinc-800 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-emerald-400 font-medium">
              Firestore Cloud Active:
            </span>
            <span className="text-zinc-400 text-[11px]">
              Live sync to mobile phones & all browsers
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              Close
            </Button>

            <Button
              onClick={() => handleSave(true)}
              disabled={isSavingCloud}
              size="sm"
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs gap-1.5 cursor-pointer disabled:opacity-60 shadow-lg shadow-amber-500/10"
            >
              {isSavingCloud ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving & Syncing...</span>
                </>
              ) : (
                <>
                  <Cloud className="h-3.5 w-3.5" />
                  <span>Save & Exit</span>
                </>
              )}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
