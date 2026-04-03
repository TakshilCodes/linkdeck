"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Logo from "@/public/logo/FullLogo.png";
import {
    BarChart3,
    ChevronDown,
    LayoutPanelLeft,
    LogOut,
    Menu,
    Palette,
    Settings,
    CircleHelp,
    X,
    Link2,
    User,
    CreditCard,
} from "lucide-react";

export default function Sidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [linkdeckOpen, setLinkdeckOpen] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const pathname = usePathname();
    const { data: session } = useSession();
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const username = session?.user?.username || "user";
    const profileImage = session?.user?.image || null;
    const profileUrl = `linkdeck.in/${username}`;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setProfileMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    const linkdeckItems = [
        {
            label: "Links",
            href: "/dashboard/links",
            icon: Link2,
            active:
                pathname === "/dashboard/links" ||
                pathname === "/dashboard",
        },
        {
            label: "Design",
            href: "/dashboard/design",
            icon: Palette,
            active: pathname === "/dashboard/design",
        },
    ];

    const singleItems = [
        {
            label: "Insights",
            href: "/dashboard/insights",
            icon: BarChart3,
            active: pathname === "/dashboard/insights",
        },
    ];

    return (
        <>
            {/* Mobile top bar */}
            <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#07111d]/90 px-4 backdrop-blur-xl md:hidden">
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                    aria-label="Open sidebar"
                >
                    <Menu className="h-5 w-5" />
                </button>

                <Link href="/dashboard" className="shrink-0">
                    <Image
                        src={Logo}
                        alt="LinkDeck"
                        className="h-auto w-25 sm:w-36 md:w-40 lg:w-44"
                        priority
                    />
                </Link>

                <div className="h-10 w-10" />
            </div>

            {/* Overlay */}
            <div
                onClick={() => setMobileOpen(false)}
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileOpen
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0"
                    }`}
            />

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72.5 flex-col border-r border-cyan-400/10 bg-[#07111d]/95 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-transform duration-300 md:sticky md:z-30 md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* top */}
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                    <Link href="/dashboard" className="shrink-0">
                        <Image
                            src={Logo}
                            alt="LinkDeck"
                            className="h-auto w-35 sm:w-36 md:w-40 lg:w-44"
                            priority
                        />
                    </Link>

                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
                        aria-label="Close sidebar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* profile */}
                <div className="border-b border-white/10 px-4 py-4">
                    <div ref={dropdownRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setProfileMenuOpen((prev) => !prev)}
                            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/4 px-3 py-3 text-left transition hover:bg-white/[0.07]"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10">
                                    {profileImage ? (
                                        <Image
                                            src={profileImage}
                                            alt={username}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-white/70">
                                            <User className="h-5 w-5" />
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-white">
                                        {username}
                                    </p>
                                    <p className="truncate text-xs text-white/55">{profileUrl}</p>
                                </div>
                            </div>

                            <ChevronDown
                                className={`h-4 w-4 shrink-0 text-white/60 transition ${profileMenuOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {/* dropdown */}
                        <div
                            className={`absolute left-0 top-[calc(100%+10px)] z-50 w-full overflow-hidden rounded-[22px] border border-white/10 bg-[#0b1726]/95 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-all duration-200 ${profileMenuOpen
                                ? "pointer-events-auto translate-y-0 opacity-100"
                                : "pointer-events-none -translate-y-1 opacity-0"
                                }`}
                        >
                            <div className="border-b border-white/10 px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10">
                                        {profileImage ? (
                                            <Image
                                                src={profileImage}
                                                alt={username}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-white/70">
                                                <User className="h-5 w-5" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-white">
                                            {username}
                                        </p>
                                        <p className="truncate text-xs text-white/55">
                                            {profileUrl}
                                        </p>
                                    </div>

                                    <div className="rounded-full border border-cyan-400/15 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                                        Free
                                    </div>
                                </div>
                            </div>

                            <div className="py-1.5">
                                <Link
                                    href="/account"
                                    onClick={() => {
                                        setProfileMenuOpen(false);
                                        setMobileOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/5"
                                >
                                    <Settings className="h-4 w-4 text-white/60" />
                                    Account
                                </Link>

                                <Link
                                    href="/upgrade"
                                    onClick={() => {
                                        setProfileMenuOpen(false);
                                        setMobileOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/5"
                                >
                                    <CreditCard className="h-4 w-4 text-white/60" />
                                    Upgrade
                                </Link>

                                <Link
                                    href="/help"
                                    onClick={() => {
                                        setProfileMenuOpen(false);
                                        setMobileOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/5"
                                >
                                    <CircleHelp className="h-4 w-4 text-white/60" />
                                    Help
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-white/85 transition hover:bg-white/5"
                                >
                                    <LogOut className="h-4 w-4 text-white/60" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* nav */}
                <div className="flex-1 overflow-y-auto px-4 py-5">
                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={() => setLinkdeckOpen((prev) => !prev)}
                            className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left transition hover:bg-white/5"
                        >
                            <div className="flex items-center gap-3">
                                <LayoutPanelLeft className="h-4.5 w-4.5 text-white/65" />
                                <span className="text-sm font-medium text-white/75">
                                    LinkDeck
                                </span>
                            </div>

                            <ChevronDown
                                className={`h-4 w-4 text-white/50 transition ${linkdeckOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {linkdeckOpen && (
                            <div className="ml-2 border-l border-white/10 pl-4">
                                <div className="space-y-1">
                                    {linkdeckItems.map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${item.active
                                                    ? "bg-cyan-400/12 font-semibold text-cyan-300"
                                                    : "font-medium text-white/75 hover:bg-white/5 hover:text-white"
                                                    }`}
                                            >
                                                <Icon
                                                    className={`h-4.5 w-4.5 ${item.active ? "text-cyan-300" : "text-white/55"
                                                        }`}
                                                />
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-5 space-y-1">
                        {singleItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm transition ${item.active
                                        ? "bg-white/8 font-semibold text-white"
                                        : "font-medium text-white/75 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    <Icon
                                        className={`h-4.5 w-4.5 ${item.active ? "text-white" : "text-white/55"
                                            }`}
                                    />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </aside>
        </>
    );
}