"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { fallbackTitleFromUrl, fetchPageTitle, normalizeUrl } from "@/lib/links";

async function getUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

async function getNextBoardPosition(userId: string) {
  const last = await prisma.boardItem.findFirst({
    where: { userId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  return last ? last.position + 1 : 0;
}

async function getNextCollectionLinkPosition(collectionId: string) {
  const last = await prisma.link.findFirst({
    where: { collectionId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  return last ? last.position + 1 : 0;
}

export async function saveTopLevelBoardOrderAction(items: {
  id: string;
  type: "LINK" | "COLLECTION";
  position: number;
}[]) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.boardItem.updateMany({
          where: {
            userId,
            type: item.type,
            ...(item.type === "LINK"
              ? { linkId: item.id }
              : { collectionId: item.id }),
          },
          data: {
            position: item.position,
          },
        })
      )
    );

    return { success: true, message: "Board order saved" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to save board order" };
  }
}

export async function saveCollectionLinksOrderAction(payload: {
  collectionId: string;
  links: { id: string; position: number }[];
}) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const collection = await prisma.collection.findFirst({
      where: {
        id: payload.collectionId,
        userId,
      },
      select: { id: true },
    });

    if (!collection) {
      return { success: false, message: "Collection not found" };
    }

    await prisma.$transaction(
      payload.links.map((link) =>
        prisma.link.updateMany({
          where: {
            id: link.id,
            userId,
            collectionId: payload.collectionId,
          },
          data: {
            position: link.position,
          },
        })
      )
    );

    return { success: true, message: "Collection order saved" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to save collection order" };
  }
}

export async function createCollectionAction() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const count = await prisma.collection.count({
      where: { userId },
    });

    const boardPosition = await getNextBoardPosition(userId);

    const collection = await prisma.collection.create({
      data: {
        userId,
        name: `Collection ${count + 1}`,
        isVisible: true,
        position: count,
      },
      select: {
        id: true,
        name: true,
      },
    });

    await prisma.boardItem.create({
      data: {
        userId,
        type: "COLLECTION",
        position: boardPosition,
        collectionId: collection.id,
      },
    });

    return { success: true, message: "Collection created" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create collection" };
  }
}

export async function createRootLinkAction({
  rawUrl,
}: {
  rawUrl: string;
}) {
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

    const lastBoardItem = await prisma.boardItem.findFirst({
      where: { userId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const nextBoardPosition = lastBoardItem ? lastBoardItem.position + 1 : 0;

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
        select: { id: true },
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

export async function createLinkInCollectionAction({
  rawUrl,
  collectionId,
}: {
  rawUrl: string;
  collectionId: string;
}) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
      select: { id: true },
    });

    if (!collection) {
      return { success: false, message: "Collection not found" };
    }

    const nextPosition = await getNextCollectionLinkPosition(collectionId);

    await prisma.link.create({
      data: {
        userId,
        collectionId,
        name: rawUrl,
        url: rawUrl,
        isVisible: true,
        clickCount: 0,
        position: nextPosition,
      },
    });

    return { success: true, message: "Link added" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add link" };
  }
}

export async function updateCollectionAction({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.collection.updateMany({
      where: { id, userId },
      data: { name: name.trim() },
    });

    return { success: true, message: "Collection updated" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update collection" };
  }
}

export async function updateLinkAction({
  id,
  name,
  url,
}: {
  id: string;
  name: string;
  url: string;
}) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.link.updateMany({
      where: { id, userId },
      data: {
        name: name.trim(),
        url: url.trim(),
      },
    });

    return { success: true, message: "Link updated" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update link" };
  }
}

export async function setLinkVisibilityAction({
  id,
  isVisible,
}: {
  id: string;
  isVisible: boolean;
}) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.link.updateMany({
      where: { id, userId },
      data: { isVisible },
    });

    return { success: true, message: "Visibility updated" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update visibility" };
  }
}

export async function deleteLinkAction({ id }: { id: string }) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.boardItem.deleteMany({
        where: {
          userId,
          linkId: id,
        },
      });

      await tx.link.deleteMany({
        where: {
          id,
          userId,
        },
      });
    });

    return { success: true, message: "Link deleted" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete link" };
  }
}

export async function saveBoardStateAction(payload: {
  topLevel: {
    id: string;
    type: "LINK" | "COLLECTION";
    position: number;
  }[];
  collectionLinks: {
    collectionId: string;
    links: {
      id: string;
      position: number;
    }[];
  }[];
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    await prisma.$transaction(async (tx) => {
      for (const item of payload.topLevel) {
        const updated = await tx.boardItem.updateMany({
          where: {
            userId,
            ...(item.type === "LINK"
              ? { linkId: item.id }
              : { collectionId: item.id }),
          },
          data: {
            position: item.position,
          },
        });

        if (item.type === "LINK") {
          await tx.link.updateMany({
            where: {
              id: item.id,
              userId,
            },
            data: {
              collectionId: null,
              // Root ordering is BoardItem.position; keep Link.position aligned for Studio/queries.
              position: item.position,
            },
          });

          // Nested links never had a BoardItem row — create one when moving out of a collection.
          if (updated.count === 0) {
            await tx.boardItem.create({
              data: {
                userId,
                type: "LINK",
                position: item.position,
                linkId: item.id,
              },
            });
          }
        }
      }

      const topLevelLinkIds = payload.topLevel
        .filter((item) => item.type === "LINK")
        .map((item) => item.id);

      for (const collection of payload.collectionLinks) {
        for (const link of collection.links) {
          await tx.link.updateMany({
            where: {
              id: link.id,
              userId,
            },
            data: {
              collectionId: collection.collectionId,
              position: link.position,
            },
          });

          await tx.boardItem.deleteMany({
            where: {
              userId,
              linkId: link.id,
              NOT: {
                linkId: {
                  in: topLevelLinkIds,
                },
              },
            },
          });
        }
      }
    });

    return { success: true, message: "Board saved" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save board",
    };
  }
}