"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import Logo from "@/public/logo/FullLogo.png";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const isLoggedIn = !!session?.user;

  const navLinks = [
    { id: 1, href: "#", label: "Features" },
    { id: 2, href: "#", label: "Explore" },
    { id: 3, href: "#", label: "Learn" },
    { id: 4, href: "#", label: "Help" },
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-5 sm:px-6 lg:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-cyan-400/15 bg-white/8 px-3 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl supports-backdrop-filter:bg-[#08182a]/70 sm:px-4 lg:px-5">
          {/* Left */}
          <div className="flex items-center gap-8">
            <Link href="/" className="shrink-0">
              <Image
                src={Logo}
                alt="LinkDeck"
                className="h-auto w-32 sm:w-36 md:w-40 lg:w-44"
                priority
              />
            </Link>

            <div className="hidden items-center gap-6 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-[1rem] font-medium text-white/80 transition hover:text-cyan-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right */}
          <div className="hidden items-center gap-3 lg:flex">
            {status === "loading" ? (
              <div className="h-11 w-44 animate-pulse rounded-full bg-white/10" />
            ) : isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-[18px] border border-white/10 bg-white/6 px-5 py-3 text-[1rem] font-semibold text-white/90 transition hover:bg-white/10"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-[1rem] font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.22)] transition hover:bg-cyan-300"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="inline-flex rounded-[18px] border border-white/10 bg-white/6 px-6 py-3 text-[1rem] font-semibold text-white/90 transition hover:bg-white/10"
                >
                  Log in
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex rounded-full bg-cyan-400 px-7 py-3 text-[1rem] font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.22)] transition hover:bg-cyan-300"
                >
                  Sign up free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white transition hover:bg-white/10 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-60 bg-black/45 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar */}
      <aside
        className={`fixed right-0 top-0 z-70 flex h-full w-[82%] max-w-sm flex-col border-l border-cyan-400/15 bg-[#071423]/95 p-5 shadow-[-10px_0_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-transform duration-300 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <Image
              src={Logo}
              alt="LinkDeck"
              className="h-auto w-32"
              priority
            />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white transition hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-[1rem] font-medium text-white/85 transition hover:bg-white/8 hover:text-cyan-300"
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
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-5 py-3 text-[1rem] font-semibold text-white/90 transition hover:bg-white/10"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-[1rem] font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.22)] transition hover:bg-cyan-300"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/6 px-5 py-3 text-[1rem] font-semibold text-white/90 transition hover:bg-white/10"
                >
                  Log in
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-[1rem] font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.22)] transition hover:bg-cyan-300"
                >
                  Sign up free
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}