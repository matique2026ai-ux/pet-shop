import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/cart"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://paws-wings.vercel.app"}/sitemap.xml`,
  };
}
