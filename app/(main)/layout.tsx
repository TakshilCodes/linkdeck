import type { Metadata } from "next";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileDashboardHeader from "@/components/dashboard/mobile/MobileDashboardHeader";
import MobileBottomNav from "@/components/dashboard/mobile/MobileBottomNav";
import DashboardMainContent from "@/components/dashboard/mobile/DashboardMainContent";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#07101C] text-white md:flex md:overflow-x-visible">
      <div className="hidden md:block md:w-[18.125rem] md:shrink-0">
        <div className="fixed inset-y-0 left-0 z-40 w-[18.125rem]">
          <Sidebar />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <MobileDashboardHeader />
        <DashboardMainContent>{children}</DashboardMainContent>
      </div>
      <MobileBottomNav />
    </div>
  );
}
