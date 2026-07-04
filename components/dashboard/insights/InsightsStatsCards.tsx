'use client';

import { AnalyticsStats } from '@/lib/analytics';
import { Eye, MousePointer, Target, Link } from 'lucide-react';

interface InsightsStatsCardsProps {
  stats: AnalyticsStats;
}

export default function InsightsStatsCards({ stats }: InsightsStatsCardsProps) {
  const cards = [
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'from-blue-500 to-cyan-500',
      description: 'Profile visits'
    },
    {
      title: 'Total Clicks',
      value: stats.totalClicks.toLocaleString(),
      icon: MousePointer,
      color: 'from-violet-500 to-purple-500',
      description: 'Link interactions'
    },
    {
      title: 'CTR',
      value: `${stats.ctr}%`,
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      description: 'Click-through rate'
    },
    {
      title: 'Active Links',
      value: stats.activeLinks.toLocaleString(),
      icon: Link,
      color: 'from-orange-500 to-red-500',
      description: 'Visible links'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60">{card.description}</p>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
              <p className="text-sm text-white/60">{card.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
