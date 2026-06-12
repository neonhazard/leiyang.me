import type { Metadata } from "next";
import Masthead from "@/components/Masthead";
import { SITE_URL } from "@/constants/site";

export const metadata: Metadata = {
  title: "Hailstone — Browser Game",
  description:
    "Hailstone is a steampunk vertical shooter by Lei Yang, built with Phaser 3. Play it free in your browser — no download or install required.",
  alternates: { canonical: "/games/hailstone" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "Hailstone",
  url: `${SITE_URL}/games/hailstone`,
  author: { "@id": `${SITE_URL}/#person` },
  gamePlatform: "Web Browser",
  playMode: "SinglePlayer",
  inLanguage: "en",
};

export default function Hailstone() {
  return (
    <div className="min-h-screen bg-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Masthead />

      <main className="shell py-16">
        <div className="mb-12">
          <div
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 12,
            }}
          >
            Side projects · web game
          </div>
          <h1
            style={{
              fontFamily: "var(--font-bricolage), sans-serif",
              fontWeight: 600,
              fontVariationSettings: '"opsz" 72',
              fontSize: "clamp(40px, 6vw, 88px)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              margin: "0 0 16px",
              color: "var(--fg)",
            }}
          >
            Hail<span style={{ fontFamily: "var(--font-bodoni), serif", fontStyle: "italic", color: "var(--accent)" }}>stone</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 18, fontWeight: 300, maxWidth: 480 }}>
            A steampunk vertical shooter built with Phaser&nbsp;3. Runs entirely
            in your browser.
          </p>
        </div>

        {/* Game renders at 405x720 (9:16 portrait); size the frame to match
            so Phaser's FIT scaling fills it without scrollbars. */}
        <div style={{ maxWidth: "calc(min(78vh, 720px) * 0.5625)", margin: "0 auto" }}>
          <iframe
            src="/games/hailstone/index.html"
            title="Hailstone — playable browser game"
            allowFullScreen
            scrolling="no"
            style={{
              width: "100%",
              aspectRatio: "405 / 720",
              display: "block",
              overflow: "hidden",
              border: "1px solid var(--surface)",
              borderRadius: 8,
              background: "#000",
            }}
          />
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "var(--muted)",
            }}
          >
            <span>Best played with sound on</span>
            <a
              href="/games/hailstone/index.html"
              target="_blank"
              rel="noopener"
              style={{ color: "var(--accent)" }}
            >
              Open fullscreen ↗
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
