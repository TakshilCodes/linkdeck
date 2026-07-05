import type { Metadata } from "next";
import SimpleMarketingPage from "@/components/marketing/SimpleMarketingPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Explore Profiles — LinkDeck.in",
  description:
    "Explore public LinkDeck profiles and see how creators organize links, socials, projects, resources, and content.",
  path: "/explore",
  keywords: ["explore profiles", "creator profiles", "public LinkDeck pages"],
});

export default function ExplorePage() {
  return (
    <SimpleMarketingPage
      eyebrow="Explore"
      title="Discover how creators shape their LinkDeck pages."
      description="Browse public-facing profile patterns, organized collections, social links, and polished creator pages as the LinkDeck community grows."
      primaryHref="/features"
      primaryLabel="View features"
      items={[
        {
          title: "Creator pages",
          description:
            "See how a single clean profile can bring projects, socials, shops, videos, and resources together.",
        },
        {
          title: "Collections",
          description:
            "Understand how grouped links make pages easier to scan for visitors who arrive from social bios.",
        },
        {
          title: "Public design",
          description:
            "Compare layout, button, theme, and profile choices that make a public page feel more personal.",
        },
      ]}
    />
  );
}
