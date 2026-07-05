import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { absoluteUrl, seoConfig } from "@/lib/seo";

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
  metadataBase: new URL(seoConfig.siteUrl),
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate,
  },
  description: seoConfig.defaultDescription,
  keywords: [...seoConfig.defaultKeywords],
  authors: [...seoConfig.authors],
  creator: seoConfig.creator,
  publisher: seoConfig.siteName,
  applicationName: seoConfig.siteName,
  category: "creator tools",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    url: absoluteUrl("/"),
    siteName: seoConfig.siteName,
    images: [
      {
        url: absoluteUrl(seoConfig.defaultOgImage),
        width: 1200,
        height: 630,
        alt: "LinkDeck.in social preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    images: [absoluteUrl(seoConfig.defaultOgImage)],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/logo/icon.png", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
        <Analytics />
      </body>
    </html>
  );
}
