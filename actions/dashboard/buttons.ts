"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { ButtonRadius, ButtonShadow, ButtonStyle } from "@/app/generated/prisma/enums";

type SaveButtonsPayload = {
  buttonStyle?: string | null;
  buttonRadius?: string | null;
  buttonShadow?: string | null;
  buttonColor?: string | null;
  buttonTextColor?: string | null;
  outlineColor?: string | null;
  shadowColor?: string | null;
};

type ButtonsCustomizationData = {
  buttonStyle?: ButtonStyle | null;
  buttonRadius?: ButtonRadius | null;
  buttonShadow?: ButtonShadow | null;
  buttonColor?: string | null;
  buttonTextColor?: string | null;
  outlineColor?: string | null;
  shadowColor?: string | null;
};

export async function saveButtonsDesignAction(payload: SaveButtonsPayload) {
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

  const updateData: ButtonsCustomizationData = {};
  if (payload.buttonStyle !== undefined) updateData.buttonStyle = payload.buttonStyle as ButtonStyle | null;
  if (payload.buttonRadius !== undefined) updateData.buttonRadius = payload.buttonRadius as ButtonRadius | null;
  if (payload.buttonShadow !== undefined) updateData.buttonShadow = payload.buttonShadow as ButtonShadow | null;
  if (payload.buttonColor !== undefined) updateData.buttonColor = payload.buttonColor;
  if (payload.buttonTextColor !== undefined) updateData.buttonTextColor = payload.buttonTextColor;
  if (payload.outlineColor !== undefined) updateData.outlineColor = payload.outlineColor;
  if (payload.shadowColor !== undefined) updateData.shadowColor = payload.shadowColor;

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