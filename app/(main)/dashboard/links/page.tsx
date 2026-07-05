import GlassCard from "@/components/ui/GlassCard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import ProfileHeader from "./ProfileHeader";
import { redirect } from "next/navigation";
import LinksBoard from "./LinkBoard";

export const dynamic = "force-dynamic";

export default async function DashboardLinksPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    redirect("/signup");
  }

  const { default: prisma } = await import("@/lib/prisma");
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
      <div className="-mx-4 mb-6 hidden border-b border-[#202833] bg-[#07101C] px-5 py-4 sm:-mx-6 md:block lg:-mx-8">
        <p className="text-2xl font-semibold text-white">Links</p>
      </div>

      <GlassCard className="rounded-none border-0 bg-transparent px-3 py-0 shadow-none backdrop-blur-none md:rounded-[28px] md:border md:border-white/10 md:bg-white/5 md:px-5 md:py-6 md:shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.03)] md:backdrop-blur-xl">
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