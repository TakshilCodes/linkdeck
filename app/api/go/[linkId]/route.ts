import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  const { linkId } = await params;

  if (!linkId) {
    return new NextResponse("Missing link id", { status: 400 });
  }

  const updated = await prisma.link.updateMany({
    where: { id: linkId, isVisible: true },
    data: { clickCount: { increment: 1 } },
  });

  if (updated.count === 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  const link = await prisma.link.findUnique({
    where: { id: linkId },
    select: { url: true },
  });

  if (!link?.url) {
    return new NextResponse("Not found", { status: 404 });
  }

  const res = NextResponse.redirect(link.url, { status: 302 });
  res.headers.set("Cache-Control", "no-store");
  return res;
}

