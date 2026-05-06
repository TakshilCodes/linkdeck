import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAnalyticsStats, getChartData, getTopLinks, getRecentActivity } from '@/lib/analytics';
import InsightsStatsCards from '@/components/dashboard/insights/InsightsStatsCards';
import ActivityChart from '@/components/dashboard/insights/ActivityChart';
import TopLinksTable from '@/components/dashboard/insights/TopLinksTable';
import RecentActivity from '@/components/dashboard/insights/RecentActivity';
import EmptyInsightsState from '@/components/dashboard/insights/EmptyInsightsState';

export default async function InsightsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;

  try {
    // Get all analytics data
    const [stats, chartData, topLinks, recentActivity] = await Promise.all([
      getAnalyticsStats(userId),
      getChartData(userId, 7), // Default to 7 days
      getTopLinks(userId, 10),
      getRecentActivity(userId, 10)
    ]);

    // Check if there's any data
    const hasData = stats.totalViews > 0 || stats.totalClicks > 0 || topLinks.length > 0;

    if (!hasData) {
      return <EmptyInsightsState username={session.user.username} />;
    }

    return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-white">Insights</h1>
          <p className="text-sm text-white/60 mt-1">Track your LinkDeck performance and engagement</p>
        </div>

        {/* Stats Cards */}
        <InsightsStatsCards stats={stats} />

        {/* Activity Chart */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
          <h2 className="text-lg font-medium text-white mb-6">Activity Overview</h2>
          <ActivityChart data={chartData} />
        </div>

        {/* Top Links and Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Links */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-medium text-white mb-6">Top Performing Links</h2>
            <TopLinksTable links={topLinks} />
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-medium text-white mb-6">Recent Activity</h2>
            <RecentActivity activities={recentActivity} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading insights:', error);
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-white mb-2">Unable to load insights</h2>
        <p className="text-sm text-white/60">Please try again later</p>
      </div>
    );
  }
}
