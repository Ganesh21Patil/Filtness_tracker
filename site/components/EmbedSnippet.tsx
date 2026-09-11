"use client";

import { useEffect, useState } from "react";
import { button } from "./ui";
import { CheckIcon, CodeIcon } from "./icons";

export default function EmbedSnippet() {
  const [origin, setOrigin] = useState("");
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const snippet = `<iframe src="${origin || "https://filtness-tracker.vercel.app"}/embed" width="100%" height="1100" style="border:0;border-radius:24px;background:#05080f;" title="TrainerLedger tax calculator"></iframe>`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setStatus("copied");
    } catch {
      // Clipboard API blocked (permissions, insecure context) — fall back to
      // the classic textarea + execCommand trick so the button still works.
      try {
        const textarea = document.createElement("textarea");
        textarea.value = snippet;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        setStatus(ok ? "copied" : "failed");
      } catch {
        setStatus("failed");
      }
    }
    setTimeout(() => setStatus("idle"), 2500);
  };

  return (
    <div className="glass-glow rounded-card p-5 sm:p-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2.5 eyebrow text-accent-light">
          <CodeIcon className="size-5" />
          Embed snippet
        </p>
        <button type="button" onClick={copy} className={button({ variant: "electric", size: "sm" })}>
          {status === "copied" && <CheckIcon className="size-4" strokeWidth={2.25} />}
          {status === "copied" ? "Copied!" : status === "failed" ? "Select & copy manually" : "Copy snippet"}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-control border border-white/10 bg-ink/70 p-4 text-xs leading-relaxed text-haze">
        <code>{snippet}</code>
      </pre>
    </div>
  );
}
