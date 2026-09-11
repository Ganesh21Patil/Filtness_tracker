import { ImageResponse } from "next/og";
import { STAR_PATH } from "../components/icons";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// The brand star on the midnight ground (no ring — it blurs at 32px). next/og
// can't read Tailwind, so the brand colours are inline here (and in
// opengraph-image.tsx) on purpose.
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
          background: "#05080f",
          borderRadius: 8,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 40 40">
          <path d={STAR_PATH} fillRule="evenodd" fill="#e2bd6a" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
