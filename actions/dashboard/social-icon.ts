"use server";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { IconType } from "@/app/generated/prisma/enums";
import { getIconByType, normalizeSocialValue } from "@/lib/social-icons";

type AddSocialIconInput = {
  type: IconType;
  value: string;
};

type UpdateSocialIconInput = {
  id: string;
  value: string;
};

const socialIconSelect = {
  id: true,
  type: true,
  value: true,
  label: true,
  isVisible: true,
  position: true,
} as const;

function validateSocialIconValue(type: IconType, value: string) {
  const meta = getIconByType(type);

  if (!meta) {
    throw new Error("Invalid platform");
  }

  const normalizedValue = normalizeSocialValue(type, value);

  if (meta.inputMode === "url") {
    const isValidUrl = /^https?:\/\/.+/i.test(normalizedValue);
    if (!isValidUrl) {
      throw new Error("Please enter a valid full URL");
    }
  }

  if (meta.inputMode === "email") {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue);
    if (!isValidEmail) {
      throw new Error("Please enter a valid email address");
    }
  }

  return normalizedValue;
}

function revalidateSocialIconPaths(username?: string | null) {
  revalidatePath("/dashboard/links");

  if (username) {
    revalidatePath(`/${username}`);
  }
}

export async function deleteSocialIconAction(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const existingIcon = await prisma.socialIcon.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingIcon) {
      return {
        success: false,
        message: "Social icon not found",
      };
    }

    await prisma.socialIcon.delete({
      where: {
        id,
      },
    });

    revalidateSocialIconPaths(session.user.username);

    return {
      success: true,
      message: "Social icon deleted",
    };
  } catch (error) {
    console.error("deleteSocialIconAction error:", error);

    return {
      success: false,
      message: "Failed to delete social icon",
    };
  }
}

export async function reorderSocialIconsAction(
  items: { id: string; position: number }[]
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    const ids = items.map((item) => item.id);

    const existingIcons = await prisma.socialIcon.findMany({
      where: {
        userId,
        id: { in: ids },
      },
      select: { id: true },
    });

    if (existingIcons.length !== items.length) {
      return { success: false, message: "Some icons were not found" };
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.socialIcon.update({
          where: { id: item.id },
          data: { position: item.position },
        })
      )
    );

    revalidateSocialIconPaths(session.user.username);

    return { success: true, message: "Order updated" };
  } catch (error) {
    console.error("reorderSocialIconsAction error:", error);
    return { success: false, message: "Failed to reorder icons" };
  }
}

export async function updateSocialIconVisibilityAction({
  id,
  isVisible,
}: {
  id: string;
  isVisible: boolean;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const existingIcon = await prisma.socialIcon.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingIcon) {
      return {
        success: false,
        message: "Social icon not found",
      };
    }

    const icon = await prisma.socialIcon.update({
      where: {
        id,
      },
      data: {
        isVisible,
      },
      select: socialIconSelect,
    });

    revalidateSocialIconPaths(session.user.username);

    return {
      success: true,
      message: "Visibility updated",
      icon,
    };
  } catch (error) {
    console.error("updateSocialIconVisibilityAction error:", error);

    return {
      success: false,
      message: "Failed to update visibility",
    };
  }
}

export async function updateSocialIconAction(input: UpdateSocialIconInput) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const existingIcon = await prisma.socialIcon.findFirst({
      where: {
        id: input.id,
        userId: session.user.id,
      },
      select: {
        id: true,
        type: true,
      },
    });

    if (!existingIcon) {
      throw new Error("Social icon not found");
    }

    const normalizedValue = validateSocialIconValue(
      existingIcon.type,
      input.value
    );

    const icon = await prisma.socialIcon.update({
      where: {
        id: input.id,
      },
      data: {
        value: normalizedValue,
      },
      select: socialIconSelect,
    });

    revalidateSocialIconPaths(session.user.username);

    return { success: true, icon };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update social icon",
    };
  }
}

export async function addSocialIconAction(input: AddSocialIconInput) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;
    const normalizedValue = validateSocialIconValue(input.type, input.value);

    const lastItem = await prisma.socialIcon.findFirst({
      where: { userId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const nextPosition = lastItem ? lastItem.position + 1 : 0;

    const icon = await prisma.socialIcon.create({
      data: {
        userId,
        type: input.type,
        value: normalizedValue,
        position: nextPosition,
      },
      select: socialIconSelect,
    });

    revalidateSocialIconPaths(session.user.username);

    return { success: true, icon };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to add social icon",
    };
  }
}