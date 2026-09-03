import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
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
    <html lang="en" className={manrope.variable}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
