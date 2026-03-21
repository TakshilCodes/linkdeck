import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";
import { SignupVerifyOtpStepZod } from "@/lib/validators/auth";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

type PendingSignup = {
  email: string;
  otpHash: string;
  username: string | null;
  createdAt: number;
};

const BOOTSTRAP_TTL_SECONDS = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SignupVerifyOtpStepZod.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          ok: false,
          error: errors.otp?.[0] || errors.email?.[0] || "Invalid input",
        },
        { status: 400 }
      );
    }

    const { email, otp } = parsed.data;

    const raw = await redis.get(`signup:pending:${email}`);
    if (!raw || typeof raw !== "string") {
      return NextResponse.json(
        { ok: false, error: "OTP expired or signup session missing" },
        { status: 400 }
      );
    }

    const pending = JSON.parse(raw) as PendingSignup;

    if (!pending.username) {
      return NextResponse.json(
        { ok: false, error: "Username not found. Complete username step first." },
        { status: 400 }
      );
    }

    const isValidOtp = await bcrypt.compare(otp, pending.otpHash);
    if (!isValidOtp) {
      return NextResponse.json(
        { ok: false, error: "Invalid OTP" },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email: pending.email },
      select: { id: true },
    });

    if (existingEmail) {
      return NextResponse.json(
        { ok: false, error: "Email already exists" },
        { status: 409 }
      );
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: pending.username },
      select: { id: true },
    });

    if (existingUsername) {
      return NextResponse.json(
        { ok: false, error: "Username already taken" },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email: pending.email,
        username: pending.username,
        authProvider: "CREDENTIALS",
        hashedPassword: null,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    await redis.del(`signup:pending:${email}`);

    const bootstrapToken = randomUUID();
    await redis.set(
      `auth:bootstrap:${bootstrapToken}`,
      JSON.stringify({ userId: user.id }),
      BOOTSTRAP_TTL_SECONDS
    );

    return NextResponse.json({
      ok: true,
      message: "Account created",
      bootstrapToken,
    });
  } catch (error) {
    console.error("signup/verify-otp error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}