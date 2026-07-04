"use server";

import { headers } from "next/headers";
import { recordProfileView } from "@/lib/server/analytics-tracking";

export async function trackProfileView(userId: string) {
  try {
    const headersList = await headers();
    await recordProfileView(userId, headersList);

    return { success: true };
  } catch (error) {
    console.error("PROFILE_VIEW_TRACKING_ERROR", error);
    return { success: false, error: "Failed to track profile view" };
  }
}