import { z } from "zod";

export const EmailZod = z.string().trim().toLowerCase().email().max(50);

export const UsernameZod = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters")
  .max(35, "Username must be at most 35 characters")
  .regex(/^[a-zA-Z0-9._]+$/, "Only letters, numbers, . and _ allowed")
  .refine((val) => !/[._]{2,}/.test(val), {
    message: "Username cannot have consecutive . or _",
  })
  .refine((val) => !/^[._]/.test(val) && !/[._]$/.test(val), {
    message: "Username cannot start or end with . or _",
  });

export const PasswordZod = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(50, "Password cannot exceed 50 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[0-9]/, "Must contain a number");

export const OtpZod = z.string().trim().regex(/^\d{6}$/, "OTP must be 6 digits");

export const SignupEmailStepZod = z.object({
  email: EmailZod,
});

export const SignupUsernameStepZod = z.object({
  email: EmailZod,
  username: UsernameZod,
});

export const SignupVerifyOtpStepZod = z.object({
  email: EmailZod,
  otp: OtpZod,
});

export const CredentialsSignInZod = z.object({
  email: EmailZod,
  password: PasswordZod,
});