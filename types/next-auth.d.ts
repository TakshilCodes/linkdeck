import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import type { OnboardingStep } from "@/app/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username: string | null;
      onboardingStep: OnboardingStep | null;
      onboardingDone: boolean;
    };
  }

  interface User {
    id: string;
    username: string | null;
    onboardingStep: OnboardingStep | null;
    onboardingDone: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string | null;
    onboardingStep?: OnboardingStep | null;
    onboardingDone?: boolean;
  }
}