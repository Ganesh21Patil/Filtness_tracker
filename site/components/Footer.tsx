import Link from "next/link";

const columns = [
  {
    title: "Calculator",
    links: [
      { href: "/#calculator", label: "Tax Estimate" },
      { href: "/about", label: "Methodology & Sources" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/guides/personal-trainer-tax-deductions", label: "Trainer Tax Deductions" },
      { href: "/guides/1099-vs-w2-personal-trainers", label: "1099 vs W-2" },
      { href: "/guides/quarterly-tax-deadlines-fitness-pros", label: "Quarterly Deadlines" },
    ],
  },
  {
    title: "About",
    links: [{ href: "/about", label: "About TrainerLedger" }],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-dark text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-white">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-500 text-dark">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </span>
              TrainerLedger
            </Link>
            <p className="mt-3 max-w-xs text-sm text-gray-400">
              A free tax estimate tool built for independent personal trainers and fitness coaches.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} TrainerLedger. For planning purposes only, not tax or legal advice.</p>
        </div>
      </div>
    </footer>
  );
}
