"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type SaveButtonsPayload = {
  buttonStyle?: string;
  buttonRadius?: string;
  buttonShadow?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  outlineColor?: string;
  shadowColor?: string;
};

export async function saveButtonsDesignAction(payload: SaveButtonsPayload) {
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
  if (payload.buttonStyle !== undefined) updateData.buttonStyle = payload.buttonStyle;
  if (payload.buttonRadius !== undefined) updateData.buttonRadius = payload.buttonRadius;
  if (payload.buttonShadow !== undefined) updateData.buttonShadow = payload.buttonShadow;
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
  revalidatePath("/[username]");
}
