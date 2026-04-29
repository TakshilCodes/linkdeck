import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { mergeTheme } from "@/lib/themes/merge-theme";
import type { CustomTheme, DefaultTheme } from "@/types/theme";
import { CUSTOM_BASE_THEME } from "@/types/theme";
import ThemeProfileRenderer from "@/components/theme/ThemeProfileRenderer";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      defaultTheme: true,
      customization: true,
      icons: {
        where: { isVisible: true },
        orderBy: { position: "asc" },
      },
      collections: {
        where: { isVisible: true },
        orderBy: { position: "asc" },
        include: {
          links: {
            where: { isVisible: true },
            orderBy: { position: "asc" },
          },
        },
      },
      links: {
        where: {
          isVisible: true,
          collectionId: null,
        },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const baseTheme = user.defaultTheme || CUSTOM_BASE_THEME;

  const resolvedTheme = mergeTheme(
    baseTheme as DefaultTheme,
    user.customization as CustomTheme | null
  );

  return (
    <ThemeProfileRenderer
      theme={resolvedTheme}
      profile={{
        username: user.username,
        displayName: user.displayName,
        profileImgUrl: user.profileImgUrl,
        bio: user.bio,
      }}
      icons={user.icons}
      standaloneLinks={user.links}
      collections={user.collections}
      showBranding={true}
    />
  );
}