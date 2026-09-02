import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/registration", destination: "/register?role=young-man", permanent: true },
      { source: "/registration-2", destination: "/register?role=man", permanent: true },
      { source: "/the-weekend/", destination: "/the-weekend", permanent: true },
      { source: "/history", destination: "/since-1990", permanent: true },
      { source: "/leadership", destination: "/the-men", permanent: true },
      { source: "/gallery", destination: "/since-1990", permanent: true },
      { source: "/contact", destination: "/faq", permanent: true },
      { source: "/weekend.html", destination: "/the-weekend", permanent: true },
      { source: "/why.html", destination: "/bringing-him", permanent: true },
      { source: "/team.html", destination: "/the-men", permanent: true },
      { source: "/faq.html", destination: "/faq", permanent: true },
      { source: "/donate.html", destination: "/support", permanent: true },
      { source: "/register.html", destination: "/register", permanent: true },
      { source: "/success.html", destination: "/thank-you", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/media/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/brand/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
