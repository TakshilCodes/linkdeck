"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { BarChart3, Eye, Link2, Palette, User } from "lucide-react";

const baseItems = [
  { label: "Links", href: "/dashboard/links", icon: Link2, match: ["/dashboard", "/dashboard/links"] },
  { label: "Preview", href: "/dashboard/preview", icon: Eye, match: ["/dashboard/preview"] },
  { label: "Design", href: "/dashboard/design", icon: Palette, match: ["/dashboard/design"] },
  { label: "Insights", href: "/dashboard/insights", icon: BarChart3, match: ["/dashboard/insights"] },
  { label: "Account", href: "/account", icon: User, match: ["/account"] },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith("/dashboard") || pathname === "/account";

  if (!isDashboardRoute || pathname === "/dashboard/design") return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#07101C]/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_44px_rgba(0,0,0,0.32)] backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {baseItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.match.includes(pathname);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-semibold transition ${
                isActive
                  ? "bg-white text-[#07101C] shadow-[0_10px_28px_rgba(0,184,219,0.16)]"
                  : "text-white/55 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
