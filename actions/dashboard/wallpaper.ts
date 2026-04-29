"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type SaveWallpaperPayload = {
  wallpaperStyle?: string;
  backgroundColor?: string;
  backgroundColor2?: string;
  gradientDirection?: string;
  patternStyle?: string;
  blurStrength?: string;
  patternColor?: string;
  shadowColor?: string;
  outlineColor?: string;
};

export async function saveWallpaperDesignAction(payload: SaveWallpaperPayload) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Only update fields that are provided in the payload
  const updateData: any = {};
  if (payload.wallpaperStyle !== undefined) updateData.wallpaperStyle = payload.wallpaperStyle;
  if (payload.backgroundColor !== undefined) updateData.backgroundColor = payload.backgroundColor;
  if (payload.backgroundColor2 !== undefined) updateData.backgroundColor2 = payload.backgroundColor2;
  if (payload.gradientDirection !== undefined) updateData.gradientDirection = payload.gradientDirection;
  if (payload.patternStyle !== undefined) updateData.patternStyle = payload.patternStyle;
  if (payload.blurStrength !== undefined) updateData.blurStrength = payload.blurStrength;
  if (payload.patternColor !== undefined) updateData.patternColor = payload.patternColor;
  if (payload.shadowColor !== undefined) updateData.shadowColor = payload.shadowColor;
  if (payload.outlineColor !== undefined) updateData.outlineColor = payload.outlineColor;

  if (Object.keys(updateData).length > 0) {
    await prisma.userCustomization.upsert({
      where: { userId: user.id },
      update: updateData,
      create: {
        userId: user.id,
        ...updateData,
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/[username]");
}
