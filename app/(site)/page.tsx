import type { Metadata } from "next";
import HeroSection from "@/components/landing/HeroSection";
import SmoothLandingScroll from "@/components/landing/SmoothLandingScroll";
import ProductFeatures from "@/components/landing/ProductFeatures";
import DashboardPreview from "@/components/landing/DashboardPreview";
import CustomizationSection from "@/components/landing/CustomizationSection";
import FinalCTA from "@/components/landing/FinalCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, createPageMetadata, seoConfig } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "LinkDeck.in — One beautiful page for all your links",
  description:
    "Create a polished link-in-bio page, organize creator links, customize your design, and track clicks from one clean LinkDeck dashboard.",
  path: "/",
  keywords: ["creator dashboard", "public profile", "link management"],
});

export default function HomePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: seoConfig.siteName,
      url: seoConfig.siteUrl,
      description: seoConfig.defaultDescription,
      inLanguage: "en",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: seoConfig.siteName,
      url: seoConfig.siteUrl,
      logo: absoluteUrl("/logo/icon.png"),
      sameAs: [],
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <JsonLd data={jsonLd} />
      <SmoothLandingScroll />
      <HeroSection />
      <ProductFeatures />
      <DashboardPreview />
      <CustomizationSection />
      <FinalCTA />
      <LandingFooter />
    </main>
  );
}
