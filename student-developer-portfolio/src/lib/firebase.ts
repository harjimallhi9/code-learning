import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  writeBatch,
  getDocFromServer
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { PortfolioData, initialPortfolioData } from "@/data/portfolio";

// Initialize Firebase App
export const app = initializeApp({
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId,
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
});

// Initialize Firestore with specific database ID if present
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test Firestore connectivity on boot
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, "portfolio", "main"));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firestore offline or unreachable:", error.message);
    }
    return false;
  }
}

// ----------------------------------------------------
// Passcode Hashing & Sync
// ----------------------------------------------------

export async function hashPasscode(passcode: string): Promise<string> {
  const trimmed = passcode.trim();
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(trimmed);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Simple fallback hash if crypto.subtle is not supported
  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = (hash << 5) - hash + trimmed.charCodeAt(i);
    hash |= 0;
  }
  return "fallback_" + Math.abs(hash).toString(16);
}

const SETTINGS_AUTH_DOC = doc(db, "settings", "auth");

/**
 * Verifies entered passcode against Firestore (or localStorage cache fallback).
 */
export async function verifyOwnerPasscode(enteredPin: string): Promise<boolean> {
  const entered = enteredPin.trim();
  const enteredHash = await hashPasscode(entered);

  try {
    const snap = await getDoc(SETTINGS_AUTH_DOC);
    if (snap.exists()) {
      const data = snap.data();
      const storedHash = data.pinHash;
      if (storedHash) {
        // Cache to localStorage for offline access
        if (typeof window !== "undefined") {
          localStorage.setItem("portfolio_owner_pin_hash", storedHash);
        }
        return enteredHash === storedHash;
      }
    }
  } catch (err) {
    console.warn("Could not read passcode from Firestore, trying local cache:", err);
  }

  // Check cached hash
  if (typeof window !== "undefined") {
    const cachedHash = localStorage.getItem("portfolio_owner_pin_hash");
    if (cachedHash) {
      return enteredHash === cachedHash;
    }
    const legacyPin = localStorage.getItem("portfolio_owner_pin") || "1234";
    if (entered === legacyPin) return true;
  }

  // Default backup passcodes
  return entered === "1234" || entered.toLowerCase() === "harji";
}

/**
 * Saves new owner passcode to Firestore and caches locally.
 */
export async function updateOwnerPasscode(newPin: string): Promise<void> {
  const trimmed = newPin.trim();
  const hash = await hashPasscode(trimmed);

  // Update Firestore
  try {
    await setDoc(SETTINGS_AUTH_DOC, {
      pinHash: hash,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to update passcode in Firestore:", err);
    throw err;
  }

  // Update local cache
  if (typeof window !== "undefined") {
    localStorage.setItem("portfolio_owner_pin_hash", hash);
    localStorage.setItem("portfolio_owner_pin", trimmed);
  }
}

// ----------------------------------------------------
// Portfolio Data & Resume Cloud Sync
// ----------------------------------------------------

const PORTFOLIO_MAIN_DOC = doc(db, "portfolio", "main");
const CHUNK_SIZE = 400000; // ~400KB per chunk to stay well under 1MB Firestore doc limit

/**
 * Fetches portfolio data from Firestore with full chunk reconstruction for uploaded PDFs.
 */
export async function fetchPortfolioFromFirestore(): Promise<PortfolioData | null> {
  try {
    const snap = await getDoc(PORTFOLIO_MAIN_DOC);
    if (!snap.exists()) {
      return null;
    }

    const data = snap.data() as PortfolioData & {
      hasChunks?: boolean;
      chunkCount?: number;
    };

    let reconstructedResume = data.resume;

    // If resume was stored in subcollection chunks
    if (data.hasChunks && data.chunkCount && data.chunkCount > 0) {
      try {
        const chunksCol = collection(db, "portfolio", "main", "resume_chunks");
        const chunksSnap = await getDocs(chunksCol);
        const chunks: { index: number; data: string }[] = [];
        chunksSnap.forEach((c) => {
          chunks.push(c.data() as { index: number; data: string });
        });
        chunks.sort((a, b) => a.index - b.index);
        reconstructedResume = chunks.map((c) => c.data).join("");
      } catch (chunkErr) {
        console.warn("Failed to load resume chunks from Firestore:", chunkErr);
      }
    }

    return {
      ...initialPortfolioData,
      ...data,
      resume: reconstructedResume || initialPortfolioData.resume,
      projects: data.projects?.length ? data.projects : initialPortfolioData.projects,
      skills: data.skills?.length ? data.skills : initialPortfolioData.skills,
      learning: data.learning?.length ? data.learning : initialPortfolioData.learning,
      certificates: data.certificates?.length ? data.certificates : initialPortfolioData.certificates,
    };
  } catch (err) {
    console.warn("Failed to fetch portfolio from Firestore:", err);
    return null;
  }
}

/**
 * Saves portfolio data to Firestore, automatically chunking large resume PDFs if needed.
 */
export async function savePortfolioToFirestore(portfolio: PortfolioData): Promise<void> {
  const isLargeDataUrl = 
    typeof portfolio.resume === "string" &&
    portfolio.resume.startsWith("data:") &&
    portfolio.resume.length > CHUNK_SIZE;

  try {
    if (isLargeDataUrl) {
      const fullResumeData = portfolio.resume;
      const totalChars = fullResumeData.length;
      const chunkCount = Math.ceil(totalChars / CHUNK_SIZE);

      const batch = writeBatch(db);

      // Write chunks to subcollection
      for (let i = 0; i < chunkCount; i++) {
        const chunkString = fullResumeData.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const chunkRef = doc(db, "portfolio", "main", "resume_chunks", `chunk_${i}`);
        batch.set(chunkRef, {
          index: i,
          data: chunkString,
        });
      }

      // Save main doc with chunked flag
      const { ...rest } = portfolio;
      batch.set(PORTFOLIO_MAIN_DOC, {
        ...rest,
        resume: "__CHUNKED__",
        hasChunks: true,
        chunkCount: chunkCount,
        updatedAt: new Date().toISOString(),
      });

      await batch.commit();
    } else {
      // Direct save
      await setDoc(PORTFOLIO_MAIN_DOC, {
        ...portfolio,
        hasChunks: false,
        chunkCount: 0,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error("Failed to save portfolio to Firestore:", err);
    throw err;
  }
}
