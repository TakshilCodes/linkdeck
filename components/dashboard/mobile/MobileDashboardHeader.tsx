"use client";

import { ChevronLeft, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getProfileUrlClipboard } from "@/utils/public-profile-url";

const routeTitles: Record<string, string> = {
  "/dashboard": "Links",
  "/dashboard/links": "Links",
  "/dashboard/preview": "Preview",
  "/dashboard/design": "Design",
  "/dashboard/insights": "Insights",
  "/account": "Account",
};

function getTitle(pathname: string) {
  return routeTitles[pathname] ?? "Dashboard";
}

export default function MobileDashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const isDashboardRoute = pathname.startsWith("/dashboard") || pathname === "/account";
  const title = getTitle(pathname);
  const showEnhance = pathname === "/dashboard/design";

  if (!isDashboardRoute) return null;

  const openPublicProfile = () => {
    const username = session?.user?.username;
    const profileUrl = getProfileUrlClipboard(username ?? "");

    if (!profileUrl) return;
    window.open(profileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#07101C]/95 px-4 text-white shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl md:hidden"
    >
      <button
        type="button"
        onClick={() => router.back()}
        className="flex h-11 w-11 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-white"
        aria-label="Go back"
      >
        <ChevronLeft className="h-7 w-7" strokeWidth={3.6} />
      </button>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 px-2">
        <h1 className="truncate text-[22px] font-bold tracking-tight">{title}</h1>
        {showEnhance && (
          <button
            type="button"
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(0,184,219,0.10)]"
          >
            <Sparkles className="h-4 w-4" />
            Enhance
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={openPublicProfile}
        disabled={!session?.user?.username}
        className="flex h-11 w-11 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-40"
        aria-label="Open public profile in a new tab"
      >
        <ExternalLink className="h-5 w-5" />
      </button>
    </motion.header>
  );
}
