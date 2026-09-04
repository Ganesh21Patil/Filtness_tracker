import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fitness Coach Tax Calculator | Estimate 1099 & W-2 Taxes",
  description: "Free tax calculator built specifically for personal trainers and fitness coaches. Estimate your self-employment taxes, find missed deductions, and plan your quarterly payments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerifDisplay.variable}`}>
      <body className="flex min-h-screen flex-col bg-ink text-offwhite">
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
