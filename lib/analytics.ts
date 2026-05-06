import prisma from './prisma';
import type { EventType } from '@/app/generated/prisma/client';

export interface ChartDataPoint {
  date: string;
  views: number;
  clicks: number;
}

export interface TopLink {
  id: string;
  name: string;
  url: string;
  clickCount: number;
  ctr: number;
}

export interface RecentActivity {
  id: string;
  type: EventType;
  linkName?: string;
  linkUrl?: string;
  createdAt: Date;
}

export interface AnalyticsStats {
  totalViews: number;
  totalClicks: number;
  ctr: number;
  activeLinks: number;
}

// Get total views for a user
export async function getTotalViews(userId: string): Promise<number> {
  const result = await prisma.analyticsEvent.aggregate({
    where: {
      userId,
      type: 'PROFILE_VIEW'
    },
    _count: {
      id: true
    }
  });
  
  return result._count.id || 0;
}

// Get total clicks for a user
export async function getTotalClicks(userId: string): Promise<number> {
  const result = await prisma.analyticsEvent.aggregate({
    where: {
      userId,
      type: 'LINK_CLICK'
    },
    _count: {
      id: true
    }
  });
  
  return result._count.id || 0;
}

// Calculate CTR (Click-Through Rate)
export function calculateCTR(totalClicks: number, totalViews: number): number {
  if (totalViews === 0) return 0;
  return Math.round((totalClicks / totalViews) * 100 * 100) / 100; // Round to 2 decimal places
}

// Get active visible links count
export async function getActiveLinksCount(userId: string): Promise<number> {
  const result = await prisma.link.aggregate({
    where: {
      userId,
      isVisible: true
    },
    _count: {
      id: true
    }
  });
  
  return result._count.id || 0;
}

// Get chart data grouped by day
export async function getChartData(
  userId: string, 
  days: 7 | 30 | 90
): Promise<ChartDataPoint[]> {
  if (!prisma) {
    console.error('Prisma client is not initialized');
    return [];
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const events = await prisma.analyticsEvent.findMany({
    where: {
      userId,
      createdAt: {
        gte: startDate
      }
    },
    select: {
      type: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  // Group events by date
  const groupedData: { [key: string]: { views: number; clicks: number } } = {};
  
  // Initialize all dates with 0 values
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const dateStr = date.toISOString().split('T')[0];
    groupedData[dateStr] = { views: 0, clicks: 0 };
  }
  
  // Count events
  events.forEach(event => {
    const dateStr = event.createdAt.toISOString().split('T')[0];
    if (groupedData[dateStr]) {
      if (event.type === 'PROFILE_VIEW') {
        groupedData[dateStr].views++;
      } else if (event.type === 'LINK_CLICK') {
        groupedData[dateStr].clicks++;
      }
    }
  });

  // Convert to array format
  return Object.entries(groupedData).map(([date, data]) => ({
    date,
    views: data.views,
    clicks: data.clicks
  }));
}

// Get top performing links
export async function getTopLinks(userId: string, limit: number = 10): Promise<TopLink[]> {
  const links = await prisma.link.findMany({
    where: {
      userId,
      isVisible: true
    },
    select: {
      id: true,
      name: true,
      url: true,
      clickCount: true
    },
    orderBy: {
      clickCount: 'desc'
    },
    take: limit
  });

  const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0);
  
  return links.map(link => ({
    ...link,
    ctr: totalClicks > 0 ? Math.round((link.clickCount / totalClicks) * 100 * 100) / 100 : 0
  }));
}

// Get recent activity
export async function getRecentActivity(userId: string, limit: number = 10): Promise<RecentActivity[]> {
  const events = await prisma.analyticsEvent.findMany({
    where: {
      userId
    },
    include: {
      link: {
        select: {
          name: true,
          url: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit
  });

  return events.map(event => ({
    id: event.id,
    type: event.type,
    linkName: event.link?.name,
    linkUrl: event.link?.url,
    createdAt: event.createdAt
  }));
}

// Get comprehensive analytics stats
export async function getAnalyticsStats(userId: string): Promise<AnalyticsStats> {
  const [totalViews, totalClicks, activeLinks] = await Promise.all([
    getTotalViews(userId),
    getTotalClicks(userId),
    getActiveLinksCount(userId)
  ]);

  const ctr = calculateCTR(totalClicks, totalViews);

  return {
    totalViews,
    totalClicks,
    ctr,
    activeLinks
  };
}
