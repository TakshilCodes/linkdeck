import type { Metadata } from "next";
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
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";
import { resolveSocialUrl } from "@/lib/social-icons";

export const dynamic = "force-dynamic";

type PublicProfileParams = {
  params: Promise<{ username: string }>;
};

function cleanDescription(value: string | null | undefined, fallback: string) {
  const normalized = value?.replace(/\s+/g, " ").trim();
  return normalized || fallback;
}

function publicHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PublicProfileParams): Promise<Metadata> {
  const { username } = await params;
  const { default: prisma } = await import("@/lib/prisma");

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      username: true,
      displayName: true,
      bio: true,
      profileImgUrl: true,
      onboardingDone: true,
    },
  });

  if (!user) {
    notFound();
  }

  const displayName = user.displayName?.trim() || user.username || username;
  const title = user.displayName?.trim()
    ? `${displayName} (@${user.username}) | LinkDeck`
    : `@${user.username} | LinkDeck`;
  const description = cleanDescription(
    user.bio,
    `View ${displayName}'s links, socials, and profile on LinkDeck.`
  );

  return createPageMetadata({
    title,
    description,
    path: `/${username}`,
    image: user.profileImgUrl,
    noIndex: !user.onboardingDone,
    keywords: [displayName, `@${user.username}`, "LinkDeck profile"],
  });
}

export default async function PublicProfilePage({ params }: PublicProfileParams) {
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
  const displayName = user.displayName?.trim() || user.username || username;
  const sameAs = user.icons
    .map((icon) => publicHttpUrl(resolveSocialUrl(icon.type, icon.value)))
    .filter((url): url is string => Boolean(url));

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: displayName,
    alternateName: user.username ? `@${user.username}` : undefined,
    description: user.bio || undefined,
    image: user.profileImgUrl ? absoluteUrl(user.profileImgUrl) : undefined,
    url: absoluteUrl(`/${username}`),
    sameAs,
  };

  return (
    <>
      <JsonLd data={personJsonLd} />
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
    </>
  );
}
