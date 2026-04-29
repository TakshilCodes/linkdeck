import prisma from "@/lib/prisma";
import DesignTabContent from "@/components/dashboard/design/DesignTabContent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardDesignPage() {
  const session = await getServerSession(authOptions);

  const [themes, user] = await Promise.all([
    prisma.defaultTheme.findMany({
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    }),
    session?.user?.email
      ? prisma.user.findUnique({
          where: { email: session.user.email },
          select: { 
            defaultThemeId: true,
            username: true,
            displayName: true,
            profileImgUrl: true,
            customization: true,
          },
        })
      : null,
  ]);

  return (
    <div className="flex h-full flex-col">
      <DesignTabContent 
        themes={themes} 
        currentThemeId={user?.defaultThemeId}
        initialProfile={{
          username: user?.username,
          displayName: user?.displayName,
          profileImgUrl: user?.profileImgUrl,
        }}
        initialCustomization={user?.customization}
      />
    </div>
  );
}
