import React, { useState, useEffect } from "react";
import { Link2, Share2, Facebook, Twitter, Mail, Check } from "lucide-react";

export default function ShareBar({ product }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, [product?.id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || "PetRx Product",
          text: product?.description || "Check out this product on PetRx",
          url: shareUrl,
        });
      } catch {
        // user cancelled — no action needed
      }
    } else {
      handleCopy();
    }
  };

  const shareText = encodeURIComponent(`Check out ${product?.name} from PetRx Pharmacy`);
  const encodedUrl = encodeURIComponent(shareUrl);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-ink/40 uppercase tracking-wider font-semibold mr-1 hidden sm:inline">Share</span>
      <button
        onClick={handleNativeShare}
        className="w-9 h-9 rounded-full flex items-center justify-center bg-secondary hover:bg-sage/10 text-ink/50 hover:text-sage transition-colors sm:hidden"
        aria-label="Share"
      >
        <Share2 className="w-4 h-4" />
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 h-9 rounded-full bg-secondary hover:bg-sage/10 text-ink/50 hover:text-sage text-xs font-medium transition-colors"
        aria-label="Copy link"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Link2 className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{copied ? "Copied" : "Copy Link"}</span>
      </button>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full hidden sm:flex items-center justify-center bg-secondary hover:bg-sage/10 text-ink/50 hover:text-sage transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full hidden sm:flex items-center justify-center bg-secondary hover:bg-sage/10 text-ink/50 hover:text-sage transition-colors"
        aria-label="Share on X"
      >
        <Twitter className="w-4 h-4" />
      </a>
      <a
        href={`mailto:?subject=${shareText}&body=${encodedUrl}`}
        className="w-9 h-9 rounded-full hidden sm:flex items-center justify-center bg-secondary hover:bg-sage/10 text-ink/50 hover:text-sage transition-colors"
        aria-label="Share via email"
      >
        <Mail className="w-4 h-4" />
      </a>
    </div>
  );
}