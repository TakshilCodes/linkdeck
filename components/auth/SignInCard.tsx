"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInCard() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"" | "credentials" | "google" | "github">("");

  async function handleCredentialsSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setError("");
      setLoading("credentials");

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res?.ok) {
        setError("Invalid email or password");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading("");
    }
  }

  async function handleOAuth(provider: "google" | "github") {
    setError("");
    setLoading(provider);
    await signIn(provider, { callbackUrl: "/post-auth" });
  }

  return (
    <section className="relative mx-auto w-full max-w-[440px]">
      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,37,56,0.96),rgba(8,17,31,0.98))] p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="mb-6">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.35em] text-cyan-200/70">
            Welcome back
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Sign in to LinkDeck
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Access your links, analytics, and profile settings.
          </p>
          {error ? <p className="mt-3 text-sm font-medium text-red-500">{error}</p> : null}
        </div>

        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="h-14 w-full rounded-2xl border border-white/10 bg-white px-4 text-[15px] text-slate-900 outline-none"
          />

          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-14 w-full rounded-2xl border border-white/10 bg-white px-4 text-[15px] text-slate-900 outline-none"
          />

          <button
            type="submit"
            disabled={loading !== ""}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading === "credentials" ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign in with Email"
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[11px] uppercase tracking-[0.28em] text-white/40">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            disabled={loading !== ""}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/8 disabled:opacity-50"
          >
            {loading === "google" ? "Continuing..." : "Continue with Google"}
          </button>

          <button
            type="button"
            onClick={() => handleOAuth("github")}
            disabled={loading !== ""}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/8 disabled:opacity-50"
          >
            {loading === "github" ? "Continuing..." : "Continue with GitHub"}
          </button>
        </div>
      </div>
    </section>
  );
}