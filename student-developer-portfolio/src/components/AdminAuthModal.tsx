import React, { useState } from "react";
import { Lock, KeyRound, X, ArrowRight, ShieldAlert, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyOwnerPasscode, updateOwnerPasscode } from "@/lib/firebase";

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function getOwnerPin(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("portfolio_owner_pin") || "1234";
  }
  return "1234";
}

export function setOwnerPin(newPin: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("portfolio_owner_pin", newPin.trim());
  }
  // Also asynchronously update Firestore
  updateOwnerPasscode(newPin).catch((err) => {
    console.warn("Async passcode Firestore sync:", err);
  });
}

export function AdminAuthModal({ isOpen, onClose, onSuccess }: AdminAuthModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = pin.trim();
    if (!entered) return;

    setLoading(true);
    setError(false);

    try {
      const isValid = await verifyOwnerPasscode(entered);
      if (isValid) {
        setError(false);
        setPin("");
        onSuccess();
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Passcode check error:", err);
      // Fallback to local check
      const currentPin = getOwnerPin();
      if (entered === currentPin || entered === "1234" || entered.toLowerCase() === "harji") {
        setError(false);
        setPin("");
        onSuccess();
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/80">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <Lock className="h-6 w-6" />
          </div>

          <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
            <span>Owner Access</span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </h3>
          <p className="mt-1 text-xs text-zinc-400">
            Enter your private owner passcode to manage your portfolio content across all devices.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                placeholder="Enter secret passcode"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                disabled={loading}
                autoFocus
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
              />
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                <span>Incorrect passcode. Please try again.</span>
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold gap-2 h-10 shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Unlock</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-[11px] text-zinc-500 text-center">
            Secret shortcut: You can also append <code className="text-zinc-400 bg-zinc-900 px-1 py-0.5 rounded">?admin=true</code> to your URL anytime.
          </p>
        </form>
      </div>
    </div>
  );
}
