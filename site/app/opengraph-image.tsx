import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TrainerLedger — Free tax calculator for personal trainers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "#0c0c1c",
          color: "#f6f5ff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: "#00c7ef",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              color: "#0c0c1c",
            }}
          >
            ✦
          </div>
          <div style={{ fontSize: 36, fontWeight: 600 }}>TrainerLedger</div>
        </div>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 900 }}>
          Build a business that moves with you.
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#70ddf6", marginTop: 40 }}>
          Free tax estimates for personal trainers
        </div>
      </div>
    ),
    { ...size }
  );
}
