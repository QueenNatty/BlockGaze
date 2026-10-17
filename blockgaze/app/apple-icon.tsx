import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <svg width="180" height="180" viewBox="0 0 32 32">
          <rect width="32" height="32" fill="#0B5A66" />
          <circle cx="16" cy="16" r="8" fill="none" stroke="#F4F6F7" strokeWidth="2.5" />
          <circle cx="18.5" cy="14" r="3" fill="#F4F6F7" />
        </svg>
      </div>
    ),
    size,
  );
}
