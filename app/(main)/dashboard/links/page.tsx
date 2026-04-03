import GlassCard from "@/components/ui/GlassCard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import ProfileHeader from "./ProfileHeader";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import LinksBoard from "./LinkBoard";

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

  return (
    <>
      <div className="-mx-4 mb-6 border-b border-[#202833] bg-[#07101C] px-5 py-4 sm:-mx-6 lg:-mx-8">
        <p className="text-2xl font-semibold text-white">Links</p>
      </div>

      <GlassCard className="rounded-[28px] px-4 py-5 sm:px-5 sm:py-6">
        <div>
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
    </>
  );
}
