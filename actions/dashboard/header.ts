"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type SaveHeaderPayload = {
  displayName?: string;
  bio?: string;
  titleFontFamily?: string | null;
  titleFontWeight?: string;
  titleFontSize?: string;
  titleColor?: string;
  profileFontSize?: string;
  profileColor?: string;
  bioColor?: string;
  iconColor?: string;
  fontFamily?: string;
};

export async function saveHeaderDesignAction(payload: SaveHeaderPayload) {
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

  await prisma.$transaction(async (tx) => {
    if (payload.displayName !== undefined) {
      await tx.user.update({
        where: { id: user.id },
        data: { displayName: payload.displayName },
      });
    }
    if (payload.bio !== undefined) {
      // Validate bio length (max 200 characters)
      if (payload.bio.length > 200) {
        throw new Error("Bio cannot exceed 200 characters");
      }
      
      await tx.user.update({
        where: { id: user.id },
        data: { bio: payload.bio },
      });
    }

    if (payload.titleFontFamily !== undefined || payload.titleColor !== undefined || payload.titleFontWeight !== undefined || payload.titleFontSize !== undefined || payload.profileFontSize !== undefined || payload.profileColor !== undefined || payload.fontFamily !== undefined || payload.bioColor !== undefined || payload.iconColor !== undefined) {
      const updateData: any = {};
      if (payload.titleFontFamily !== undefined) {
        updateData.titleFontFamily = payload.titleFontFamily;
      }
      if (payload.titleFontWeight !== undefined) {
        updateData.titleFontWeight = payload.titleFontWeight;
      }
      if (payload.titleFontSize !== undefined) {
        updateData.titleFontSize = payload.titleFontSize;
      }
      if (payload.titleColor !== undefined) {
        updateData.titleColor = payload.titleColor;
      }
      if (payload.profileFontSize !== undefined) {
        updateData.profileFontSize = payload.profileFontSize;
      }
      if (payload.profileColor !== undefined) {
        updateData.profileColor = payload.profileColor;
      }
      if (payload.bioColor !== undefined) {
        updateData.bioColor = payload.bioColor;
      }
      if (payload.fontFamily !== undefined) {
        updateData.fontFamily = payload.fontFamily;
      }
      if (payload.iconColor !== undefined) {
        updateData.iconColor = payload.iconColor;
      }

      await tx.userCustomization.upsert({
        where: { userId: user.id },
        update: updateData,
        create: {
          userId: user.id,
          ...updateData,
        },
      });
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/[username]");
}
