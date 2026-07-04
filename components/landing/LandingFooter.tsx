"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowUpRight, LayoutDashboard } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { IconType } from "react-icons";
import Logo from "@/public/logo/FullLogo.png";

type FooterLink = {
  label: string;
  href: string;
};

type SocialLink = FooterLink & {
  icon: IconType;
};

const productLinks: FooterLink[] = [
  { label: "Features", href: "#features" },
  { label: "Help", href: "/help" },
];

const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/TakshilCodes",
    icon: FaGithub,
  },
  {
    label: "X",
    href: "https://x.com/TakshilDev",
    icon: FaXTwitter,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/takshilpandya",
    icon: FaLinkedinIn,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/takshillpandya",
    icon: FaInstagram,
  },
];

export default function LandingFooter() {
  const { data: session, status } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#02070d] px-6 pb-10 pt-8 text-white md:px-10 md:pb-12 md:pt-10">
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 rounded-[28px] border border-white/10 bg-[#050b12] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.38)] md:grid-cols-[1.4fr_0.8fr_0.8fr] md:p-8 lg:p-9">
          <div>
            <Link
              href="/"
              className="inline-flex"
              aria-label="LinkDeck home"
            >
              <Image
                src={Logo}
                alt="LinkDeck"
                className="h-auto w-36 md:w-40"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-white/55">
              A polished home for creator links, socials, projects, resources,
              and everything worth sharing.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/4 text-white/72 transition hover:border-[#00B8DB]/40 hover:bg-[#00B8DB]/10 hover:text-white hover:shadow-[0_0_26px_rgba(0,184,219,0.14)]"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Website</h2>
            <div className="mt-4 flex flex-col gap-3">
              {productLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-white/58 transition hover:text-white"
                >
                  {link.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Account</h2>
            <div className="mt-4 flex flex-col gap-3">
              {status === "loading" ? (
                <>
                  <div className="h-5 w-24 animate-pulse rounded-full bg-white/10" />
                  <div className="h-5 w-28 animate-pulse rounded-full bg-white/10" />
                </>
              ) : isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm font-semibold text-white/82 transition hover:border-[#00B8DB]/35 hover:bg-[#00B8DB]/10 hover:text-white"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-fit text-sm font-medium text-white/58 transition hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex w-fit rounded-full bg-[#00B8DB] px-4 py-2 text-sm font-semibold text-black shadow-[0_0_30px_rgba(0,184,219,0.2)] transition hover:-translate-y-0.5 hover:bg-[#36d8f0] hover:shadow-[0_0_40px_rgba(0,184,219,0.3)]"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 text-xs text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {currentYear} LinkDeck.in. All rights reserved.</p>
          <p>Built for creators who want one clean place to share.</p>
        </div>
      </div>
    </footer>
  );
}
