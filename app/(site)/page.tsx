import HeroSection from "@/components/landing/HeroSection";
import SmoothLandingScroll from "@/components/landing/SmoothLandingScroll";
import ProductFeatures from "@/components/landing/ProductFeatures";
import DashboardPreview from "@/components/landing/DashboardPreview";
import CustomizationSection from "@/components/landing/CustomizationSection";
import FinalCTA from "@/components/landing/FinalCTA";
import LandingFooter from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
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
