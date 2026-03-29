import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[#030712] bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[22px_22px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_35%)]" />
        </div>
        <div className="relative z-10">
            <Navbar/>
            {children}
        </div>
      </body>
    </html>
  );
}
