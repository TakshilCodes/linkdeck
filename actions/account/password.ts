"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redis } from "@/lib/redis";
import emailjs from "@emailjs/nodejs";
import { randomInt } from "crypto";

const OTP_EXPIRE_SECONDS = 10 * 60; // 10 minutes
const OTP_RATE_LIMIT_SECONDS = 10 * 60; // 10 minutes
const OTP_RATE_LIMIT_MAX = 3;

async function canSendOtp(email: string) {
  const key = `ratelimit:otp:pwd:${email}`;

  const raw = await redis.get(key);
  if (!raw) {
    await redis.set(key, "1", OTP_RATE_LIMIT_SECONDS);
    return true;
  }

  const count = Number(raw) + 1;
  await redis.set(key, String(count), OTP_RATE_LIMIT_SECONDS);

  return count <= OTP_RATE_LIMIT_MAX;
}

export async function changePasswordAction(currentPassword: string, newPassword: string) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, hashedPassword: true }
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (!user.hashedPassword) {
      return { success: false, error: "Password login is not enabled for this account." };
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword);
    
    if (!isCurrentPasswordValid) {
      return { success: false, error: "Current password is incorrect" };
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: hashedNewPassword }
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

    const allowed = await canSendOtp(email);
    if (!allowed) {
      return { success: false, error: "Too many OTP requests. Try again later." };
    }

    const otp = randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 12);

    await redis.set(
      `pwd:reset:${email}`,
      otpHash,
      OTP_EXPIRE_SECONDS
    );

    const serviceId = process.env.Emailjs_ServiceId;
    const templateId = process.env.Emailjs_TemplateId;
    const publicKey = process.env.Emailjs_PublicId;
    const privateKey = process.env.Emailjs_PrivateId;

    if (!serviceId || !templateId || !publicKey || !privateKey) {
      console.error("Email config missing");
      return { success: false, error: "Email configuration is missing." };
    }

    const emailRes = await emailjs.send(
      serviceId,
      templateId,
      { email, otp },
      { publicKey, privateKey }
    );

    if (emailRes.status !== 200) {
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
      select: { id: true }
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const otpHashRaw = await redis.get(`pwd:reset:${email}`);
    if (!otpHashRaw || typeof otpHashRaw !== "string") {
      return { success: false, error: "OTP expired or invalid" };
    }

    const isOtpValid = await bcrypt.compare(otpCode, otpHashRaw);
    if (!isOtpValid) {
      return { success: false, error: "Incorrect OTP" };
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: hashedNewPassword }
    });

    // Clean up Redis
    await redis.del(`pwd:reset:${email}`);

    revalidatePath("/account");
    
    return { success: true };
  } catch (error) {
    console.error("resetPasswordWithOtpAction error", error);
    return { success: false, error: "Failed to reset password" };
  }
}
