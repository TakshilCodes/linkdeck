import { authOptions } from "@/lib/auth";
import { getDashboardPreviewPayload } from "@/lib/dashboard-preview";
import { getOnboardingRedirectPath } from "@/lib/onboarding";
import DashboardMobilePreview from "@/components/dashboard/mobile/DashboardMobilePreview";
import DashboardPreviewAside from "@/components/dashboard/DashboardPreviewAside";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/signup");
  }

  if (!session.user.onboardingDone) {
    redirect(getOnboardingRedirectPath(session.user.onboardingStep));
  }

  const preview = await getDashboardPreviewPayload(userId);
  if (!preview) {
    redirect("/signup");
  }

  return (
    <div className="min-h-screen bg-[#07101C] md:bg-[#07101C]">
      <DashboardMobilePreview
        theme={preview.themeForClient}
        profile={preview.profile}
        icons={preview.icons}
        standaloneLinks={preview.standaloneLinks}
        collections={preview.collections}
        sections={preview.sections}
      />

      <div className="mx-auto w-full max-w-[1600px] px-0 py-0 md:px-6 md:py-6 lg:px-8">
        <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">{children}</div>
          <DashboardPreviewAside {...preview} />
        </div>
      </div>
    </div>
  );
}
