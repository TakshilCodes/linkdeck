"use client";

import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useIsClient } from "@/hooks/useIsClient";

export default function PublicProfileSection({
  username,
}: {
  username: string | null;
}) {
  const isClient = useIsClient();
  const origin = isClient ? window.location.origin : "";
  const profileUrl = username ? `${origin}/${username}` : null;

  const handleCopy = async () => {
    if (!profileUrl) return;
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between py-6">
      <div className="md:w-1/3">
        <h2 className="text-lg font-semibold text-white">Public Profile</h2>
        <p className="mt-1 text-sm text-white/50">
          Share this link to let people view your LinkDeck.
        </p>
      </div>

      <div className="md:w-2/3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="truncate text-sm font-medium text-white/90 select-all">
            {profileUrl ? profileUrl : "No username set"}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!profileUrl}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
            <a
              href={profileUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-2 rounded-lg bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 ${!profileUrl ? "opacity-50 pointer-events-none" : ""}`}
            >
              <ExternalLink className="h-4 w-4" />
              Open
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}