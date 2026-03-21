import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";
import { SignupUsernameStepZod } from "@/lib/validators/auth";

type PendingSignup = {
  email: string;
  otpHash: string;
  username: string | null;
  createdAt: number;
};

const PENDING_TTL_SECONDS = 10 * 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SignupUsernameStepZod.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          ok: false,
          error: errors.username?.[0] || errors.email?.[0] || "Invalid input",
        },
        { status: 400 }
      );
    }

    const { email, username } = parsed.data;

    const taken = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (taken) {
      return NextResponse.json(
        { ok: false, error: "Username already taken" },
        { status: 409 }
      );
    }

    const raw = await redis.get(`signup:pending:${email}`);
    if (!raw || typeof raw !== "string") {
      return NextResponse.json(
        { ok: false, error: "Signup session expired. Start again." },
        { status: 400 }
      );
    }

    const pending = JSON.parse(raw) as PendingSignup;
    pending.username = username;

    await redis.set(
      `signup:pending:${email}`,
      JSON.stringify(pending),
      PENDING_TTL_SECONDS
    );

    return NextResponse.json({
      ok: true,
      message: "Username saved",
    });
  } catch (error) {
    console.error("signup/username error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to save username" },
      { status: 500 }
    );
  }
}