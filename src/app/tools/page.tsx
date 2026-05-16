import Link from "next/link";
import Masthead from "@/components/Masthead";

export default function Tools() {
  return (
    <div className="min-h-screen bg-page">
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
            Side projects · experiments
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
            The <span style={{ fontFamily: "var(--font-bodoni), serif", fontStyle: "italic", color: "var(--accent)" }}>playground</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 18, fontWeight: 300, maxWidth: 480 }}>
            Personal tools and AI-powered solutions I&apos;ve built.
          </p>
        </div>

        <div style={{ maxWidth: 640 }}>
          <Link
            href="/tools/purchasing-power"
            className="pcard"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              className="pcard-art"
              style={{ aspectRatio: "16/9", background: "var(--surface)" }}
            >
              <PowerArt />
            </div>
            <div className="pcard-body">
              <div className="pcard-kind">
                <span className="pip" />AI Tool · TOOL · 01
              </div>
              <h3 className="pcard-name">
                Purchasing <span className="it">Power</span>
              </h3>
              <p className="pcard-desc">
                An interactive CPI calculator that shows how inflation erodes purchasing
                power over time. Pulls live data from the Federal Reserve and Bureau of
                Labor Statistics.
              </p>
              <div className="pcard-foot">
                <span className="pcard-launch">Launch <span className="arr">→</span></span>
                <span className="pcard-status">Live · v1.0</span>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

function PowerArt() {
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <radialGradient id="pBgTools" cx="40%" cy="60%" r="65%">
          <stop offset="0" stopColor="oklch(0.22 0.06 25)" />
          <stop offset="1" stopColor="oklch(0.14 0.025 285)" />
        </radialGradient>
      </defs>
      <rect width="400" height="225" fill="url(#pBgTools)" />
      {[40, 80, 120, 160, 200].map((y) => (
        <line key={y} x1="30" y1={y} x2="370" y2={y}
          stroke="oklch(0.95 0.02 75)" strokeWidth="0.3" opacity="0.12" />
      ))}
      <path
        d="M 30 50 C 80 55, 130 75, 180 110 S 280 165, 370 185"
        stroke="var(--accent)" strokeWidth="1.5" fill="none" opacity="0.85" strokeDasharray="5 3"
      />
      <path
        d="M 30 50 C 90 52, 150 54, 210 56 S 310 60, 370 62"
        stroke="oklch(0.95 0.02 75)" strokeWidth="1.8" fill="none" opacity="0.8"
      />
      <path
        d="M 30 50 C 80 55, 130 75, 180 110 S 280 165, 370 185 L 370 225 L 30 225 Z"
        fill="var(--accent)" opacity="0.06"
      />
      <text x="14" y="18" fontFamily="Space Mono, monospace" fontSize="8"
        fill="oklch(0.78 0.018 75)" letterSpacing="1">CPI · INDEX</text>
      <text x="316" y="18" fontFamily="Space Mono, monospace" fontSize="8"
        fill="var(--accent)" letterSpacing="1">1913–2026</text>
    </svg>
  );
}
