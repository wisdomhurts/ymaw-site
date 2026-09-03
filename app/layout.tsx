import type { Metadata, Viewport } from "next";
import "@fontsource-variable/big-shoulders-display";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "@fontsource/atkinson-hyperlegible/400-italic.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import Providers from "@/components/Providers";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { FACTS } from "@/lib/facts";

const SITE = process.env.PUBLIC_SITE_URL || "https://ymaw.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "YMAW · Young Men's Adventure Weekend · A rite of passage since 1990",
    template: "%s · YMAW",
  },
  description: `Not a summer camp. A rite of passage. Three days of fire, water and real work in the Squamish wilderness for young men aged ${FACTS.ages.min}–${FACTS.ages.max}, with men who have shown up for young men since 1990. ${FACTS.dates.label}. $${FACTS.priceCAD} CAD.`,
  openGraph: {
    title: "YMAW · Young Men's Adventure Weekend",
    description: "Not a summer camp. A rite of passage. September 11–13, 2026, Squamish region, BC.",
    url: SITE,
    siteName: "YMAW",
    images: [{ url: "/media/gallery/stills/p-y2019-0231.webp", width: 1800, height: 1350, alt: "Dusk. Everyone in a circle around the fire by the lake" }],
    locale: "en_CA",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0a0d11",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className="h-full">
      <body className="min-h-full flex flex-col">
        <Providers>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:text-night">
            Skip to content
          </a>
          <Nav />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
