"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import {
  Copy,
  Loader2,
  Mail,
  Share2,
  X,
} from "lucide-react";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";
import { useIsClient } from "@/hooks/useIsClient";

type ProfileShareDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title?: string;
  description?: string;
  urlLabel?: string;
};

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) throw new Error("Clipboard unavailable");
}

export default function ProfileShareDialog({
  open,
  onOpenChange,
  url,
  title = "My LinkDeck profile",
  description = "Check out my links on LinkDeck.",
  urlLabel = "Public profile URL",
}: ProfileShareDialogProps) {
  const isClient = useIsClient();
  const titleId = useId();
  const descriptionId = useId();
  const [isCopying, setIsCopying] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    );
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSharing) onOpenChange(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isSharing, onOpenChange, open]);

  const copyUrl = async () => {
    if (!url) {
      toast.error("No URL available to copy");
      return;
    }

    setIsCopying(true);
    try {
      await copyToClipboard(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy the link");
    } finally {
      setIsCopying(false);
    }
  };

  const nativeShare = async () => {
    if (!canNativeShare || !url) return;

    setIsSharing(true);
    try {
      await navigator.share({ title, text: description, url });
      toast.success("Share sheet opened");
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        toast.error("Could not open the share sheet");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const socialLinks = [
    {
      label: "WhatsApp",
      icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodeURIComponent(`${description} ${url}`)}`,
    },
    {
      label: "X",
      icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(description)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "Telegram",
      icon: FaTelegramPlane,
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(description)}`,
    },
    {
      label: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
    },
  ];

  if (!isClient || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100000]">
      <button
        type="button"
        aria-label="Close share dialog"
        disabled={isSharing}
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-[#020817]/75 backdrop-blur-md"
      />
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,32,55,0.98)_0%,rgba(8,20,39,0.99)_100%)] p-5 text-white shadow-[0_30px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)] sm:p-6"
        >
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isSharing}
            aria-label="Close share dialog"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-200">
            <Share2 className="h-5 w-5" />
          </div>
          <h2
            id={titleId}
            className="mt-5 pr-10 text-xl font-semibold tracking-tight text-white"
          >
            Share LinkDeck
          </h2>
          <p
            id={descriptionId}
            className="mt-2 text-sm leading-6 text-white/60"
          >
            Share this page anywhere your audience follows you.
          </p>
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium text-white/55">{urlLabel}</p>
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] p-2 pl-3">
              <span className="min-w-0 flex-1 truncate text-sm text-white/80">
                {url}
              </span>
              <button
                type="button"
                onClick={copyUrl}
                disabled={isCopying}
                className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-white/10 px-3 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCopying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}{" "}
                Copy
              </button>
            </div>
          </div>
          {canNativeShare ? (
            <button
              type="button"
              onClick={nativeShare}
              disabled={isSharing}
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-4 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSharing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}{" "}
              {isSharing ? "Opening share sheet..." : "Share"}
            </button>
          ) : null}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {socialLinks.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target={label === "Email" ? undefined : "_blank"}
                rel={label === "Email" ? undefined : "noreferrer"}
                aria-label={`Share via ${label}`}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-sm font-medium text-white/75 transition hover:border-cyan-300/30 hover:bg-cyan-400/10 hover:text-white"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>,
    document.body,
  );
}
