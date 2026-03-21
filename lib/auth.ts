import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
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

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            username: true,
            hashedPassword: true,
          },
        });

        if (!user || !user.hashedPassword) return null;

        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          username: user.username ?? null,
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

        const raw = await redis.get(`auth:bootstrap:${token}`);
        if (!raw || typeof raw !== "string") return null;

        const parsed = JSON.parse(raw) as { userId: string };

        const user = await prisma.user.findUnique({
          where: { id: parsed.userId },
          select: {
            id: true,
            email: true,
            username: true,
          },
        });

        await redis.del(`auth:bootstrap:${token}`);

        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          username: user.username ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account?.provider) return false;

      const email = user.email.toLowerCase();

      if (account.provider === "google" || account.provider === "github") {
        const existing = await prisma.user.findUnique({
          where: { email },
          select: { id: true },
        });

        if (!existing) {
          await prisma.user.create({
            data: {
              email,
              authProvider:
                account.provider === "google" ? "GOOGLE" : "GITHUB",
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
        const dbUser = await prisma.user.findUnique({
          where: { email: sourceEmail },
          select: {
            id: true,
            email: true,
            username: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.username = dbUser.username ?? null;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = String(token.id ?? "");
        session.user.email = String(token.email ?? session.user.email ?? "");
        (session.user as any).username =
          token.username == null ? null : String(token.username);
      }

      return session;
    },
  },
};