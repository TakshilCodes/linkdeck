import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { sendOtpEmail } from "@/lib/email/otp-email";
import { SignupEmailStepZod } from "@/lib/validators/auth";
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

async function canResendOtp(email: string) {
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
        { ok: false, error: parsed.error.flatten().fieldErrors.email?.[0] ?? "Invalid email" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const pendingRaw = await redis.get(`signup:pending:${email}`);

    if (!pendingRaw || typeof pendingRaw !== "string") {
      return NextResponse.json(
        { ok: false, error: "Signup session expired. Start again." },
        { status: 400 }
      );
    }

    const allowed = await canResendOtp(email);
    if (!allowed) {
      return NextResponse.json(
        { ok: false, error: "Please wait before requesting another OTP." },
        { status: 429 }
      );
    }

    const pending = JSON.parse(pendingRaw) as PendingSignup;
    const otp = generateOtp();

    const nextPending: PendingSignup = {
      ...pending,
      email,
      otpHash: await hashOtp(otp),
      createdAt: Date.now(),
    };

    await redis.set(
      `signup:pending:${email}`,
      JSON.stringify(nextPending),
      OTP_EXPIRE_SECONDS
    );

    const sent = await sendOtpEmail(email, otp);
    if (!sent) {
      await redis.set(
        `signup:pending:${email}`,
        pendingRaw,
        OTP_EXPIRE_SECONDS
      );

      return NextResponse.json(
        { ok: false, error: "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "OTP resent successfully. Check your Inbox, Spam, or Promotions folder.",
    });
  } catch (error) {
    console.error("auth/resend-otp error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to resend OTP" },
      { status: 500 }
    );
  }
}