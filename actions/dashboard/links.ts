"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { fallbackTitleFromUrl, normalizeUrl } from "@/lib/links";
import { fetchPageTitle } from "@/lib/server/fetch-page-title";

type ActionUser = {
  id: string;
  username: string | null;
};

async function getActionUser(): Promise<ActionUser | null> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  return {
    id: userId,
    username: session.user.username ?? null,
  };
}

function revalidateBoardViews(username: string | null) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/links");

  if (username) {
    revalidatePath(`/${username}`);
  }
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

async function resolveNewLinkDetails(rawUrl: string) {
  const normalized = normalizeUrl(rawUrl);

  if (!normalized.success) {
    return normalized;
  }

  const url = normalized.url;
  const fetchedTitle = await fetchPageTitle(url);

  return {
    success: true as const,
    url,
    name: fetchedTitle || fallbackTitleFromUrl(url),
  };
}

export async function saveTopLevelBoardOrderAction(items: {
  id: string;
  type: "LINK" | "COLLECTION";
  position: number;
}[]) {
  try {
    const user = await getActionUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.boardItem.updateMany({
          where: {
            userId: user.id,
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

    revalidateBoardViews(user.username);
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
    const user = await getActionUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const collection = await prisma.collection.findFirst({
      where: {
        id: payload.collectionId,
        userId: user.id,
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
            userId: user.id,
            collectionId: payload.collectionId,
          },
          data: {
            position: link.position,
          },
        })
      )
    );

    revalidateBoardViews(user.username);
    return { success: true, message: "Collection order saved" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to save collection order" };
  }
}

export async function createCollectionAction() {
  try {
    const user = await getActionUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.$transaction(async (tx) => {
      const [collectionCount, lastBoardItem] = await Promise.all([
        tx.collection.count({ where: { userId: user.id } }),
        tx.boardItem.findFirst({
          where: { userId: user.id },
          orderBy: { position: "desc" },
          select: { position: true },
        }),
      ]);

      const collection = await tx.collection.create({
        data: {
          userId: user.id,
          name: `Collection ${collectionCount + 1}`,
          isVisible: true,
          position: collectionCount,
        },
        select: {
          id: true,
        },
      });

      await tx.boardItem.create({
        data: {
          userId: user.id,
          type: "COLLECTION",
          position: lastBoardItem ? lastBoardItem.position + 1 : 0,
          collectionId: collection.id,
        },
      });
    });

    revalidateBoardViews(user.username);
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
    const user = await getActionUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const linkDetails = await resolveNewLinkDetails(rawUrl);

    if (!linkDetails.success) {
      return {
        success: false,
        message: linkDetails.error,
      };
    }

    const { name, url } = linkDetails;
    const nextBoardPosition = await getNextBoardPosition(user.id);

    await prisma.$transaction(async (tx) => {
      const link = await tx.link.create({
        data: {
          userId: user.id,
          name,
          url,
          isVisible: true,
          collectionId: null,
          position: nextBoardPosition,
        },
        select: { id: true },
      });

      await tx.boardItem.create({
        data: {
          userId: user.id,
          type: "LINK",
          position: nextBoardPosition,
          linkId: link.id,
        },
      });
    });

    revalidateBoardViews(user.username);
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
    const user = await getActionUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!collection) {
      return { success: false, message: "Collection not found" };
    }

    const linkDetails = await resolveNewLinkDetails(rawUrl);

    if (!linkDetails.success) {
      return {
        success: false,
        message: linkDetails.error,
      };
    }

    const nextPosition = await getNextCollectionLinkPosition(collectionId);

    await prisma.link.create({
      data: {
        userId: user.id,
        collectionId,
        name: linkDetails.name,
        url: linkDetails.url,
        isVisible: true,
        clickCount: 0,
        position: nextPosition,
      },
    });

    revalidateBoardViews(user.username);
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
    const user = await getActionUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.collection.updateMany({
      where: { id, userId: user.id },
      data: { name: name.trim() },
    });

    revalidateBoardViews(user.username);
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
    const user = await getActionUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const normalized = normalizeUrl(url);

    if (!normalized.success) {
      return {
        success: false,
        message: normalized.error,
      };
    }

    await prisma.link.updateMany({
      where: { id, userId: user.id },
      data: {
        name: name.trim() || fallbackTitleFromUrl(normalized.url),
        url: normalized.url,
      },
    });

    revalidateBoardViews(user.username);
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
    const user = await getActionUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.link.updateMany({
      where: { id, userId: user.id },
      data: { isVisible },
    });

    revalidateBoardViews(user.username);
    return { success: true, message: "Visibility updated" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update visibility" };
  }
}

export async function deleteLinkAction({ id }: { id: string }) {
  try {
    const user = await getActionUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.boardItem.deleteMany({
        where: {
          userId: user.id,
          linkId: id,
        },
      });

      await tx.link.deleteMany({
        where: {
          id,
          userId: user.id,
        },
      });
    });

    revalidateBoardViews(user.username);
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
    const user = await getActionUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.$transaction(async (tx) => {
      const requestedCollectionIds = [
        ...new Set(payload.collectionLinks.map((collection) => collection.collectionId)),
      ];

      if (requestedCollectionIds.length > 0) {
        const ownedCollections = await tx.collection.findMany({
          where: {
            userId: user.id,
            id: { in: requestedCollectionIds },
          },
          select: { id: true },
        });
        const ownedCollectionIds = new Set(
          ownedCollections.map((collection) => collection.id)
        );

        if (
          requestedCollectionIds.some(
            (collectionId) => !ownedCollectionIds.has(collectionId)
          )
        ) {
          throw new Error("Invalid collection in board payload");
        }
      }

      for (const item of payload.topLevel) {
        const updated = await tx.boardItem.updateMany({
          where: {
            userId: user.id,
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
              userId: user.id,
            },
            data: {
              collectionId: null,
              position: item.position,
            },
          });

          // Nested links have no BoardItem row until they move back to the root board.
          if (updated.count === 0) {
            await tx.boardItem.create({
              data: {
                userId: user.id,
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
              userId: user.id,
            },
            data: {
              collectionId: collection.collectionId,
              position: link.position,
            },
          });

          await tx.boardItem.deleteMany({
            where: {
              userId: user.id,
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

    revalidateBoardViews(user.username);
    return { success: true, message: "Board saved" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to save board state" };
  }
}

export async function deleteCollectionAction({ id }: { id: string }) {
  try {
    const user = await getActionUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.link.deleteMany({
        where: {
          collectionId: id,
          userId: user.id,
        },
      });

      await tx.collection.deleteMany({
        where: {
          id,
          userId: user.id,
        },
      });
    });

    revalidateBoardViews(user.username);
    return { success: true, message: "Collection and its links deleted" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete collection" };
  }
}
