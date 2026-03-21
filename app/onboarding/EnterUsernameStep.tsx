"use client";

import { useEffect, useState } from "react";
import { Loader2, AtSign } from "lucide-react";
import { UsernameZod } from "@/lib/validators/auth";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function EnterUsernameStep() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode"); // "email" | "oauth"

  useEffect(() => {
    if (mode === "email") {
      const savedEmail = sessionStorage.getItem("signup_email");

      if (!savedEmail) {
        router.push("/signup");
        return;
      }

      setEmail(savedEmail);
    }
  }, [mode, router]);

  const previewUrl = username
    ? `/linkdeck.in/${username}`
    : "/linkdeck.in/yourname";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const validate = UsernameZod.safeParse(username);

      if (!validate.success) {
        const usernameError =
          validate.error.flatten().formErrors[0] ?? "Invalid username";

        setError(usernameError);
        return;
      }

      if (mode === "email") {
        if (!email) {
          setError("Email missing. Start again.");
          return;
        }

        await axios.post("/api/auth/signup/username", {
          email,
          username: validate.data,
        });

        router.push("/verify-otp");
        return;
      }

      if (mode === "oauth") {
        await axios.post("/api/auth/oauth/complete-username", {
          username: validate.data,
        });

        router.push("/dashboard");
        router.refresh();
        return;
      }

      setError("Invalid signup mode");
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
    <section className="relative mx-auto w-full max-w-115">
      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,37,56,0.96),rgba(8,17,31,0.98))] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7">
        <div className="mb-6">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.35em] text-cyan-200/70">
            Claim your username
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Choose your LinkDeck ID
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/60">
            Pick a clean username for your public page. You can use lowercase
            letters, numbers, dots, and underscores.
          </p>

          {error ? <p className="mt-2 text-red-600">{error}</p> : null}
        </div>

        {mode === "email" ? (
          <div className="mb-5 rounded-2xl border border-white/10 bg-white/3 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
              Signing up as
            </p>
            <p className="mt-1 truncate text-sm text-white/80">{email}</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100/80"
            >
              Username
            </label>

            <div className="group flex h-14 items-center rounded-2xl border border-white/10 bg-black/40 px-4 transition focus-within:border-cyan-300/50 focus-within:bg-black/50 focus-within:shadow-[0_0_0_4px_rgba(34,211,238,0.08)]">
              <AtSign className="mr-3 h-4 w-4 shrink-0 text-cyan-300/70" />

              <input
                id="username"
                autoComplete="off"
                spellCheck={false}
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="takshilcodes"
                className="w-full bg-transparent text-[15px] text-white placeholder:text-white/25 outline-none"
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 px-4 py-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/70">
                  Public URL
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  {previewUrl}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Continuing...
              </span>
            ) : (
              "Continue with Username"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}