import type { Metadata } from "next";
import Link from "next/link";
import Masthead from "@/components/Masthead";

export const metadata: Metadata = {
  title: "Game Animation Demo Reel",
  description:
    "Lei Yang's game animation demo reel — gameplay, NPC, and motion-capture work from nine shipped Call of Duty titles.",
  alternates: { canonical: "/portfolio/game-animation" },
};

export default function GameAnimation() {
  return (
    <div className="min-h-screen bg-page">
      <Masthead />

      <main className="shell py-16">
        <div className="mb-10">
          <Link
            href="/#work"
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 20,
            }}
          >
            ← Back to My Work
          </Link>
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
            Game <span style={{ fontFamily: "var(--font-bodoni), serif", fontStyle: "italic", color: "var(--accent)" }}>Animation</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 18, fontWeight: 300 }}>
            Demo reel and interactive character animations
          </p>
        </div>

        <section className="mb-12">
          <div style={{ border: "1px solid var(--rule)", overflow: "hidden" }}>
            <div className="aspect-video bg-black">
              <iframe
                src="https://player.vimeo.com/video/1188283054?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479"
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Lei Yang Demo Reel"
              />
            </div>
            <div style={{ padding: "20px 24px 24px", borderTop: "1px solid var(--rule)" }}>
              <h2
                style={{
                  fontFamily: "var(--font-bricolage), sans-serif",
                  fontWeight: 600,
                  fontSize: 22,
                  letterSpacing: "-0.02em",
                  color: "var(--fg)",
                  margin: "0 0 8px",
                }}
              >
                Demo Reel
              </h2>
              <p style={{ color: "var(--muted)", fontSize: 13, fontWeight: 300, margin: 0 }}>
                A selection of character animation work across shipped titles. An updated reel is on the way.
              </p>
            </div>
          </div>
        </section>

        <Link href="/#work" className="btn">
          ← Back to My Work
        </Link>
      </main>
    </div>
  );
}
