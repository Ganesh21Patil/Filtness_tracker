import type { Metadata } from "next";

// The page itself is a client component (it reads the signed-in session), so
// its title lives here. Private to each account: kept out of search results.
export const metadata: Metadata = {
  title: "Saved estimates | TrainerLedger",
  robots: { index: false, follow: true },
};

export default function SavedEstimatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
