'use server';

import { headers } from 'next/headers';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

export async function trackProfileView(userId: string) {
  try {
    // Get headers for tracking
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || null;
    const referrer = headersList.get('referer') || null;
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    
    // Get IP address and hash it
    const ip = forwardedFor?.split(',')[0] || realIp || null;
    const ipHash = ip ? crypto.createHash('sha256').update(ip).digest('hex') : null;

    // Create analytics event
    await prisma.analyticsEvent.create({
      data: {
        type: 'PROFILE_VIEW',
        userId,
        ipHash,
        userAgent,
        referrer,
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking profile view:', error);
    return { success: false, error: 'Failed to track profile view' };
  }
}
