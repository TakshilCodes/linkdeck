import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CompleteUsernameZod = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = CompleteUsernameZod.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error:
            parsed.error.flatten().fieldErrors.username?.[0] ?? "Invalid username",
        },
        { status: 400 }
      );
    }

    const email = session.user.email.toLowerCase();
    const username = parsed.data.username.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, username: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (existingUser.username) {
      return NextResponse.json(
        { ok: false, error: "Username already set" },
        { status: 409 }
      );
    }

    const usernameTaken = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (usernameTaken) {
      return NextResponse.json(
        { ok: false, error: "Username already taken" },
        { status: 409 }
      );
    }

    await prisma.user.update({
      where: { email },
      data: { username },
    });

    return NextResponse.json({
      ok: true,
      message: "Username completed successfully",
    });
  } catch (error) {
    console.error("oauth/complete-username error", error);

    return NextResponse.json(
      { ok: false, error: "Failed to complete username" },
      { status: 500 }
    );
  }
}