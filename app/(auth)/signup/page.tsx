"use client";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { EmailZod } from "@/lib/validators/auth";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"" | "email" | "google" | "github">(
    ""
  );

  const router = useRouter();

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setError("");
      setLoading("email");

      const parsed = EmailZod.safeParse(email);

      if (!parsed.success) {
        setError(parsed.error.flatten().formErrors[0] ?? "Invalid email");
        return;
      }

      await axios.post("/api/auth/signup", { email: parsed.data });

      sessionStorage.setItem("signup_email", parsed.data);
      router.push("/onboarding?step=username&mode=email");
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.error ?? "Something went wrong");
        return;
      }

      setError("Something went wrong");
    } finally {
      setLoading("");
    }
  }

  async function handleOAuth(provider: "google" | "github") {
    try {
      setError("");
      setLoading(provider);

      await signIn(provider, {
        callbackUrl: "/post-auth",
      });
    } catch {
      setError("Something went wrong");
      setLoading("");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex flex-col items-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-400">
              Build your identity. Share everything.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/6 p-7 shadow-2xl backdrop-blur-xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Create your LinkDeck
              </h1>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Launch your personal page, organize your links, and make your
                online presence look premium.
              </p>

              {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
            </div>

            <form className="space-y-4" onSubmit={handleSignUp}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/80"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/70 px-4 text-sm text-white outline-none placeholder:text-zinc-500 transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading !== ""}
                className="h-12 w-full rounded-xl bg-cyan-300 font-semibold text-slate-900 shadow-[0_8px_30px_rgba(103,232,249,0.28)] transition hover:scale-[1.01] hover:bg-cyan-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading === "email" ? "Processing..." : "Continue with Email"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
                or
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={loading !== ""}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/3 text-sm font-medium text-white transition hover:border-cyan-300/30 hover:bg-white/6 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FcGoogle className="text-xl" />
                {loading === "google" ? "Continuing..." : "Continue with Google"}
              </button>

              <button
                type="button"
                onClick={() => handleOAuth("github")}
                disabled={loading !== ""}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/3 text-sm font-medium text-white transition hover:border-cyan-300/30 hover:bg-white/6 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaGithub className="text-lg text-white" />
                {loading === "github" ? "Continuing..." : "Continue with GitHub"}
              </button>
            </div>

            <p className="mt-7 text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold text-cyan-300 transition hover:text-cyan-200"
              >
                Log in
              </Link>
            </p>
          </div>

          <p className="mt-8 text-center text-[11px] uppercase tracking-[0.35em] text-zinc-600">
            Designed for modern devs
          </p>
        </div>
      </section>
    </main>
  );
}