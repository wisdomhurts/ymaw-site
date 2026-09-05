import type { NextConfig } from "next";

// Every path the old WordPress site had, from the Wayback index of ymaw.com.
// A dad who saved a link in 2019, or a Google result that hasn't recrawled,
// must land on the page that replaced it — never on a 404.
const OLD_SITE: [string, string][] = [
  ["/registration", "/register?role=young-man"],
  ["/registration-2", "/register?role=man"],
  ["/young-mens-registration-forms", "/register?role=young-man"],
  ["/mens-registration-forms", "/register?role=man"],
  ["/history", "/since-1990"],
  ["/leadership", "/the-men"],
  ["/gallery", "/media"],
  ["/contact", "/faq"],
  ["/respect", "/the-men"],
  ["/meeting", "/the-men"],
  ["/thank-you-2", "/register"],
  ["/cnn-this-is-life-with-lisa-ling", "/since-1990"],
  ["/young-men-overcome-their-fear-and-anxiety-young-mens-ultimate-weekend-ymuw-ft-brad-leslie", "/since-1990"],
  ["/category/press-release", "/since-1990"],
  ["/category/uncategorized", "/"],
  ["/hello-world", "/"],
  // The parents' page was "Bringing Him" until September 2026. You don't
  // bring him; you put him on a bus and drive away, which is the whole
  // emotional content of the page.
  ["/bringing-him", "/sending-him"],
  // the static prototype that briefly lived here
  ["/weekend.html", "/the-weekend"],
  ["/why.html", "/sending-him"],
  ["/team.html", "/the-men"],
  ["/faq.html", "/faq"],
  ["/donate.html", "/support"],
  ["/register.html", "/register"],
  ["/success.html", "/thank-you"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...OLD_SITE.map(([source, destination]) => ({ source, destination, permanent: true })),
      { source: "/the-weekend/", destination: "/the-weekend", permanent: true },
      // WordPress author archives and login, so old bots stop hammering a 404
      { source: "/author/:slug", destination: "/the-men", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/media/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/brand/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      {
        // The site takes health numbers, addresses and typed signatures.
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
