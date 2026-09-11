import Link from "next/link";
import type { Metadata } from "next";
import PageHeader, { PageBand } from "../components/PageHeader";
import { LogoMark } from "../components/Logo";
import { button } from "../components/ui";
import { ArrowRightIcon } from "../components/icons";
import summit from "../public/images/summit.jpg";

export const metadata: Metadata = {
  title: "Page not found | TrainerLedger",
  robots: { index: false, follow: true },
};

// Replaces Next's default 404, which rendered unstyled on the dark ground.
export default function NotFound() {
  return (
    <main className="flex-1 overflow-x-clip">
      <PageBand photo={summit}>
        <div className="flex flex-col items-center text-center">
          <LogoMark className="mb-8 size-14" />
          <PageHeader
            align="center"
            eyebrow="Error 404"
            title="This trail doesn't go anywhere."
            lede="The page you're looking for has moved or never existed. Your numbers are safe — they live in your browser."
          />
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/calculator" className={button({ size: "lg" })}>
              Go to the calculator
              <ArrowRightIcon className="size-4" />
            </Link>
            <Link href="/" className={button({ variant: "secondary", size: "lg" })}>
              Back to home
            </Link>
          </div>
        </div>
      </PageBand>
    </main>
  );
}
