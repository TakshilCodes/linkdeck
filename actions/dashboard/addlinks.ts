"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fallbackTitleFromUrl, fetchPageTitle, normalizeUrl } from "@/lib/links";

async function getNextBoardPosition(userId: string) {
  const lastBoardItem = await prisma.boardItem.findFirst({
    where: { userId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  return lastBoardItem ? lastBoardItem.position + 1 : 0;
}

export async function createLinkAction(rawUrl: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;
    const normalized = normalizeUrl(rawUrl);

    if (!normalized.success) {
      return {
        success: false,
        message: normalized.error,
      };
    }

    const url = normalized.url;
    const fetchedTitle = await fetchPageTitle(url);
    const name = fetchedTitle || fallbackTitleFromUrl(url);
    const nextBoardPosition = await getNextBoardPosition(userId);

    await prisma.$transaction(async (tx) => {
      const link = await tx.link.create({
        data: {
          userId,
          name,
          url,
          isVisible: true,
          collectionId: null,
          position: 0,
        },
        select: {
          id: true,
        },
      });

      await tx.boardItem.create({
        data: {
          userId,
          type: "LINK",
          position: nextBoardPosition,
          linkId: link.id,
        },
      });
    });

    return {
      success: true,
      message: "Link added",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to add link",
    };
  }
}

export async function createCollectionAction() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    const totalCollections = await prisma.collection.count({
      where: { userId },
    });

    const defaultName = `Collection ${totalCollections + 1}`;
    const nextBoardPosition = await getNextBoardPosition(userId);

    await prisma.$transaction(async (tx) => {
      const collection = await tx.collection.create({
        data: {
          userId,
          name: defaultName,
          isVisible: true,
          position: 0,
        },
        select: {
          id: true,
        },
      });

      await tx.boardItem.create({
        data: {
          userId,
          type: "COLLECTION",
          position: nextBoardPosition,
          collectionId: collection.id,
        },
      });
    });

    return {
      success: true,
      message: "Collection added",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to add collection",
    };
  }
}