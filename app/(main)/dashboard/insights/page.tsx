import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAnalyticsStats, getChartData, getTopLinks, getRecentActivity } from "@/lib/analytics";
import InsightsStatsCards from "@/components/dashboard/insights/InsightsStatsCards";
import ActivityChart from "@/components/dashboard/insights/ActivityChart";
import TopLinksTable from "@/components/dashboard/insights/TopLinksTable";
import RecentActivity from "@/components/dashboard/insights/RecentActivity";
import EmptyInsightsState from "@/components/dashboard/insights/EmptyInsightsState";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const data = await Promise.all([
    getAnalyticsStats(userId),
    getChartData(userId, 7),
    getTopLinks(userId, 10),
    getRecentActivity(userId, 10),
  ]).catch((error) => {
    console.error("Error loading insights:", error);
    return null;
  });

  if (!data) {
    return (
      <div className="px-4 py-12 text-center md:px-0">
        <h2 className="mb-2 text-lg font-medium text-white">Unable to load insights</h2>
        <p className="text-sm text-white/60">Please try again later</p>
      </div>
    );
  }

  const [stats, chartData, topLinks, recentActivity] = data;
  const hasData = stats.totalViews > 0 || stats.totalClicks > 0 || topLinks.length > 0;

  if (!hasData) {
    return <EmptyInsightsState username={session.user.username} />;
  }

  return (
    <div className="space-y-4 px-4 py-5 md:space-y-8 md:px-0 md:py-0">
      <div className="hidden md:block">
        <h1 className="text-2xl font-semibold text-white">Insights</h1>
        <p className="mt-1 text-sm text-white/60">Track your LinkDeck performance and engagement</p>
      </div>

      <InsightsStatsCards stats={stats} />

      <section className="overflow-hidden rounded-[24px] border border-white/10 bg-[#101a27] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
          <h2 className="text-lg font-semibold tracking-tight text-white">Activity Overview</h2>
          <div className="hidden items-center gap-3 text-xs font-medium text-white/45 sm:flex">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />Views</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" />Clicks</span>
          </div>
        </div>
        <ActivityChart data={chartData} />
      </section>

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] 2xl:gap-6">
        <section className="rounded-[24px] border border-white/10 bg-[#101a27] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6">
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-white sm:mb-6">Top Performing Links</h2>
          <TopLinksTable links={topLinks} />
        </section>

        <section className="rounded-[24px] border border-white/10 bg-[#101a27] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6">
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-white sm:mb-6">Recent Activity</h2>
          <RecentActivity activities={recentActivity} />
        </section>
      </div>
    </div>
  );
}
