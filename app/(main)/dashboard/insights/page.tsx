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
      <div className="py-12 text-center">
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Insights</h1>
        <p className="mt-1 text-sm text-white/60">Track your LinkDeck performance and engagement</p>
      </div>

      <InsightsStatsCards stats={stats} />

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h2 className="mb-6 text-lg font-medium text-white">Activity Overview</h2>
        <ActivityChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="mb-6 text-lg font-medium text-white">Top Performing Links</h2>
          <TopLinksTable links={topLinks} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="mb-6 text-lg font-medium text-white">Recent Activity</h2>
          <RecentActivity activities={recentActivity} />
        </div>
      </div>
    </div>
  );
}