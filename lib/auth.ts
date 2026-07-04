import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

async function getPrisma() {
  return (await import("@/lib/prisma")).default;
}

async function getRedis() {
  return (await import("@/lib/redis")).redis;
}

async function verifyPassword(password: string, hashedPassword: string) {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(password, hashedPassword);
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),

    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !password) return null;

        const prisma = await getPrisma();
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            username: true,
            hashedPassword: true,
            onboardingStep: true,
            onboardingDone: true,
          },
        });

        if (!user || !user.hashedPassword) return null;

        const isValid = await verifyPassword(password, user.hashedPassword);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          username: user.username ?? null,
          displayName: null,
          profileImgUrl: null,
          bio: null,
          onboardingStep: user.onboardingStep,
          onboardingDone: user.onboardingDone,
        };
      },
    }),

    CredentialsProvider({
      id: "bootstrap",
      name: "Bootstrap",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        const token = String(credentials?.token ?? "").trim();
        if (!token) return null;

        const redis = await getRedis();
        const raw = await redis.get(`auth:bootstrap:${token}`);
        if (!raw || typeof raw !== "string") return null;

        const parsed = JSON.parse(raw) as { userId: string };
        const prisma = await getPrisma();
        const user = await prisma.user.findUnique({
          where: { id: parsed.userId },
          select: {
            id: true,
            email: true,
            username: true,
            onboardingStep: true,
            onboardingDone: true,
          },
        });

        await redis.del(`auth:bootstrap:${token}`);

        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          username: user.username ?? null,
          displayName: null,
          profileImgUrl: null,
          bio: null,
          onboardingStep: user.onboardingStep,
          onboardingDone: user.onboardingDone,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      const email = user.email.toLowerCase();

      if (account?.provider === "google" || account?.provider === "github") {
        const prisma = await getPrisma();
        const existingUser = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            displayName: true,
            profileImgUrl: true,
          },
        });

        const providerName = account.provider === "google" ? "GOOGLE" : "GITHUB";

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email,
              displayName: user.name?.trim() || "",
              profileImgUrl: user.image || null,
              authProvider: providerName,
              username: null,
              onboardingDone: false,
            },
          });
        } else {
          await prisma.user.update({
            where: { email },
            data: {
              displayName: existingUser.displayName || user.name?.trim() || "",
              profileImgUrl: existingUser.profileImgUrl || user.image || null,
              authProvider: providerName,
            },
          });
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      const sourceEmail =
        typeof user?.email === "string"
          ? user.email.toLowerCase()
          : typeof token.email === "string"
            ? token.email.toLowerCase()
            : "";

      if (sourceEmail) {
        const prisma = await getPrisma();
        const dbUser = await prisma.user.findUnique({
          where: { email: sourceEmail },
          select: {
            id: true,
            email: true,
            username: true,
            onboardingStep: true,
            onboardingDone: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.username = dbUser.username ?? null;
          token.onboardingStep = dbUser.onboardingStep;
          token.onboardingDone = dbUser.onboardingDone;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.email = String(token.email ?? session.user.email ?? "");
        session.user.username = token.username ?? null;
        session.user.onboardingStep = token.onboardingStep ?? null;
        session.user.onboardingDone =
          typeof token.onboardingDone === "boolean" ? token.onboardingDone : false;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/post-auth`;
    },
  },
};