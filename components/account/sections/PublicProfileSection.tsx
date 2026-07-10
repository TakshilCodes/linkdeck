'use client';

import { CheckCircle2, Copy, ExternalLink, Link2 } from "lucide-react";
import { toast } from "sonner";
import { useIsClient } from "@/hooks/useIsClient";

export default function PublicProfileSection({ username }: { username: string | null }) {
  const isClient = useIsClient();
  const origin = isClient ? window.location.origin : "";
  const profileUrl = username ? `${origin}/${username}` : null;

  const handleCopy = async () => {
    if (!profileUrl) return;

    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied to clipboard.");
    } catch {
      toast.error("Failed to copy the profile link.");
    }
  };

  return (
    <section className="py-6 sm:py-7" aria-labelledby="public-profile-heading">
      <div className="grid gap-6 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)] lg:gap-10">
        <div>
          <div className="mb-2 flex items-center gap-2 text-cyan-300">
            <Link2 className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em]">Sharing</span>
          </div>
          <h2 id="public-profile-heading" className="text-lg font-semibold text-white">Public profile</h2>
          <p className="mt-1.5 max-w-xs text-sm leading-6 text-white/50">
            Share one clean link wherever people find you.
          </p>
        </div>

        <div className="min-w-0 rounded-2xl border border-white/10 bg-black/15 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs text-white/45">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-300" />
                {profileUrl ? "Your profile is ready to share" : "Set a username to create a profile link"}
              </div>
              <p className="truncate font-mono text-sm text-white/85 select-all">
                {profileUrl || "No username set"}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!profileUrl}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3.5 text-sm font-medium text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
              {profileUrl ? (
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open public profile in a new tab"
                  title="Open public profile"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition hover:bg-cyan-400/20"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}