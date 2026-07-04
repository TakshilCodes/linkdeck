"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redis } from "@/lib/redis";
import { sendOtpEmail } from "@/lib/email/otp-email";
import { checkFixedWindowRateLimit, isCooldownActive, setCooldown } from "@/lib/security/rate-limit";
import { generateOtp, hashOtp, OTP_EXPIRE_SECONDS, OTP_RESEND_COOLDOWN_SECONDS, verifyOtp } from "@/lib/security/otp";

const OTP_RATE_LIMIT_SECONDS = 10 * 60;
const OTP_RATE_LIMIT_MAX = 3;

async function canSendPasswordOtp(email: string) {
  const cooldownKey = `cooldown:otp:pwd:${email}`;
  if (await isCooldownActive(cooldownKey)) {
    return false;
  }

  const { allowed } = await checkFixedWindowRateLimit({
    key: `ratelimit:otp:pwd:${email}`,
    limit: OTP_RATE_LIMIT_MAX,
    windowSeconds: OTP_RATE_LIMIT_SECONDS,
  });

  if (allowed) {
    await setCooldown(cooldownKey, OTP_RESEND_COOLDOWN_SECONDS);
  }

  return allowed;
}

export async function changePasswordAction(currentPassword: string, newPassword: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, hashedPassword: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (!user.hashedPassword) {
      return { success: false, error: "Password login is not enabled for this account." };
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword);

    if (!isCurrentPasswordValid) {
      return { success: false, error: "Current password is incorrect" };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: hashedNewPassword },
    });

    revalidatePath("/account");

    return { success: true };
  } catch (error) {
    console.error("changePasswordAction error", error);
    return { success: false, error: "Failed to change password" };
  }
}

export async function sendPasswordOtpAction() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const email = session.user.email;

    const allowed = await canSendPasswordOtp(email);
    if (!allowed) {
      return { success: false, error: "Too many OTP requests. Try again later." };
    }

    const otp = generateOtp();
    const otpHash = await hashOtp(otp);

    await redis.set(
      `pwd:reset:${email}`,
      otpHash,
      OTP_EXPIRE_SECONDS
    );

    const sent = await sendOtpEmail(email, otp);
    if (!sent) {
      return { success: false, error: "Failed to send OTP email" };
    }

    return { success: true, message: "OTP sent to your email." };
  } catch (error) {
    console.error("sendPasswordOtpAction error", error);
    return { success: false, error: "Failed to send OTP" };
  }
}

export async function resetPasswordWithOtpAction(otpCode: string, newPassword: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const email = session.user.email;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const otpHashRaw = await redis.get(`pwd:reset:${email}`);
    if (!otpHashRaw || typeof otpHashRaw !== "string") {
      return { success: false, error: "OTP expired or invalid" };
    }

    const isOtpValid = await verifyOtp(otpCode, otpHashRaw);
    if (!isOtpValid) {
      return { success: false, error: "Incorrect OTP" };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: hashedNewPassword },
    });

    await redis.del(`pwd:reset:${email}`);

    revalidatePath("/account");

    return { success: true };
  } catch (error) {
    console.error("resetPasswordWithOtpAction error", error);
    return { success: false, error: "Failed to reset password" };
  }
}