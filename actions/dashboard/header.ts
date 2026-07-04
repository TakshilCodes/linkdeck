"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type {
  FontFamily,
  profileFontSize,
  titleFontSize,
  titleFontWeight,
} from "@/app/generated/prisma/enums";

type SaveHeaderPayload = {
  displayName?: string;
  bio?: string;
  titleFontFamily?: string | null;
  titleFontWeight?: string | null;
  titleFontSize?: string | null;
  titleColor?: string | null;
  profileFontSize?: string | null;
  profileColor?: string | null;
  bioColor?: string | null;
  iconColor?: string | null;
  fontFamily?: string | null;
};

type HeaderCustomizationData = {
  titleFontFamily?: FontFamily | null;
  titleFontWeight?: titleFontWeight | null;
  titleFontSize?: titleFontSize | null;
  titleColor?: string | null;
  profileFontSize?: profileFontSize | null;
  profileColor?: string | null;
  bioColor?: string | null;
  iconColor?: string | null;
  fontFamily?: FontFamily | null;
};

export async function saveHeaderDesignAction(payload: SaveHeaderPayload) {
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

  await prisma.$transaction(async (tx) => {
    if (payload.displayName !== undefined) {
      await tx.user.update({
        where: { id: user.id },
        data: { displayName: payload.displayName },
      });
    }

    if (payload.bio !== undefined) {
      if (payload.bio.length > 200) {
        throw new Error("Bio cannot exceed 200 characters");
      }

      await tx.user.update({
        where: { id: user.id },
        data: { bio: payload.bio },
      });
    }

    if (
      payload.titleFontFamily !== undefined ||
      payload.titleColor !== undefined ||
      payload.titleFontWeight !== undefined ||
      payload.titleFontSize !== undefined ||
      payload.profileFontSize !== undefined ||
      payload.profileColor !== undefined ||
      payload.fontFamily !== undefined ||
      payload.bioColor !== undefined ||
      payload.iconColor !== undefined
    ) {
      const updateData: HeaderCustomizationData = {};
      if (payload.titleFontFamily !== undefined) {
        updateData.titleFontFamily = payload.titleFontFamily as FontFamily | null;
      }
      if (payload.titleFontWeight !== undefined) {
        updateData.titleFontWeight = payload.titleFontWeight as titleFontWeight | null;
      }
      if (payload.titleFontSize !== undefined) {
        updateData.titleFontSize = payload.titleFontSize as titleFontSize | null;
      }
      if (payload.titleColor !== undefined) {
        updateData.titleColor = payload.titleColor;
      }
      if (payload.profileFontSize !== undefined) {
        updateData.profileFontSize = payload.profileFontSize as profileFontSize | null;
      }
      if (payload.profileColor !== undefined) {
        updateData.profileColor = payload.profileColor;
      }
      if (payload.bioColor !== undefined) {
        updateData.bioColor = payload.bioColor;
      }
      if (payload.fontFamily !== undefined) {
        updateData.fontFamily = payload.fontFamily as FontFamily | null;
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
  if (user.username) {
    revalidatePath(`/${user.username}`);
  }
}