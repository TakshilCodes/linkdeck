"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
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
const PASSWORD_LOGIN_DISABLED_ERROR = "Password login is not enabled for this account.";
const PASSWORD_LOGIN_ALREADY_ENABLED_ERROR = "Password login is already enabled for this account.";

const PasswordInput = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(72, "Password must be 72 characters or fewer.");

const OtpInput = z.string().trim().regex(/^\d{6}$/, "OTP must be 6 digits.");

type PasswordOtpPurpose = "create" | "reset";

type AccountActionResult =
  | { success: true; message?: string; emailHint?: string }
  | { success: false; error: string };

function parsePassword(value: string): AccountActionResult {
  const parsed = PasswordInput.safeParse(value);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid password." };
  }

  return { success: true };
}

function parseOtp(value: string): AccountActionResult {
  const parsed = OtpInput.safeParse(value);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid OTP." };
  }

  return { success: true };
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "your email";

  return `${name[0] ?? "*"}${name.length > 1 ? "***" : ""}@${domain}`;
}

function passwordOtpKey(purpose: PasswordOtpPurpose, userId: string) {
  return `pwd:${purpose}:${userId}`;
}

async function canSendPasswordOtp(userId: string, email: string, purpose: PasswordOtpPurpose) {
  const cooldownKey = `cooldown:otp:pwd:${purpose}:${userId}`;
  if (await isCooldownActive(cooldownKey)) {
    return false;
  }

  const { allowed } = await checkFixedWindowRateLimit({
    key: `ratelimit:otp:pwd:${purpose}:${userId}:${email}`,
    limit: OTP_RATE_LIMIT_MAX,
    windowSeconds: OTP_RATE_LIMIT_SECONDS,
  });

  if (allowed) {
    await setCooldown(cooldownKey, OTP_RESEND_COOLDOWN_SECONDS);
  }

  return allowed;
}

async function getSessionAccount() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      hashedPassword: true,
      authProvider: true,
    },
  });
}

function canCreatePasswordForProvider(authProvider: string) {
  return authProvider === "GOOGLE" || authProvider === "GITHUB";
}

async function sendPasswordOtp(userId: string, email: string, purpose: PasswordOtpPurpose): Promise<AccountActionResult> {
  const allowed = await canSendPasswordOtp(userId, email, purpose);
  if (!allowed) {
    return { success: false, error: "Too many OTP requests. Try again later." };
  }

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const redisKey = passwordOtpKey(purpose, userId);

  await redis.set(redisKey, otpHash, OTP_EXPIRE_SECONDS);

  const sent = await sendOtpEmail(email, otp);
  if (!sent) {
    await redis.del(redisKey);
    return { success: false, error: "Failed to send OTP email." };
  }

  return {
    success: true,
    message: "OTP sent to your email. Check your Inbox, Spam, or Promotions folder.",
    emailHint: maskEmail(email),
  };
}

export async function changePasswordAction(currentPassword: string, newPassword: string): Promise<AccountActionResult> {
  try {
    const parsedNewPassword = parsePassword(newPassword);
    if (!parsedNewPassword.success) return parsedNewPassword;

    if (!currentPassword) {
      return { success: false, error: "Current password is required." };
    }

    if (currentPassword === newPassword) {
      return { success: false, error: "New password must be different from your current password." };
    }

    const user = await getSessionAccount();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    if (!user.hashedPassword) {
      return { success: false, error: PASSWORD_LOGIN_DISABLED_ERROR };
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword);

    if (!isCurrentPasswordValid) {
      return { success: false, error: "Current password is incorrect." };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: hashedNewPassword },
    });

    revalidatePath("/account");

    return { success: true, message: "Password updated successfully." };
  } catch (error) {
    console.error("changePasswordAction error", error);
    return { success: false, error: "Failed to change password." };
  }
}

