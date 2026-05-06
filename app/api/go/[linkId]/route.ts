import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import crypto from 'crypto';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  const { linkId } = await params;

  if (!linkId) {
    return new NextResponse("Missing link id", { status: 400 });
  }

  // Find the link first to get the userId
  const link = await prisma.link.findUnique({
    where: { id: linkId },
    select: { 
      id: true,
      url: true, 
      userId: true,
      isVisible: true
    },
  });

  if (!link || !link.isVisible) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Get headers for tracking
  const userAgent = request.headers.get('user-agent') || null;
  const referrer = request.headers.get('referer') || null;
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  // Get IP address and hash it
  const ip = forwardedFor?.split(',')[0] || realIp || null;
  const ipHash = ip ? crypto.createHash('sha256').update(ip).digest('hex') : null;

  // Create analytics event
  try {
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
  } catch (error) {
    console.error('Error tracking link click:', error);
    // Continue even if tracking fails
  }

  // Increment click count
  await prisma.link.update({
    where: { id: link.id },
    data: { clickCount: { increment: 1 } }
  });

  const res = NextResponse.redirect(link.url, { status: 302 });
  res.headers.set("Cache-Control", "no-store");
  return res;
}

