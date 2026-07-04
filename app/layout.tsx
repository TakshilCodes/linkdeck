import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { Toaster } from "sonner";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://linkdeck.in"),
  title: {
    default: "LinkDeck.in",
    template: "%s | LinkDeck.in",
  },
  description:
    "Create one polished public page for all your links, socials, projects, content, and resources.",
  openGraph: {
    title: "LinkDeck.in",
    description:
      "A clean creator home for links, socials, projects, content, and resources.",
    url: "/",
    siteName: "LinkDeck.in",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkDeck.in",
    description: "Create one polished public page for everything worth sharing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative min-h-screen font-sans">
        <Toaster
          richColors
          position="top-center"
          expand
          closeButton
        />

        <div className="pointer-events-none absolute inset-0 -z-10 bg-[#030712] bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[22px_22px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_35%)]" />
        </div>

        <div className="relative z-10">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}