'use client';

import { RecentActivity } from '@/lib/analytics';
import { Eye, MousePointer, ExternalLink, Clock } from 'lucide-react';

interface RecentActivityProps {
  activities: RecentActivity[];
}

export default function RecentActivityComponent({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-6 h-6 text-white/60" />
        </div>
        <p className="text-white/60 text-sm">No recent activity</p>
        <p className="text-white/40 text-xs mt-1">Activity will appear here once people visit your LinkDeck</p>
      </div>
    );
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} minute${diffInMins > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const isProfileView = activity.type === 'PROFILE_VIEW';
        const Icon = isProfileView ? Eye : MousePointer;

        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              isProfileView ? 'bg-blue-500/20' : 'bg-violet-500/20'
            }`}>
              <Icon className={`w-4 h-4 ${isProfileView ? 'text-blue-400' : 'text-violet-400'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm">
                {isProfileView ? (
                  <span>Profile viewed</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>{activity.linkName} link clicked</span>
                    {activity.linkUrl && (
                      <span className="text-white/60 text-xs">
                        ({getDomainFromUrl(activity.linkUrl)})
                      </span>
                    )}
                  </span>
                )}
                <span className="text-white/40 mx-1">•</span>
                <span className="text-white/60 text-xs">{formatTimeAgo(activity.createdAt)}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
