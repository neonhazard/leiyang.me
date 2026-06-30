import type { Metadata } from "next";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import ReelGate from "@/components/ReelGate";

export const metadata: Metadata = {
  title: "Game Animation Demo Reel",
  description:
    "Lei Yang's game animation demo reel — gameplay, NPC, and motion-capture work from nine shipped Call of Duty titles. Password-protected.",
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
            Protected demo reel — enter the password to view.
          </p>
        </div>

        <section className="mb-12">
          <ReelGate />
        </section>

        <Link href="/#work" className="btn">
          ← Back to My Work
        </Link>
      </main>
    </div>
  );
}
