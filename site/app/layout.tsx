import "./globals.css";
import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans, DM_Serif_Display, Nothing_You_Could_Do } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RevealObserver from "../components/RevealObserver";
import Toaster from "../components/Toaster";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Only the styles in use: every listed style is another font file, and
// next/font preloads them all on every page.
const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

// Accent faces for the brand's painted-on-the-wall slogans and handwritten
// margin notes. Decorative only — never used for body copy or data — and only
// shown from xl, so they aren't preloaded: the browser fetches them when a
// slogan actually renders, instead of on every page load.
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-condensed",
  display: "swap",
  preload: false,
});

const handwriting = Nothing_You_Could_Do({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
  preload: false,
});

// TODO: swap for the real domain once one is purchased (see Phase 3 of the
// improvement plan). Every absolute URL below (OG image, canonical links)
// resolves from this.
const siteUrl = "https://filtness-tracker.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TrainerLedger | Free Tax Calculator for Personal Trainers",
    template: "%s",
  },
  description: "Free tax calculator built specifically for personal trainers and fitness coaches. Estimate your self-employment taxes, find missed deductions, and plan your quarterly payments.",
  openGraph: {
    title: "TrainerLedger | Free Tax Calculator for Personal Trainers",
    description: "Estimate your self-employment taxes, find missed deductions, and plan your quarterly payments — free, no signup.",
    url: siteUrl,
    siteName: "TrainerLedger",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrainerLedger | Free Tax Calculator for Personal Trainers",
    description: "Estimate your self-employment taxes, find missed deductions, and plan your quarterly payments — free, no signup.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerifDisplay.variable} ${barlowCondensed.variable} ${handwriting.variable}`}>
      <body className="flex min-h-screen flex-col bg-ink text-offwhite">
        <Header />
        {/* The skip link's target. scroll-mt: the header is sticky, so landing
            here must not tuck the top of the page under it. */}
        <div id="main" className="flex flex-1 scroll-mt-[72px] flex-col">
          {children}
        </div>
        <Footer />
        <RevealObserver />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
