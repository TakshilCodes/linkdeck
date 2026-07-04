import crypto from "node:crypto";
import { checkFixedWindowRateLimit } from "@/lib/security/rate-limit";

type LinkForTracking = {
  id: string;
  userId: string;
};

async function getPrisma() {
  return (await import("@/lib/prisma")).default;
}

export function getTrackingFields(headers: Headers) {
  const userAgent = headers.get("user-agent") || null;
  const referrer = headers.get("referer") || null;
  const forwardedFor = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || null;
  const ipHash = ip ? crypto.createHash("sha256").update(ip).digest("hex") : null;
  const userAgentHash = userAgent
    ? crypto.createHash("sha256").update(userAgent).digest("hex")
    : "unknown";

  return { ipHash, userAgent, userAgentHash, referrer };
}

async function canRecordAnalyticsEvent(key: string, limit: number, windowSeconds: number) {
  try {
    const { allowed } = await checkFixedWindowRateLimit({ key, limit, windowSeconds });
    return allowed;
  } catch (error) {
    console.error("ANALYTICS_RATE_LIMIT_ERROR", error);
    return true;
  }
}

export async function recordLinkClick(link: LinkForTracking, headers: Headers) {
  const { ipHash, userAgent, userAgentHash, referrer } = getTrackingFields(headers);
  const fingerprint = ipHash ?? userAgentHash;
  const allowed = await canRecordAnalyticsEvent(
    `ratelimit:analytics:click:${link.id}:${fingerprint}`,
    5,
    60
  );

  if (!allowed) return;

  try {
    const prisma = await getPrisma();
    await prisma.$transaction([
      prisma.analyticsEvent.create({
        data: {
          type: "LINK_CLICK",
          userId: link.userId,
          linkId: link.id,
          ipHash,
          userAgent,
          referrer,
        },
      }),
      prisma.link.update({
        where: { id: link.id },
        data: { clickCount: { increment: 1 } },
      }),
    ]);
  } catch (error) {
    console.error("LINK_CLICK_TRACKING_ERROR", error);
  }
}

export async function recordProfileView(userId: string, headers: Headers) {
  const { ipHash, userAgent, userAgentHash, referrer } = getTrackingFields(headers);
  const fingerprint = ipHash ?? userAgentHash;
  const allowed = await canRecordAnalyticsEvent(
    `ratelimit:analytics:profile:${userId}:${fingerprint}`,
    3,
    5 * 60
  );

  if (!allowed) return false;

  const prisma = await getPrisma();
  await prisma.analyticsEvent.create({
    data: {
      type: "PROFILE_VIEW",
      userId,
      ipHash,
      userAgent,
      referrer,
    },
  });

  return true;
}