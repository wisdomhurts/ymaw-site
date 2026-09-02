import type { MetadataRoute } from "next";
const SITE = process.env.PUBLIC_SITE_URL || "https://ymaw.com";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ["", "/his-path", "/bringing-him", "/the-weekend", "/since-1990", "/media", "/the-men", "/support", "/faq", "/what-to-bring", "/register"].map((p) => ({ url: `${SITE}${p}`, lastModified: now, changeFrequency: p === "" ? "weekly" : "monthly", priority: p === "" ? 1 : p === "/register" ? 0.9 : 0.7 }));
}
