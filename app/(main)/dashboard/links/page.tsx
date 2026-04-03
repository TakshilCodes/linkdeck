import GlassCard from "@/components/ui/GlassCard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import ProfileHeader from "./ProfileHeader";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import LinksBoard from "./LinkBoard";
import DashboardLivePreview from "./DashboardLivePreview";
import { mergeTheme } from "@/lib/themes/merge-theme";
import type { CustomTheme, DefaultTheme, ResolvedTheme } from "@/types/theme";
import type { BoardItem } from "@/types/board-types";
import {
  buildBoardPreviewPayload,
  mapIconsForThemePreview,
} from "@/utils/dashboard-theme-preview";

export default async function DashboardLinksPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    redirect("/signup");
  }

  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      displayName: true,
      username: true,
      bio: true,
      profileImgUrl: true,
      defaultTheme: true,
      customization: true,
      icons: {
        orderBy: { position: "asc" },
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

  if (!data) {
    redirect("/signup");
  }

  const resolvedTheme: ResolvedTheme | null = data.defaultTheme
    ? mergeTheme(data.defaultTheme as DefaultTheme, data.customization as CustomTheme | null)
    : null;

  const themeForClient = resolvedTheme
    ? (JSON.parse(JSON.stringify(resolvedTheme)) as ResolvedTheme)
    : null;

  const boardItems = (data.boardItems ?? []) as BoardItem[];
  const { standaloneLinks, collections } = buildBoardPreviewPayload(boardItems);
  const previewIcons = mapIconsForThemePreview(data.icons);

  return (
    <div className="min-h-screen bg-[#07101C]">
      <p className="border-b border-[#202833] bg-[#07101C] px-5 py-4 text-2xl font-semibold text-white">
        Links
      </p>

      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <GlassCard className="rounded-[28px] px-4 py-5 sm:px-5 sm:py-6">
              <div className="space-y-6">
                <ProfileHeader
                  username={data.username ?? ""}
                  bio={data.bio}
                  profileImgUrl={data.profileImgUrl}
                  icons={data.icons}
                  displayName={data.displayName}
                />

                <LinksBoard boardItems={data.boardItems ?? []} />
              </div>
            </GlassCard>
          </div>

          <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-[min(100%,404px)] xl:w-[min(100%,428px)]">
            <DashboardLivePreview
              username={data.username ?? ""}
              theme={themeForClient}
              profile={{
                username: data.username,
                displayName: data.displayName,
                profileImgUrl: data.profileImgUrl,
                bio: data.bio,
              }}
              icons={previewIcons}
              standaloneLinks={standaloneLinks}
              collections={collections}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}