"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type SaveHeaderPayload = {
  displayName?: string;
  titleFontFamily?: string | null;
  titleFontWeight?: string;
  titleFontSize?: string;
  titleColor?: string;
  profileFontSize?: string;
  profileColor?: string;
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

    if (payload.titleFontFamily !== undefined || payload.titleColor !== undefined || payload.titleFontWeight !== undefined || payload.titleFontSize !== undefined || payload.profileFontSize !== undefined || payload.profileColor !== undefined || payload.fontFamily !== undefined) {
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
      if (payload.fontFamily !== undefined) {
        updateData.fontFamily = payload.fontFamily;
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
