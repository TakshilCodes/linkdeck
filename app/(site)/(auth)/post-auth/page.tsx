import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PostAuthPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { default: prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    select: { username: true },
  });

  if (!user) {
    redirect("/login");
  }

  if (!user.username) {
    redirect("/onboarding?step=username&mode=oauth");
  }

  redirect("/dashboard");
}