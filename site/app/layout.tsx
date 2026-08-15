import "./globals.css";
import type { Metadata } from "next";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
