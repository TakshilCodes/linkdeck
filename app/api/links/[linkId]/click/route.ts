import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function GET(
  request: NextRequest,
  { params }: { params: { linkId: string } }
) {
  try {
    const { linkId } = params;
    
    // Get headers for tracking
    const userAgent = request.headers.get('user-agent') || null;
    const referrer = request.headers.get('referer') || null;
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    
    // Get IP address and hash it
    const ip = forwardedFor?.split(',')[0] || realIp || null;
    const ipHash = ip ? crypto.createHash('sha256').update(ip).digest('hex') : null;

    // Find the link
    const link = await prisma.link.findUnique({
      where: { id: linkId },
      include: { user: true }
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    if (!link.isVisible) {
      return NextResponse.json({ error: 'Link not visible' }, { status: 404 });
    }

    // Create analytics event
    await prisma.analyticsEvent.create({
      data: {
        type: 'LINK_CLICK',
        userId: link.userId,
        linkId: link.id,
        ipHash,
        userAgent,
        referrer,
      }
    });

    // Increment click count
    await prisma.link.update({
      where: { id: link.id },
      data: { clickCount: { increment: 1 } }
    });

    // Redirect to the original URL
    return NextResponse.redirect(link.url);

  } catch (error) {
    console.error('Error tracking link click:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
