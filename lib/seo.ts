import type { Metadata } from "next";

export const seoConfig = {
  siteName: "LinkDeck.in",
  siteUrl: "https://linkdeck.in",
  defaultTitle: "LinkDeck.in - One beautiful page for all your links",
  titleTemplate: "%s | LinkDeck.in",
  defaultDescription:
    "Create a beautiful, customizable link-in-bio page, organize your links, track clicks, and share your online presence with LinkDeck.",
  defaultKeywords: [
    "LinkDeck",
    "link in bio",
    "creator links",
    "custom link page",
    "Linktree alternative",
    "social links",
    "creator profile",
    "link analytics",
  ],
  defaultOgImage: "/opengraph-image",
  creator: "LinkDeck.in",
  authors: [{ name: "LinkDeck.in", url: "https://linkdeck.in" }],
} as const;

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string | null;
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, seoConfig.siteUrl).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image || seoConfig.defaultOgImage);

  return {
    title: { absolute: title },
    description,
    keywords: [...seoConfig.defaultKeywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: seoConfig.siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${seoConfig.siteName} preview`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
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
}

export function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
