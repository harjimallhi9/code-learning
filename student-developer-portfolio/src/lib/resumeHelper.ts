/**
 * Helpers for handling PDF resumes in the portfolio:
 * - Converting base64 Data URLs to safe Blob URLs
 * - Direct cross-browser PDF downloading
 * - Google Drive link formatting for embedded viewing
 */

export function isDataUrl(url: string): boolean {
  return url?.startsWith("data:") ?? false;
}

export function isGoogleDriveUrl(url: string): boolean {
  return typeof url === "string" && url.includes("drive.google.com");
}

export function formatGoogleDrivePreview(url: string): string {
  if (!url) return url;
  try {
    // If it's a drive.google.com/file/d/ID/view -> convert to /preview
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  } catch (e) {
    console.warn("Could not parse Google Drive URL:", e);
  }
  return url;
}

/**
 * Creates a safe Blob URL from a base64 Data URL or returns regular URL.
 */
export function getSafeResumeUrl(resumeUrl: string): string {
  if (!resumeUrl) return "/resume.pdf";

  if (resumeUrl.startsWith("data:application/pdf") || resumeUrl.startsWith("data:application/octet-stream")) {
    try {
      const parts = resumeUrl.split(",");
      const base64 = parts[1];
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error("Error creating blob from PDF data:", err);
      return resumeUrl;
    }
  }

  if (isGoogleDriveUrl(resumeUrl)) {
    return formatGoogleDrivePreview(resumeUrl);
  }

  return resumeUrl;
}

/**
 * Downloads the resume PDF reliably across all browsers.
 */
export function downloadResume(resumeUrl: string, fileName = "Harji_Mallhi_Resume.pdf"): void {
  const targetUrl = resumeUrl || "/resume.pdf";

  if (targetUrl.startsWith("data:")) {
    try {
      const parts = targetUrl.split(",");
      const base64 = parts[1];
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
      return;
    } catch (err) {
      console.error("Download from data URI failed:", err);
    }
  }

  // If it's a standard path or web URL
  const a = document.createElement("a");
  a.href = targetUrl;
  a.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Opens the resume in a new tab safely (bypassing data URL navigation blocks).
 */
export function openResumeInNewTab(resumeUrl: string): void {
  const targetUrl = resumeUrl || "/resume.pdf";

  if (targetUrl.startsWith("data:")) {
    try {
      const parts = targetUrl.split(",");
      const base64 = parts[1];
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
      return;
    } catch (err) {
      console.error("Failed to open blob in new tab:", err);
    }
  }

  window.open(targetUrl, "_blank", "noopener,noreferrer");
}

export function formatFileSize(bytes: number): string {
  if (!bytes || isNaN(bytes)) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
