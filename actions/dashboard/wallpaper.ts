"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type {
  BlurStrength,
  GradientDirection,
  PatternStyle,
  WallpaperStyle,
} from "@/app/generated/prisma/enums";

type SaveWallpaperPayload = {
  wallpaperStyle?: string | null;
  backgroundColor?: string | null;
  backgroundColor2?: string | null;
  gradientDirection?: string | null;
  patternStyle?: string | null;
  blurStrength?: string | null;
  patternColor?: string | null;
  shadowColor?: string | null;
  outlineColor?: string | null;
};

type WallpaperCustomizationData = {
  wallpaperStyle?: WallpaperStyle | null;
  backgroundColor?: string | null;
  backgroundColor2?: string | null;
  gradientDirection?: GradientDirection | null;
  patternStyle?: PatternStyle | null;
  blurStrength?: BlurStrength | null;
  patternColor?: string | null;
  shadowColor?: string | null;
  outlineColor?: string | null;
};

export async function saveWallpaperDesignAction(payload: SaveWallpaperPayload) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, username: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updateData: WallpaperCustomizationData = {};
  if (payload.wallpaperStyle !== undefined) updateData.wallpaperStyle = payload.wallpaperStyle as WallpaperStyle | null;
  if (payload.backgroundColor !== undefined) updateData.backgroundColor = payload.backgroundColor;
  if (payload.backgroundColor2 !== undefined) updateData.backgroundColor2 = payload.backgroundColor2;
  if (payload.gradientDirection !== undefined) updateData.gradientDirection = payload.gradientDirection as GradientDirection | null;
  if (payload.patternStyle !== undefined) updateData.patternStyle = payload.patternStyle as PatternStyle | null;
  if (payload.blurStrength !== undefined) updateData.blurStrength = payload.blurStrength as BlurStrength | null;
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
  if (user.username) {
    revalidatePath(`/${user.username}`);
  }
}