import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import EnterUsernameStep from "./EnterUsernameStep";
import SelectThemeStep from "./SelectThemeStep";
import SelectPlatformsStep from "./selectPlatformsStep";
import AddLinksStep from "./AddLinksStep";
import ProfileStep from "./ProfileStep";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { PlatformType } from "@/lib/social-icons";

export default async function OnBoarding(props: PageProps<"/onboarding">) {
  const searchParams = await props.searchParams;
  const step = searchParams.step;
  const mode = searchParams.mode;

  const isPreAuthEmailUsernameStep = step === "username" && mode === "email";

  let user: {
    id: string;
    onboardingDone: boolean;
    onboardingStep: string;
    displayName: string | null;
    bio: string | null;
    profileImgUrl: string | null;
    icons: {
      type: PlatformType;
      url: string;
      position: number;
    }[];
  } | null = null;

  let themes: {
    id: string;
    name: string;
    slug: string;
    previewImgUrl: string | null;
    isDefault: boolean;
  }[] = [];

  if (!isPreAuthEmailUsernameStep) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      redirect("/signin");
    }

    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        onboardingDone: true,
        onboardingStep: true,
        displayName: true,
        bio: true,
        profileImgUrl: true,
        icons: {
          orderBy: { position: "asc" },
          select: {
            type: true,
            url: true,
            position: true,
          },
        },
      },
    });

    if (!user) {
      redirect("/signin");
    }

    if (user.onboardingDone) {
      redirect("/dashboard");
    }

    if (step === "theme") {
      themes = await prisma.defaultTheme.findMany({
        orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          previewImgUrl: true,
          isDefault: true,
        },
      });
    }
  }

  const preselectedPlatforms = user?.icons.map((icon) => icon.type) ?? [];

  const existingLinks =
    user?.icons.map((icon) => ({
      platform: icon.type,
      value: icon.url,
    })) ?? [];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        {step === "username" ? <EnterUsernameStep /> : null}

        {step === "theme" ? <SelectThemeStep themes={themes} /> : null}

        {step === "platforms" && user ? (
          <SelectPlatformsStep preselectedPlatforms={preselectedPlatforms} />
        ) : null}

        {step === "links" && user ? (
          <AddLinksStep
            selectedPlatforms={preselectedPlatforms}
            existingLinks={existingLinks}
          />
        ) : null}

        {step === "profile" && user ? (
          <ProfileStep
            initialDisplayName={user.displayName ?? ""}
            initialBio={user.bio ?? ""}
            initialProfileImgUrl={user.profileImgUrl ?? ""}
          />
        ) : null}
      </div>
    </main>
  );
}