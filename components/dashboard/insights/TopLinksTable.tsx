"use client";

import type { TopLink } from "@/lib/analytics";
import { displayDomainFromUrl } from "@/lib/links";
import { ExternalLink, TrendingUp } from "lucide-react";

type TopLinksTableProps = {
  links: TopLink[];
};

export default function TopLinksTable({ links }: TopLinksTableProps) {
  if (links.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
          <ExternalLink className="h-6 w-6 text-white/60" />
        </div>
        <p className="text-sm text-white/60">No links clicked yet</p>
        <p className="mt-1 text-xs text-white/40">Share your LinkDeck to start tracking clicks</p>
      </div>
    );
  }

  const maxClicks = Math.max(...links.map((link) => link.clickCount));

  return (
    <div className="space-y-4">
      {links.map((link, index) => {
        const domain = displayDomainFromUrl(link.url) || "Unknown";
        const progressPercentage = maxClicks > 0 ? (link.clickCount / maxClicks) * 100 : 0;

        return (
          <div key={link.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5 sm:border-0 sm:bg-transparent sm:p-0">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-300">
                {index + 1}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold leading-tight text-white">
                      {link.name}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-white/45">{domain}</p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-white">{link.clickCount.toLocaleString()}</p>
                    <p className="text-[11px] font-medium text-white/45">{link.ctr}% CTR</p>
                  </div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {index === 0 && (
                <div className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 sm:flex">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
