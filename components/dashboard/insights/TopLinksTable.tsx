'use client';

import { TopLink } from '@/lib/analytics';
import { ExternalLink, TrendingUp } from 'lucide-react';

interface TopLinksTableProps {
  links: TopLink[];
}

export default function TopLinksTable({ links }: TopLinksTableProps) {
  if (links.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
          <ExternalLink className="w-6 h-6 text-white/60" />
        </div>
        <p className="text-white/60 text-sm">No links clicked yet</p>
        <p className="text-white/40 text-xs mt-1">Share your LinkDeck to start tracking clicks</p>
      </div>
    );
  }

  // Get the maximum clicks for progress bar calculation
  const maxClicks = Math.max(...links.map(link => link.clickCount));

  return (
    <div className="space-y-4">
      {links.map((link, index) => {
        const domain = new URL(link.url).hostname.replace('www.', '');
        const progressPercentage = maxClicks > 0 ? (link.clickCount / maxClicks) * 100 : 0;

        return (
          <div key={link.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">{link.name}</h3>
                    <p className="text-white/60 text-xs truncate">{domain}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <div className="text-right">
                  <p className="text-white font-medium text-sm">{link.clickCount.toLocaleString()}</p>
                  <p className="text-white/60 text-xs">{link.ctr}% CTR</p>
                </div>
                {index === 0 && (
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
