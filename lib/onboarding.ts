type OnboardingStepValue =
  | "USERNAME"
  | "THEME"
  | "PLATFORMS"
  | "LINKS"
  | "PROFILE"
  | "DONE"
  | null
  | undefined;

const ONBOARDING_STEP_TO_QUERY_STEP: Record<
  Exclude<OnboardingStepValue, null | undefined>,
  string
> = {
  USERNAME: "username",
  THEME: "theme",
  PLATFORMS: "platforms",
  LINKS: "links",
  PROFILE: "profile",
  DONE: "profile",
};

export function getOnboardingRedirectPath(
  onboardingStep: OnboardingStepValue
): string {
  const step = onboardingStep
    ? ONBOARDING_STEP_TO_QUERY_STEP[onboardingStep]
    : "username";

  return `/onboarding?step=${step}`;
}
