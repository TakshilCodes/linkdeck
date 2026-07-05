import type { Metadata } from "next";
import SimpleMarketingPage from "@/components/marketing/SimpleMarketingPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Features — LinkDeck.in",
  description:
    "Explore LinkDeck features for building a public link profile, organizing links, customizing themes, previewing changes, and reading simple insights.",
  path: "/features",
  keywords: ["LinkDeck features", "link organization", "theme customization"],
});

export default function FeaturesPage() {
  return (
    <SimpleMarketingPage
      eyebrow="Features"
      title="Everything your public link page needs, without the clutter."
      description="LinkDeck brings profiles, links, collections, customization, previews, and simple insights into one focused creator dashboard."
      items={[
        {
          title: "Organized profiles",
          description:
            "Add your avatar, bio, socials, links, and collections so visitors can find the right destination quickly.",
        },
        {
          title: "Design control",
          description:
            "Adjust themes, wallpaper, colors, typography, buttons, and profile styling from a visual dashboard.",
        },
        {
          title: "Simple insights",
          description:
            "Track profile views, link clicks, click-through rate, top links, and recent activity without overcomplicated analytics.",
        },
      ]}
    />
  );
}
