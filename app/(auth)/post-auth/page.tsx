
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function PostAuthPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    select: { username: true },
  });

  if (!user) {
    redirect("/signin");
  }

  if (!user.username) {
    redirect("/onboarding?step=username&mode=oauth");
  }

  redirect("/dashboard");
}