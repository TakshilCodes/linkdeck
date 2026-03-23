"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const profileSchema = z.object({
  displayName: z.string().trim().min(2, "Display name must be at least 2 characters.").max(40, "Display name must be at most 40 characters."),
  bio: z.string().trim().max(160, "Bio must be at most 160 characters.").optional().or(z.literal("")),
  profileImgUrl: z.string().url("Invalid image URL.").optional().or(z.literal("")),
});

export async function saveProfileAction(input: {
  displayName: string;
  bio?: string;
  profileImgUrl?: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid profile data.");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      displayName: parsed.data.displayName,
      bio: parsed.data.bio || null,
      profileImgUrl: parsed.data.profileImgUrl || null,
      onboardingStep: "DONE",
      onboardingDone: true,
    },
  });

  redirect("/dashboard");
}

export async function skipProfileAction() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      onboardingStep: "DONE",
      onboardingDone: true,
    },
  });

  redirect("/dashboard");
}