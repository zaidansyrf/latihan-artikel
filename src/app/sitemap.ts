import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://your-domain.com",
    },

    {
      url: "https://your-domain.com/posts",
    },

    {
      url: "https://your-domain.com/about",
    },
  ];
}