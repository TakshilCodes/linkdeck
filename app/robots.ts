import type { MetadataRoute } from "next";
import { absoluteUrl, seoConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/features", "/explore", "/learn", "/help"],
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/api/",
          "/login",
          "/signup",
          "/verify-otp",
          "/post-auth",
          "/onboarding",
          "/account",
          "/settings",
          "/themes/playground",
          "/themes/preview",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: seoConfig.siteUrl,
  };
}
