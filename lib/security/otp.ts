import bcrypt from "bcryptjs";
import { randomInt } from "crypto";

export const OTP_EXPIRE_SECONDS = 10 * 60;
export const OTP_RESEND_COOLDOWN_SECONDS = 30;

export function generateOtp() {
  return randomInt(100000, 1000000).toString();
}

export async function hashOtp(otp: string) {
  return bcrypt.hash(otp, 12);
}

export async function verifyOtp(otp: string, otpHash: string) {
  return bcrypt.compare(otp, otpHash);
}