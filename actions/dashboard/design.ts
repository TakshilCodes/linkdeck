"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveThemeAction(themeId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  if (themeId !== "custom") {
    const theme = await prisma.defaultTheme.findUnique({
      where: { id: themeId },
      select: { id: true },
    });

    if (!theme) {
      throw new Error("Theme not found");
    }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, username: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        email: session.user.email!,
      },
      data: {
        defaultThemeId: themeId === "custom" ? null : themeId,
      },
    });

    if (themeId !== "custom") {
      await tx.userCustomization.deleteMany({
        where: { userId: user.id },
      });
    }
  });

  revalidatePath("/dashboard");
  if (user.username) {
    revalidatePath(`/${user.username}`);
  }
}