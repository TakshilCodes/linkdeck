import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AccountSettingsContainer, { type AccountUserProps } from "@/components/account/AccountSettingsContainer";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { default: prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      username: true,
      bio: true,
      profileImgUrl: true,
      authProvider: true,
      createdAt: true,
      hashedPassword: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const accountUser: AccountUserProps = {
    id: user.id,
    email: user.email,
    username: user.username,
    bio: user.bio,
    profileImgUrl: user.profileImgUrl,
    authProvider: user.authProvider,
    createdAt: user.createdAt,
    hasPassword: Boolean(user.hashedPassword),
  };

  return <AccountSettingsContainer user={accountUser} />;
}