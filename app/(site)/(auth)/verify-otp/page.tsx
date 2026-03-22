"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function VerifyOtpCard() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("signup_email");

    if (!savedEmail) {
      router.push("/signup");
      return;
    }

    setEmail(savedEmail);
  }, [router]);

  async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const savedEmail = sessionStorage.getItem("signup_email");

      if (!savedEmail) {
        setError("Email missing. Start again.");
        return;
      }

      if (!/^\d{6}$/.test(otp)) {
        setError("OTP must be 6 digits");
        return;
      }

      const verifyRes = await axios.post("/api/auth/signup/verify-otp", {
        email: savedEmail,
        otp,
      });

      const bootstrapToken = verifyRes.data?.bootstrapToken;

      if (!bootstrapToken) {
        setError("Login token missing");
        return;
      }

      const res = await signIn("bootstrap", {
        token: bootstrapToken,
        redirect: false,
      });

      if (!res?.ok) {
        setError("Could not start session");
        return;
      }

      sessionStorage.removeItem("signup_email");
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.error ?? "Something went wrong");
        return;
      }

      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full items-center justify-center px-4">
      <div className="w-full max-w-110 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,33,49,0.96)_0%,rgba(12,24,38,0.98)_100%)] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <p className="mb-8 text-center text-[12px] font-medium uppercase tracking-[0.35em] text-white/55">
          Verify your email
        </p>

        <h1 className="text-[24px] font-semibold tracking-tight text-white">
          Enter your OTP
        </h1>

        <p className="mt-2 text-[15px] leading-6 text-white/60">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-white/85">
            {email || "your email"}
          </span>
        </p>

        {error ? (
          <p className="mt-4 text-sm font-medium text-red-500">{error}</p>
        ) : null}

        <form onSubmit={handleVerifyOtp} className="mt-7 space-y-5">
          <div>
            <label className="mb-3 block text-[13px] font-semibold uppercase tracking-[0.28em] text-white/70">
              OTP code
            </label>

            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setOtp(value);
              }}
              placeholder="Enter 6-digit OTP"
              className="h-14 w-full rounded-2xl border border-white/10 bg-white px-4 text-base font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/15"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-cyan-400 text-[17px] font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="mt-5 w-full text-center text-sm font-medium text-white/60 transition hover:text-cyan-400"
        >
          Change email
        </button>
      </div>
    </div>
  );
}