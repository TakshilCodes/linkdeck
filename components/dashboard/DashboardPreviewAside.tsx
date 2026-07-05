"use client";

import { usePathname } from "next/navigation";
import DashboardLivePreview from "@/components/dashboard/DashboardLivePreview";
import type { DashboardPreviewPayload } from "@/lib/dashboard-preview";

type Props = DashboardPreviewPayload;

export default function DashboardPreviewAside({
  username,
  themeForClient,
  profile,
  icons,
  standaloneLinks,
  collections,
  sections,
}: Props) {
  const pathname = usePathname();

  if (pathname === "/dashboard/preview") return null;

  return (
    <aside className="hidden w-full shrink-0 lg:sticky lg:top-6 lg:block lg:w-[min(100%,404px)] xl:w-[min(100%,428px)]">
      <DashboardLivePreview
        username={username}
        theme={themeForClient}
        profile={profile}
        icons={icons}
        standaloneLinks={standaloneLinks}
        collections={collections}
        sections={sections}
      />
    </aside>
  );
}
