import { authOptions } from "@/lib/auth";
import { getOnboardingRedirectPath } from "@/lib/onboarding";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    redirect("/signup");
  }

  if (!session.user.onboardingDone) {
    redirect(getOnboardingRedirectPath(session.user.onboardingStep));
  }

  redirect("/dashboard/links");
}