"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { IconType } from "@/app/generated/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function savePlatformsAction(platforms: IconType[]) {
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
    await tx.socialIcon.deleteMany({
      where: { userId: user.id },
    });

    if (platforms.length > 0) {
      await tx.socialIcon.createMany({
        data: platforms.map((platform, index) => ({
          userId: user.id,
          type: platform,
          url: "",
          position: index,
          isVisible: true,
          label: null,
        })),
      });
    }

    await tx.user.update({
      where: { id: user.id },
      data: {
        onboardingStep: "LINKS",
      },
    });
  });

  redirect("/onboarding?step=links");
}

export async function skipPlatformsAction() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      onboardingStep: "LINKS",
    },
  });

  redirect("/onboarding?step=links");
}