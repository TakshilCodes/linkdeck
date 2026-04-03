import prisma from "@/lib/prisma";
import { mergeTheme } from "@/lib/themes/merge-theme";
import type { CustomTheme, DefaultTheme, ResolvedTheme } from "@/types/theme";
import type { BoardItem } from "@/types/board-types";
import {
  buildBoardPreviewPayload,
  mapIconsForThemePreview,
} from "@/utils/dashboard-theme-preview";

const previewUserSelect={
  username: true,
  displayName: true,
  bio: true,
  profileImgUrl: true,
  defaultTheme: true,
  customization: true,
  icons: {
    orderBy: { position: "asc" as const },
  },
  boardItems: {
    orderBy: { position: "asc" as const },
    select: {
      id: true,
      type: true,
      position: true,
      link: {
        select: {
          id: true,
          name: true,
          url: true,
          isVisible: true,
          clickCount: true,
          position: true,
          collectionId: true,
        },
      },
      collection: {
        select: {
          id: true,
          name: true,
          isVisible: true,
          position: true,
          links: {
            orderBy: { position: "asc" as const },
            select: {
              id: true,
              name: true,
              url: true,
              isVisible: true,
              clickCount: true,
              position: true,
              collectionId: true,
            },
          },
        },
      },
    },
  },
} as const;

export type DashboardPreviewPayload = {
  username: string;
  themeForClient: ResolvedTheme | null;
  profile: {
    username: string | null;
    displayName: string | null;
    profileImgUrl: string | null;
    bio: string | null;
  };
  icons: ReturnType<typeof mapIconsForThemePreview>;
  standaloneLinks: ReturnType<typeof buildBoardPreviewPayload>["standaloneLinks"];
  collections: ReturnType<typeof buildBoardPreviewPayload>["collections"];
};

export async function getDashboardPreviewPayload(
  userId: string
): Promise<DashboardPreviewPayload | null> {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: previewUserSelect,
  });

  if (!data) return null;

  const resolvedTheme: ResolvedTheme | null = data.defaultTheme
    ? mergeTheme(data.defaultTheme as DefaultTheme, data.customization as CustomTheme | null)
    : null;

  const themeForClient = resolvedTheme
    ? (JSON.parse(JSON.stringify(resolvedTheme)) as ResolvedTheme)
    : null;

  const boardItems = (data.boardItems ?? []) as BoardItem[];
  const { standaloneLinks, collections } = buildBoardPreviewPayload(boardItems);
  const previewIcons = mapIconsForThemePreview(data.icons);

  return {
    username: data.username ?? "",
    themeForClient,
    profile: {
      username: data.username,
      displayName: data.displayName,
      profileImgUrl: data.profileImgUrl,
      bio: data.bio,
    },
    icons: previewIcons,
    standaloneLinks,
    collections,
  };
}
