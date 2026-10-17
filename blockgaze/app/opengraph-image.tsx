import { ImageResponse } from "next/og";

export const alt = "BlockGaze: cryptocurrency prices, charts and market data";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#F4F6F7",
          color: "#14202B",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="6" fill="#0B5A66" />
          <circle cx="16" cy="16" r="8" fill="none" stroke="#F4F6F7" strokeWidth="2.5" />
          <circle cx="18.5" cy="14" r="3" fill="#F4F6F7" />
        </svg>
        <div style={{ fontSize: 112, fontWeight: 700, marginTop: 40, letterSpacing: -3 }}>BlockGaze</div>
        <div style={{ fontSize: 40, marginTop: 16, color: "#52636F" }}>
          Prices, charts and market data for the top 100 cryptocurrencies
        </div>
      </div>
    ),
    size,
  );
}
