import type { Metadata } from "next";
import SimpleMarketingPage from "@/components/marketing/SimpleMarketingPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Learn — LinkDeck.in",
  description:
    "Learn how to build a better LinkDeck profile with guides for links, collections, themes, previews, analytics, and sharing.",
  path: "/learn",
  keywords: ["LinkDeck guides", "link in bio tips", "creator profile guide"],
});

export default function LearnPage() {
  return (
    <SimpleMarketingPage
      eyebrow="Learn"
      title="Build a better creator page, one clear choice at a time."
      description="Use LinkDeck learning resources to improve your profile structure, link organization, visual design, and sharing workflow."
      primaryHref="/help"
      primaryLabel="Open help center"
      items={[
        {
          title: "Profile basics",
          description:
            "Set a clear title, bio, social row, and public URL so people instantly know who you are.",
        },
        {
          title: "Link strategy",
          description:
            "Group links by purpose and keep important destinations easy to reach from any social platform.",
        },
        {
          title: "Design polish",
          description:
            "Tune colors, text, wallpaper, and buttons so your page feels intentional without needing code.",
        },
      ]}
    />
  );
}