export async function sendCreatePasswordOtpAction(): Promise<AccountActionResult> {
  try {
    const user = await getSessionAccount();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    if (user.hashedPassword) {
      return { success: false, error: PASSWORD_LOGIN_ALREADY_ENABLED_ERROR };
    }

    if (!canCreatePasswordForProvider(user.authProvider)) {
      return { success: false, error: "This account cannot create a password from the current sign-in method." };
    }

    return sendPasswordOtp(user.id, user.email, "create");
  } catch (error) {
    console.error("sendCreatePasswordOtpAction error", error);
    return { success: false, error: "Failed to send OTP." };
  }
}

export async function createPasswordWithOtpAction(otpCode: string, newPassword: string): Promise<AccountActionResult> {
  try {
    const parsedOtp = parseOtp(otpCode);
    if (!parsedOtp.success) return parsedOtp;

    const parsedNewPassword = parsePassword(newPassword);
    if (!parsedNewPassword.success) return parsedNewPassword;

    const user = await getSessionAccount();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    if (user.hashedPassword) {
      return { success: false, error: PASSWORD_LOGIN_ALREADY_ENABLED_ERROR };
    }

    if (!canCreatePasswordForProvider(user.authProvider)) {
      return { success: false, error: "This account cannot create a password from the current sign-in method." };
    }

    const redisKey = passwordOtpKey("create", user.id);
    const otpHashRaw = await redis.get(redisKey);
    if (!otpHashRaw || typeof otpHashRaw !== "string") {
      return { success: false, error: "OTP expired or invalid." };
    }

    const isOtpValid = await verifyOtp(otpCode.trim(), otpHashRaw);
    if (!isOtpValid) {
      return { success: false, error: "Incorrect OTP." };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: hashedNewPassword },
    });

    await redis.del(redisKey);

    revalidatePath("/account");

    return { success: true, message: "Password login has been enabled." };
  } catch (error) {
    console.error("createPasswordWithOtpAction error", error);
    return { success: false, error: "Failed to create password." };
  }
}

export async function sendPasswordOtpAction(): Promise<AccountActionResult> {
  try {
    const user = await getSessionAccount();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    if (!user.hashedPassword) {
      return { success: false, error: PASSWORD_LOGIN_DISABLED_ERROR };
    }

    return sendPasswordOtp(user.id, user.email, "reset");
  } catch (error) {
    console.error("sendPasswordOtpAction error", error);
    return { success: false, error: "Failed to send OTP." };
  }
}

export async function resetPasswordWithOtpAction(otpCode: string, newPassword: string): Promise<AccountActionResult> {
  try {
    const parsedOtp = parseOtp(otpCode);
    if (!parsedOtp.success) return parsedOtp;

    const parsedNewPassword = parsePassword(newPassword);
    if (!parsedNewPassword.success) return parsedNewPassword;

    const user = await getSessionAccount();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    if (!user.hashedPassword) {
      return { success: false, error: PASSWORD_LOGIN_DISABLED_ERROR };
    }

    const redisKey = passwordOtpKey("reset", user.id);
    const otpHashRaw = await redis.get(redisKey);
    if (!otpHashRaw || typeof otpHashRaw !== "string") {
      return { success: false, error: "OTP expired or invalid." };
    }

    const isOtpValid = await verifyOtp(otpCode.trim(), otpHashRaw);
    if (!isOtpValid) {
      return { success: false, error: "Incorrect OTP." };
    }

    const isSameAsCurrentPassword = await bcrypt.compare(newPassword, user.hashedPassword);
    if (isSameAsCurrentPassword) {
      return { success: false, error: "New password must be different from your current password." };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: hashedNewPassword },
    });

    await redis.del(redisKey);

    revalidatePath("/account");

    return { success: true, message: "Password updated successfully." };
  } catch (error) {
    console.error("resetPasswordWithOtpAction error", error);
    return { success: false, error: "Failed to reset password." };
  }
}
