import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Simplified brand mark — same spark used in the header, but as a filled shape
// (not the detailed multi-stroke illustration) so it survives at favicon size.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#00c7ef",
          borderRadius: "50%",
        }}
      >
        <div style={{ display: "flex", fontSize: 20, color: "#0c0c1c" }}>✦</div>
      </div>
    ),
    { ...size }
  );
}
