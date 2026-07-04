import prisma from "@/lib/prisma";
import { recordLinkClick } from "@/lib/server/analytics-tracking";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const { linkId } = await params;

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
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    await recordLinkClick(link, request.headers);

    return NextResponse.redirect(link.url);
  } catch (error) {
    console.error("LINK_CLICK_ROUTE_ERROR", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}