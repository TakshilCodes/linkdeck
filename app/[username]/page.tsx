import { notFound } from "next/navigation";
import { mergeTheme } from "@/lib/themes/merge-theme";
import type { CustomTheme, DefaultTheme } from "@/types/theme";
import { CUSTOM_BASE_THEME } from "@/types/theme";
import ThemeProfileRenderer from "@/components/theme/ThemeProfileRenderer";
import { trackProfileView } from "@/actions/analytics/track-profile-view";
import type { BoardItem } from "@/types/board-types";
import {
  buildBoardPreviewPayload,
  mapIconsForThemePreview,
} from "@/utils/dashboard-theme-preview";

export const dynamic = "force-dynamic";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { default: prisma } = await import("@/lib/prisma");

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      profileImgUrl: true,
      bio: true,
      defaultTheme: true,
      customization: true,
      icons: {
        where: { isVisible: true },
        orderBy: { position: "asc" },
        select: {
          id: true,
          type: true,
          value: true,
          label: true,
          isVisible: true,
          position: true,
        },
      },
      boardItems: {
        orderBy: { position: "asc" },
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
                orderBy: { position: "asc" },
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
    },
  });

  if (!user) {
    notFound();
  }

  trackProfileView(user.id).catch(console.error);

  const baseTheme = user.defaultTheme || CUSTOM_BASE_THEME;
  const resolvedTheme = mergeTheme(
    baseTheme as DefaultTheme,
    user.customization as CustomTheme | null
  );
  const boardPayload = buildBoardPreviewPayload(user.boardItems as BoardItem[]);

  return (
    <ThemeProfileRenderer
      theme={resolvedTheme}
      profile={{
        username: user.username,
        displayName: user.displayName,
        profileImgUrl: user.profileImgUrl,
        bio: user.bio,
      }}
      icons={mapIconsForThemePreview(user.icons)}
      standaloneLinks={boardPayload.standaloneLinks}
      collections={boardPayload.collections}
      sections={boardPayload.sections}
    />
  );
}
