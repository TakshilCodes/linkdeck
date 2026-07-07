import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";
import { SignupEmailStepZod } from "@/lib/validators/auth";
import { sendOtpEmail } from "@/lib/email/otp-email";
import { checkFixedWindowRateLimit, isCooldownActive, setCooldown } from "@/lib/security/rate-limit";
import { generateOtp, hashOtp, OTP_EXPIRE_SECONDS, OTP_RESEND_COOLDOWN_SECONDS } from "@/lib/security/otp";

const OTP_RATE_LIMIT_SECONDS = 10 * 60;
const OTP_RATE_LIMIT_MAX = 3;

type PendingSignup = {
  email: string;
  otpHash: string;
  username: string | null;
  createdAt: number;
};

async function canSendOtp(email: string) {
  const cooldownKey = `cooldown:otp:signup:${email}`;
  if (await isCooldownActive(cooldownKey)) {
    return false;
  }

  const { allowed } = await checkFixedWindowRateLimit({
    key: `ratelimit:otp:signup:${email}`,
    limit: OTP_RATE_LIMIT_MAX,
    windowSeconds: OTP_RATE_LIMIT_SECONDS,
  });

  if (allowed) {
    await setCooldown(cooldownKey, OTP_RESEND_COOLDOWN_SECONDS);
  }

  return allowed;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SignupEmailStepZod.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.flatten().fieldErrors.email?.[0] ?? "Invalid email",
        },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, error: "Email already exists" },
        { status: 409 }
      );
    }

    const allowed = await canSendOtp(email);
    if (!allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many OTP requests. Try again later." },
        { status: 429 }
      );
    }

    const otp = generateOtp();
    const otpHash = await hashOtp(otp);

    const pendingSignup: PendingSignup = {
      email,
      otpHash,
      username: null,
      createdAt: Date.now(),
    };

    await redis.set(
      `signup:pending:${email}`,
      JSON.stringify(pendingSignup),
      OTP_EXPIRE_SECONDS
    );

    const sent = await sendOtpEmail(email, otp);

    if (!sent) {
      await redis.del(`signup:pending:${email}`);

      return NextResponse.json(
        { ok: false, error: "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "OTP sent. Check your Inbox, Spam, or Promotions folder.",
      email,
    });
  } catch (error) {
    console.error("signup/email error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to start signup" },
      { status: 500 }
    );
  }
}