import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-[1440px] flex-col justify-between gap-8 px-6 py-12 text-sm text-offwhite/70 md:flex-row lg:px-12">
      <div>
        <Link href="/" className="rounded text-xl font-semibold text-offwhite">
          TrainerLedger
        </Link>
        <p className="mt-3 max-w-xs">A free tax estimate tool for independent personal trainers and fitness coaches.</p>
      </div>
      <p className="self-end">&copy; {new Date().getFullYear()} TrainerLedger &middot; Privacy first</p>
    </footer>
  );
}
