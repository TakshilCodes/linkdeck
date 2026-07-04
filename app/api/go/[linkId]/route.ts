import prisma from "@/lib/prisma";
import { recordLinkClick } from "@/lib/server/analytics-tracking";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  const { linkId } = await params;

  if (!linkId) {
    return new NextResponse("Missing link id", { status: 400 });
  }

  const link = await prisma.link.findUnique({
    where: { id: linkId },
    select: {
      id: true,
      url: true,
      userId: true,
      isVisible: true,
    },
  });

  if (!link || !link.isVisible) {
    return new NextResponse("Not found", { status: 404 });
  }

  await recordLinkClick(link, request.headers);

  const response = NextResponse.redirect(link.url, { status: 302 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}