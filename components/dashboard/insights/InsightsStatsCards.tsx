"use client";

import type { AnalyticsStats } from "@/lib/analytics";
import { Eye, Link, MousePointer, Target } from "lucide-react";

type InsightsStatsCardsProps = {
  stats: AnalyticsStats;
};

export default function InsightsStatsCards({ stats }: InsightsStatsCardsProps) {
  const cards = [
    {
      title: "Profile views",
      shortTitle: "Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "from-sky-500 to-cyan-400",
    },
    {
      title: "Link clicks",
      shortTitle: "Clicks",
      value: stats.totalClicks.toLocaleString(),
      icon: MousePointer,
      color: "from-violet-500 to-fuchsia-500",
    },
    {
      title: "Click-through rate",
      shortTitle: "CTR",
      value: `${stats.ctr}%`,
      icon: Target,
      color: "from-emerald-500 to-green-400",
    },
    {
      title: "Visible links",
      shortTitle: "Links",
      value: stats.activeLinks.toLocaleString(),
      icon: Link,
      color: "from-orange-500 to-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="min-w-0 rounded-[22px] border border-white/10 bg-[#101a27] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors duration-200 hover:border-white/15 hover:bg-[#121f2f] sm:p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} shadow-[0_12px_28px_rgba(0,0,0,0.22)] sm:h-12 sm:w-12`}>
                <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <p className="min-w-0 text-right text-[11px] font-medium leading-tight text-white/50 sm:text-xs">
                {card.shortTitle}
              </p>
            </div>

            <p className="truncate text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {card.value}
            </p>
            <p className="mt-1 truncate text-xs font-medium text-white/55 sm:text-sm">
              {card.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}
