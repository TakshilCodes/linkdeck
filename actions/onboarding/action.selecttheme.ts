"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function selectThemeAction(themeId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const theme = await prisma.defaultTheme.findUnique({
    where: { id: themeId },
    select: { id: true },
  });

  if (!theme) {
    throw new Error("Theme not found");
  }

  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      defaultThemeId: theme.id,
      onboardingStep: "PLATFORMS",
    },
  });

  redirect("/onboarding?step=platforms");
}

export async function skipThemeAction() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const defaultTheme = await prisma.defaultTheme.findFirst({
    where: { isDefault: true },
    select: { id: true },
  });

  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      defaultThemeId: defaultTheme?.id ?? null,
      onboardingStep: "PLATFORMS",
    },
  });

  redirect("/onboarding?step=platforms");
}