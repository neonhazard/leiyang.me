import type { Metadata } from "next";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import ReelGate from "@/components/ReelGate";
import { SHIPPED_TITLES, socialMetadata } from "@/constants/site";

const TITLE = "Call of Duty Game Animation Reel";
const DESCRIPTION =
  "Lei Yang's gameplay animation reel — NPC combat systems, mocap, and signature moments like Riley the dog, from nine shipped Call of Duty titles at Infinity Ward.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/portfolio/game-animation" },
  ...socialMetadata(TITLE, DESCRIPTION, "/portfolio/game-animation"),
};

const HIGHLIGHTS = [
  {
    title: "Soldier & civilian AI",
    game: "Modern Warfare II · Modern Warfare III",
    body: "As Lead AI Animator, owned the animation systems for every soldier and civilian NPC, redesigned the combat loop and hit-reaction system, and directed the mocap shoots behind them.",
  },
  {
    title: "Riley the dog",
    game: "Call of Duty: Ghosts",
    body: "Led animation for Riley, the squad's military dog and one of the game's signature features — design, creation, and in-game implementation.",
  },
  {
    title: "Snowmobile chase",
    game: "Call of Duty: Modern Warfare 2",
    body: "Drove the design and creation of the snowmobile animation set, from rider performance to gameplay integration and polish.",
  },
  {
    title: "The Coup",
    game: "Call of Duty 4: Modern Warfare",
    body: "Owned the animation for the scripted first-person sequence that plays under the game's opening credits, built for cinematic impact.",
  },
  {
    title: "Pointe du Hoc",
    game: "Call of Duty 2 · E3 showcase",
    body: "Spearheaded the massive beach-assault scene shown at E3, delivered on a tight showcase deadline.",
  },
];

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
          <p style={{ color: "var(--muted)", fontSize: 18, fontWeight: 300, maxWidth: 720 }}>
            Gameplay and NPC animation by Lei Yang across nine shipped Call of
            Duty titles at Infinity Ward. The reel is password-protected.
          </p>
        </div>

        <section className="mb-12" aria-labelledby="highlights-h">
          <h2
            id="highlights-h"
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent)",
              margin: "0 0 20px",
            }}
          >
            Selected work
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {HIGHLIGHTS.map((h) => (
              <article key={h.title} style={{ border: "1px solid var(--rule)", padding: "20px 22px" }}>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--fg)", margin: "0 0 4px" }}>
                  {h.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-space-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--muted-2)",
                    margin: "0 0 10px",
                  }}
                >
                  {h.game}
                </p>
                <p style={{ fontSize: 14, fontWeight: 300, color: "var(--muted)", margin: 0 }}>
                  {h.body}
                </p>
              </article>
            ))}
          </div>
          <p style={{ fontSize: 13, fontWeight: 300, color: "var(--muted-2)", marginTop: 20 }}>
            Credits: {SHIPPED_TITLES.map((t) => `${t.name} (${t.year})`).join(" · ")}
          </p>
        </section>

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
