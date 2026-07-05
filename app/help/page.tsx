import type { Metadata } from "next";
import HelpCenterClient from "@/components/help/HelpCenterClient";
import JsonLd from "@/components/seo/JsonLd";
import { helpArticles } from "@/lib/help/help-data";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Help Center — LinkDeck.in",
  description:
    "Find answers for LinkDeck setup, links, collections, themes, customization, analytics, account settings, and dashboard questions.",
  path: "/help",
  keywords: ["LinkDeck help", "LinkDeck support", "creator profile help"],
});

export default function HelpPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: helpArticles.map((article) => ({
      "@type": "Question",
      name: article.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: article.content,
      },
    })),
    url: absoluteUrl("/help"),
  };

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <HelpCenterClient />
    </>
  );
}
