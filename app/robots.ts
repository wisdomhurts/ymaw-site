import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/register/sign/", "/thank-you"] }], sitemap: "https://ymaw.com/sitemap.xml" };
}
