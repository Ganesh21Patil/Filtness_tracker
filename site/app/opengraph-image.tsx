import { ImageResponse } from "next/og";
import { STAR_PATH } from "../components/icons";

export const runtime = "edge";
export const alt = "TrainerLedger — Free tax calculator for personal trainers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// next/og can't read Tailwind, so the brand colours are inline on purpose.
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#05080f",
          backgroundImage:
            "radial-gradient(circle at 85% 0%, rgba(42,98,255,.32), transparent 55%), radial-gradient(circle at 0% 100%, rgba(217,178,95,.16), transparent 50%)",
          color: "#f4f7fc",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 56 }}>
          <svg width="64" height="64" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="19.4" fill="none" stroke="rgba(217,178,95,.45)" strokeWidth="0.9" />
            <path d={STAR_PATH} fillRule="evenodd" fill="#e2bd6a" />
          </svg>
          <div style={{ display: "flex", fontSize: 42, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Trainer<span style={{ color: "#e2bd6a" }}>Ledger</span>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: 80, lineHeight: 1.04, letterSpacing: "-0.03em", maxWidth: 960 }}>
          Build a business that&nbsp;<span style={{ color: "#1fb6ff" }}>moves</span>&nbsp;with you.
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#7cd0ff", marginTop: 44 }}>
          Free 2026 tax estimates for personal trainers
        </div>
      </div>
    ),
    { ...size }
  );
}
