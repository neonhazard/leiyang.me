import { ImageResponse } from "next/og";

// Default social-share card for every page that doesn't define its own.

export const alt = "Lei Yang — Principal Gameplay Animator at Tencent";
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
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 30% 40%, #2a1f3d 0%, #13111a 70%)",
          color: "#f3ede4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 6, color: "#e0674a" }}>
          LEIYANG.ME
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
            Lei Yang
          </div>
          <div style={{ fontSize: 48, marginTop: 20, color: "#d8cfc2" }}>
            Principal Gameplay Animator · Tencent
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#a39a8e", letterSpacing: 1 }}>
          Previously Infinity Ward · 9 shipped Call of Duty titles
        </div>
      </div>
    ),
    size,
  );
}
