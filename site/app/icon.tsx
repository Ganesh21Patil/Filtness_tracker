import { ImageResponse } from "next/og";
import { SPARK_PATH } from "../components/icons";

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
        <svg width="18" height="18" viewBox="0 0 72 72">
          <path d={SPARK_PATH} fill="#0c0c1c" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
