"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

type DashboardMainContentProps = {
  children: ReactNode;
};

export default function DashboardMainContent({ children }: DashboardMainContentProps) {
  const pathname = usePathname();
  const isDesignRoute = pathname === "/dashboard/design";

  return (
    <main
      className={
        isDesignRoute
          ? "min-w-0 h-[calc(100dvh-4rem)] overflow-hidden pb-0 md:h-auto md:overflow-visible md:pb-0"
          : "min-w-0 pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-0"
      }
    >
      {children}
    </main>
  );
}
