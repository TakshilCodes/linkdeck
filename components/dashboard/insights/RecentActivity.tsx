"use client";

import type { RecentActivity } from "@/lib/analytics";
import { displayDomainFromUrl } from "@/lib/links";
import { Clock, Eye, MousePointer } from "lucide-react";

type RecentActivityProps = {
  activities: RecentActivity[];
};

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMins < 1) return "Just now";
  if (diffInMins < 60) return `${diffInMins} minute${diffInMins > 1 ? "s" : ""} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
}

export default function RecentActivityComponent({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
          <Clock className="h-6 w-6 text-white/60" />
        </div>
        <p className="text-sm text-white/60">No recent activity</p>
        <p className="mt-1 text-xs text-white/40">Activity will appear once people visit your LinkDeck</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const isProfileView = activity.type === "PROFILE_VIEW";
        const Icon = isProfileView ? Eye : MousePointer;
        const domain = activity.linkUrl ? displayDomainFromUrl(activity.linkUrl) : null;
        const title = isProfileView
          ? "Profile viewed"
          : `${activity.linkName || "Link"} clicked`;

        return (
          <div
            key={activity.id}
            className="flex min-w-0 items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3.5 sm:border-0 sm:bg-transparent sm:p-0"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                isProfileView ? "bg-sky-500/15" : "bg-violet-500/15"
              }`}
            >
              <Icon className={`h-4 w-4 ${isProfileView ? "text-sky-300" : "text-violet-300"}`} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="break-words text-sm font-semibold leading-snug text-white">
                {title}
              </p>
              <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/45">
                {domain ? <span className="max-w-full truncate">{domain}</span> : null}
                <span>{formatTimeAgo(activity.createdAt)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
