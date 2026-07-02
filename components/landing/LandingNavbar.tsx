"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import Logo from "@/public/logo/FullLogo.png";
import ShinyText from "./animations/ShinyText";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "/help", label: "Help" },
];

const PENDING_SCROLL_KEY = "linkdeck:pending-scroll-target";
const FEATURE_TARGET_ID = "features";

function scrollToFeatures() {
  const target = document.getElementById(FEATURE_TARGET_ID);
  if (!target) return false;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });

  return true;
}

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = Boolean(session?.user);

  const closeMenu = () => setMobileMenuOpen(false);

  const handleFeaturesClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    closeMenu();

    if (pathname === "/") {
      if (scrollToFeatures()) {
        window.history.replaceState(null, "", "#features");
      }
      return;
    }

    try {
      window.sessionStorage.setItem(PENDING_SCROLL_KEY, FEATURE_TARGET_ID);
    } catch {
      // Ignore storage access failures and still navigate home.
    }

    router.push("/");
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-5 sm:px-6 lg:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/35 px-3 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:px-4 lg:px-5">
          <div className="flex items-center gap-8">
            <Link href="/" className="shrink-0" aria-label="LinkDeck home">
              <Image
                src={Logo}
                alt="LinkDeck"
                className="h-auto w-32 sm:w-36 md:w-40"
                priority
              />
            </Link>

            <div className="hidden items-center gap-7 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={link.href === "#features" ? handleFeaturesClick : undefined}
                  className="text-sm font-medium text-white/68 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {status === "loading" ? (
              <div className="h-10 w-40 animate-pulse rounded-full bg-white/10" />
            ) : isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-5 py-2.5 text-sm font-semibold text-white/85 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="inline-flex items-center gap-2 rounded-full bg-[#00B8DB] px-5 py-2.5 text-sm font-semibold text-black shadow-[0_0_32px_rgba(0,184,219,0.24)] transition hover:-translate-y-0.5 hover:bg-[#36d8f0] hover:shadow-[0_0_42px_rgba(0,184,219,0.34)]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="inline-flex rounded-full border border-white/10 bg-white/4 px-5 py-2.5 text-sm font-semibold text-white/85 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex rounded-full bg-[#00B8DB] px-5 py-2.5 text-sm font-semibold text-black shadow-[0_0_32px_rgba(0,184,219,0.24)] transition hover:-translate-y-0.5 hover:bg-[#36d8f0] hover:shadow-[0_0_42px_rgba(0,184,219,0.34)]"
                >
                  <ShinyText
                    text="Start free"
                    speed={2}
                    delay={0}
                    color="#d9d8d2"
                    shineColor="#ffffff"
                    spread={120}
                    direction="left"
                    yoyo={false}
                    pauseOnHover={false}
                    disabled={false}
                  />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </header>

      <div
        className={[
          "fixed inset-0 z-60 bg-black/55 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={closeMenu}
      />

      <aside
        className={[
          "fixed right-0 top-0 z-70 flex h-full w-[84%] max-w-sm flex-col border-l border-white/10 bg-[#02070d]/96 p-5 shadow-[-20px_0_70px_rgba(0,0,0,0.48)] backdrop-blur-2xl transition-transform duration-300 lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" onClick={closeMenu} aria-label="LinkDeck home">
            <Image src={Logo} alt="LinkDeck" className="h-auto w-32" priority />
          </Link>
          <button
            type="button"
            onClick={closeMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={link.href === "#features" ? handleFeaturesClick : closeMenu}
                className="rounded-2xl px-4 py-3 text-base font-medium text-white/80 transition hover:bg-white/6 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto border-t border-white/10 pt-5">
            {status === "loading" ? (
              <div className="space-y-3">
                <div className="h-12 animate-pulse rounded-2xl bg-white/10" />
                <div className="h-12 animate-pulse rounded-2xl bg-white/10" />
              </div>
            ) : isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-base font-semibold text-white/90 transition hover:bg-white/10"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00B8DB] px-5 py-3 text-base font-semibold text-black shadow-[0_0_30px_rgba(0,184,219,0.24)] transition hover:bg-[#36d8f0]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/signin"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-base font-semibold text-white/90 transition hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#00B8DB] px-5 py-3 text-base font-semibold text-black shadow-[0_0_30px_rgba(0,184,219,0.24)] transition hover:bg-[#36d8f0]"
                >
                  Start free
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
