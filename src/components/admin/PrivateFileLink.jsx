import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { FileText, Loader2 } from "lucide-react";

/**
 * Renders a link to a privately-stored file.
 * On click, generates a time-limited signed URL via CreateFileSignedUrl.
 * Falls back to direct opening for legacy public URLs (http...).
 */
export default function PrivateFileLink({ fileUri, label = "View file", className = "", hideIcon = false }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const isLegacyUrl = fileUri && fileUri.startsWith("http");

  const handleClick = async (e) => {
    if (isLegacyUrl) return; // let default <a> behavior open it
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({
        file_uri: fileUri,
        expires_in: 300,
      });
      if (signed_url) {
        window.open(signed_url, "_blank", "noopener,noreferrer");
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <a
      href={isLegacyUrl ? fileUri : "#"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-sm text-blue-600 hover:underline ${className}`}
    >
      {!hideIcon && (loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />)}
      {error ? "Failed to load file" : label}
    </a>
  );
}