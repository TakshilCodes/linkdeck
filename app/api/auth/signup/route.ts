import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";
import { SignupEmailStepZod } from "@/lib/validators/auth";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import emailjs from "@emailjs/nodejs";

const OTP_EXPIRE_SECONDS = 10 * 60;
const OTP_RATE_LIMIT_SECONDS = 10 * 60;
const OTP_RATE_LIMIT_MAX = 3;

type PendingSignup = {
  email: string;
  otpHash: string;
  username: string | null;
  createdAt: number;
};

async function canSendOtp(email: string) {
  const key = `ratelimit:otp:${email}`;

  const raw = await redis.get(key);
  if (!raw) {
    await redis.set(key, "1", OTP_RATE_LIMIT_SECONDS);
    return true;
  }

  const count = Number(raw) + 1;
  await redis.set(key, String(count), OTP_RATE_LIMIT_SECONDS);

  return count <= OTP_RATE_LIMIT_MAX;
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

    const otp = randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 12);

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

    const serviceId = process.env.Emailjs_ServiceId;
    const templateId = process.env.Emailjs_TemplateId;
    const publicKey = process.env.Emailjs_PublicId;
    const privateKey = process.env.Emailjs_PrivateId;

    if (!serviceId || !templateId || !publicKey || !privateKey) {
      return NextResponse.json(
        { ok: false, error: "Email config missing" },
        { status: 500 }
      );
    }

    const emailRes = await emailjs.send(
      serviceId,
      templateId,
      { email, otp },
      { publicKey, privateKey }
    );

    if (emailRes.status !== 200) {
      return NextResponse.json(
        { ok: false, error: "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "OTP sent",
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