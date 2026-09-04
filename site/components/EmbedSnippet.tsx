"use client";

import { useEffect, useState } from "react";

export default function EmbedSnippet() {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const snippet = `<iframe src="${origin || "https://filtness-tracker.vercel.app"}/embed" width="100%" height="900" style="border:0;border-radius:16px;" title="TrainerLedger tax calculator"></iframe>`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — the code is still selectable/copyable manually
    }
  };

  return (
    <div className="rounded-2xl border border-white/15 bg-panel/60 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-xs font-semibold uppercase tracking-[.15em] text-accent-light">Embed snippet</p>
        <button
          type="button"
          onClick={copy}
          className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-ink transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto text-xs text-offwhite/80 leading-relaxed"><code>{snippet}</code></pre>
    </div>
  );
}
