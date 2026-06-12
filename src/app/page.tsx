"use client";

import { useEffect, useRef } from "react";
import Masthead from "@/components/Masthead";

/* ── data ───────────────────────────────────────────────── */

const CREDITS = [
  { k: "Director",    v: "Lei Yang",       s: "Lead Animator" },
  { k: "Studio",      v: "Infinity Ward",  s: "Activision" },
  { k: "Filmography", v: "9 titles",       s: "Call of Duty franchise" },
  { k: "Locale",      v: "Los Angeles",    s: "California · USA" },
];


/* ── ambient aura drift ─────────────────────────────────── */

function AmbientBackground() {
  const a1Ref = useRef<HTMLDivElement>(null);
  const a2Ref = useRef<HTMLDivElement>(null);
  const a3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;
    const start = performance.now();

    function tick(now: number) {
      const t = (now - start) / 1000;

      if (a1Ref.current) {
        const x = Math.sin(t / 25) * 40;
        const y = Math.cos(t / 30) * 30;
        a1Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (a2Ref.current) {
        const x = Math.cos(t / 35) * 50;
        const y = Math.sin(t / 40) * 40;
        a2Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (a3Ref.current) {
        const x = Math.sin(t / 20 + 1) * 60;
        const y = Math.cos(t / 28 + 2) * 50;
        a3Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }

      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <div className="dots" />
      <div className="aura a1" ref={a1Ref} />
      <div className="aura a2" ref={a2Ref} />
      <div className="aura a3" ref={a3Ref} />
      <div className="grain" />
    </>
  );
}

/* ── scroll reveal ──────────────────────────────────────── */

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".rev");
    els.forEach((el) => el.classList.add("pre"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    requestAnimationFrame(() =>
      requestAnimationFrame(() => els.forEach((el) => observer.observe(el)))
    );

    return () => observer.disconnect();
  }, []);
}

/* ── purchasing power cover art ─────────────────────────── */

function PowerArt() {
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <radialGradient id="pBg" cx="40%" cy="60%" r="65%">
          <stop offset="0" stopColor="oklch(0.22 0.06 25)" />
          <stop offset="1" stopColor="oklch(0.14 0.025 285)" />
        </radialGradient>
      </defs>
      <rect width="400" height="225" fill="url(#pBg)" />

      {[40, 80, 120, 160, 200].map((y) => (
        <line key={y} x1="30" y1={y} x2="370" y2={y}
          stroke="oklch(0.95 0.02 75)" strokeWidth="0.3" opacity="0.12" />
      ))}

      <path
        d="M 30 50 C 80 55, 130 75, 180 110 S 280 165, 370 185"
        stroke="var(--accent)" strokeWidth="1.5" fill="none" opacity="0.85"
        strokeDasharray="5 3"
      />
      <path
        d="M 30 50 C 90 52, 150 54, 210 56 S 310 60, 370 62"
        stroke="oklch(0.95 0.02 75)" strokeWidth="1.8" fill="none" opacity="0.8"
      />
      <path
        d="M 30 50 C 80 55, 130 75, 180 110 S 280 165, 370 185 L 370 225 L 30 225 Z"
        fill="var(--accent)" opacity="0.06"
      />

      {[1980, 1990, 2000, 2010, 2020].map((yr, i) => {
        const x = 30 + i * 85;
        return (
          <g key={yr}>
            <line x1={x} y1="195" x2={x} y2="205"
              stroke="oklch(0.78 0.018 75)" strokeWidth="0.5" opacity="0.4" />
            <text x={x} y="215" textAnchor="middle"
              fontFamily="Space Mono, monospace" fontSize="8"
              fill="oklch(0.55 0.02 75)" letterSpacing="0.5">{yr}</text>
          </g>
        );
      })}

      <text x="14" y="18" fontFamily="Space Mono, monospace" fontSize="8"
        fill="oklch(0.78 0.018 75)" letterSpacing="1">CPI · INDEX</text>
      <text x="316" y="18" fontFamily="Space Mono, monospace" fontSize="8"
        fill="var(--accent)" letterSpacing="1">1913–2026</text>
      <text x="14" y="210" fontFamily="Space Mono, monospace" fontSize="8"
        fill="oklch(0.55 0.02 75)" letterSpacing="0.5">NOMINAL</text>
      <text x="280" y="68" fontFamily="Space Mono, monospace" fontSize="8"
        fill="oklch(0.78 0.018 75)" letterSpacing="0.5">REAL ✓</text>
    </svg>
  );
}

function MapArt() {
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <radialGradient id="mBg" cx="50%" cy="50%" r="65%">
          <stop offset="0" stopColor="oklch(0.20 0.04 290)" />
          <stop offset="1" stopColor="oklch(0.13 0.025 285)" />
        </radialGradient>
      </defs>
      <rect width="400" height="225" fill="url(#mBg)" />
      {[55, 90, 125, 160].map((y) => (
        <line key={`lat-${y}`} x1="40" y1={y} x2="360" y2={y}
          stroke="oklch(0.95 0.02 75)" strokeWidth="0.3" opacity="0.12" />
      ))}
      {[80, 120, 160, 200, 240, 280, 320].map((x) => (
        <path key={`lng-${x}`}
          d={`M ${x} 40 Q ${200 + (x - 200) * 0.7} 112 ${x} 185`}
          stroke="oklch(0.95 0.02 75)" strokeWidth="0.3" opacity="0.10" fill="none" />
      ))}
      <ellipse cx="200" cy="112" rx="160" ry="72"
        stroke="oklch(0.95 0.02 75)" strokeWidth="0.5" opacity="0.25" fill="none" />
      {[
        [110, 80], [150, 95], [190, 75], [225, 90], [260, 100],
        [165, 130], [220, 140], [285, 125], [305, 145], [125, 145],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.5"
          fill="var(--accent)" opacity="0.9" />
      ))}
      <text x="14" y="18" fontFamily="Space Mono, monospace" fontSize="8"
        fill="oklch(0.78 0.018 75)" letterSpacing="1">ATLAS · 1:50M</text>
      <text x="328" y="18" fontFamily="Space Mono, monospace" fontSize="8"
        fill="var(--accent)" letterSpacing="1">N · 250</text>
    </svg>
  );
}

function HailstoneArt() {
  // Stylized steampunk shooter scene — gear silhouettes, projectile trails.
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <radialGradient id="hBg" cx="30%" cy="40%" r="75%">
          <stop offset="0" stopColor="oklch(0.21 0.05 60)" />
          <stop offset="1" stopColor="oklch(0.13 0.025 285)" />
        </radialGradient>
      </defs>
      <rect width="400" height="225" fill="url(#hBg)" />
      {[
        [330, 60, 38],
        [368, 110, 22],
        [60, 180, 28],
      ].map(([cx, cy, r], i) => (
        <g key={i} opacity="0.18">
          <circle cx={cx} cy={cy} r={r} stroke="oklch(0.95 0.02 75)" strokeWidth="1" fill="none" />
          <circle cx={cx} cy={cy} r={r * 0.45} stroke="oklch(0.95 0.02 75)" strokeWidth="0.8" fill="none" />
          {Array.from({ length: 8 }).map((_, t) => {
            const a = (t * Math.PI) / 4;
            return (
              <line
                key={t}
                x1={cx + Math.cos(a) * r}
                y1={cy + Math.sin(a) * r}
                x2={cx + Math.cos(a) * (r + 6)}
                y2={cy + Math.sin(a) * (r + 6)}
                stroke="oklch(0.95 0.02 75)"
                strokeWidth="2"
              />
            );
          })}
        </g>
      ))}
      {/* Player ship — nose up, climbing from the bottom */}
      <path d="M 170 150 L 158 180 L 182 180 Z" fill="var(--accent)" opacity="0.9" />
      {/* Engine exhaust */}
      <line x1="170" y1="186" x2="170" y2="208"
        stroke="var(--accent)" strokeWidth="1.5" opacity="0.3" strokeDasharray="4 4" />
      {/* Projectile trails firing upward */}
      {[
        [160, 138, 96],
        [170, 132, 64],
        [180, 138, 104],
      ].map(([x, y1, y2], i) => (
        <line key={i} x1={x} y1={y1} x2={x} y2={y2}
          stroke="var(--accent)" strokeWidth="1.5" opacity={i === 1 ? 0.75 : 0.5} strokeDasharray="10 7" />
      ))}
      {/* Hail falling from above */}
      {[
        [110, 48], [148, 84], [212, 40], [256, 70], [300, 100],
      ].map(([cx, cy], i) => (
        <g key={i} opacity="0.5">
          <circle cx={cx} cy={cy} r={3 + (i % 3)}
            stroke="oklch(0.95 0.02 75)" strokeWidth="1" fill="none" />
          <line x1={cx} y1={cy - 16} x2={cx} y2={cy - 8}
            stroke="oklch(0.95 0.02 75)" strokeWidth="1" opacity="0.6" />
        </g>
      ))}
      <text x="14" y="18" fontFamily="Space Mono, monospace" fontSize="8"
        fill="oklch(0.78 0.018 75)" letterSpacing="1">HAILSTONE · PHASER 3</text>
      <text x="340" y="18" fontFamily="Space Mono, monospace" fontSize="8"
        fill="var(--accent)" letterSpacing="1">1P · WEB</text>
    </svg>
  );
}

/* ── work card art ──────────────────────────────────────── */

function ReelArt() {
  return (
    <svg viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <radialGradient id="rBg" cx="60%" cy="40%" r="70%">
          <stop offset="0" stopColor="oklch(0.22 0.06 285)" />
          <stop offset="1" stopColor="oklch(0.14 0.025 285)" />
        </radialGradient>
      </defs>
      <rect width="400" height="225" fill="url(#rBg)" />
      {[0, 50, 100, 150, 200, 250, 300, 350].map((x) => (
        <g key={x}>
          <rect x={x + 8} y="6" width="18" height="14" rx="2"
            fill="none" stroke="oklch(0.30 0.03 285)" strokeWidth="1" />
          <rect x={x + 8} y="205" width="18" height="14" rx="2"
            fill="none" stroke="oklch(0.30 0.03 285)" strokeWidth="1" />
        </g>
      ))}
      <rect x="0" y="26" width="400" height="173" fill="oklch(0.17 0.04 285)" />
      <line x1="0" y1="26" x2="400" y2="26" stroke="oklch(0.30 0.03 285)" strokeWidth="0.5" />
      <line x1="0" y1="199" x2="400" y2="199" stroke="oklch(0.30 0.03 285)" strokeWidth="0.5" />
      <text x="200" y="108" textAnchor="middle"
        fontFamily="Space Mono, monospace" fontSize="9"
        fill="oklch(0.55 0.02 75)" letterSpacing="3">GAME ANIMATION</text>
      <text x="200" y="126" textAnchor="middle"
        fontFamily="Space Mono, monospace" fontSize="9"
        fill="var(--accent)" letterSpacing="2">CALL OF DUTY · 9 TITLES</text>
    </svg>
  );
}

function DrawingsArt() {
  return (
    <svg viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <radialGradient id="dBg" cx="40%" cy="55%" r="70%">
          <stop offset="0" stopColor="oklch(0.20 0.04 285)" />
          <stop offset="1" stopColor="oklch(0.13 0.025 285)" />
        </radialGradient>
      </defs>
      <rect width="400" height="225" fill="url(#dBg)" />
      <line x1="40" y1="180" x2="120" y2="60" stroke="oklch(0.78 0.018 75)" strokeWidth="0.8" opacity="0.3" />
      <line x1="60" y1="180" x2="160" y2="50" stroke="oklch(0.78 0.018 75)" strokeWidth="0.8" opacity="0.2" />
      <path d="M 100 160 Q 160 80, 220 120 T 340 90"
        stroke="oklch(0.78 0.018 75)" strokeWidth="1.2" fill="none" opacity="0.4" />
      <path d="M 80 140 Q 140 100, 200 130 T 320 100"
        stroke="var(--accent)" strokeWidth="1" fill="none" opacity="0.5" strokeDasharray="4 3" />
      <circle cx="200" cy="112" r="28" fill="none"
        stroke="oklch(0.78 0.018 75)" strokeWidth="0.6" opacity="0.25" />
      <text x="200" y="108" textAnchor="middle"
        fontFamily="Space Mono, monospace" fontSize="9"
        fill="oklch(0.55 0.02 75)" letterSpacing="3">2D ART</text>
      <text x="200" y="126" textAnchor="middle"
        fontFamily="Space Mono, monospace" fontSize="9"
        fill="var(--accent)" letterSpacing="2">DRAWINGS · SKETCHES</text>
    </svg>
  );
}

/* ── page ───────────────────────────────────────────────── */

export default function Home() {
  useScrollReveal();

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <AmbientBackground />

      <Masthead
        navLinks={[
          { label: "About",      href: "#about" },
          { label: "My Work",    href: "#work" },
          { label: "Playground", href: "#playground" },
          { label: "Resume",     href: "/resume" },
          { label: "Contact",    href: "#contact" },
        ]}
      />

      {/* § 01 Hero */}
      <section className="hero shell rev" id="hero">
        <div className="issue">
          <span className="bar" />
          VOL · 02 / 2026 · QUARTERLY
          <span className="bar" />
        </div>

        <h1 className="hero-h">
          For nearly 20 years,<br />
          <span className="it">I&apos;ve animated the characters</span><br />
          <span className="quiet">players fight, follow, protect, and remember.</span>
        </h1>

        <p className="hero-byline">
          By <strong>Lei Yang</strong> · Call of Duty Lead Animator
        </p>

        <p className="hero-lede">
          Across nine shipped <em>Call of Duty</em> titles, specializing in
          gameplay animation, NPC animation systems, and mocap direction.
        </p>

        <div className="ctas">
          <a className="btn btn-primary" href="#work">
            View the reel <span className="arr">→</span>
          </a>
          <a className="btn" href="#playground">
            Enter playground <span className="arr">→</span>
          </a>
        </div>

        <div className="credits">
          {CREDITS.map((c) => (
            <div className="credit" key={c.k}>
              <div className="credit-k">{c.k}</div>
              <div className="credit-v">
                {c.v}
                <small>{c.s}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* § 02 About */}
      <section className="s rev" id="about">
        <div className="shell">
          <div className="s-marg">
            <div className="s-num">§ 02</div>
            <div className="s-titlewrap">
              <div className="s-kicker">A dossier</div>
              <h2 className="s-title">The <span className="it">animator</span></h2>
            </div>
          </div>

          <div className="about-body">
            <div className="about-spacer" />
            <div className="about-prose">
              <p>
                <span className="drop">M</span>y work lives where animation,
                design, and engineering meet — turning performance, systems, and
                gameplay needs into characters that feel alive in the
                player&apos;s hands.
              </p>
              <p>
                Now I&apos;m exploring how <em>AI tools</em> can push that work
                even further: faster prototyping, smarter workflows, and new
                ways to build believable interactive characters.
              </p>
            </div>
            <div className="about-meta">
              <div className="meta-block">
                <div className="meta-k">Most Recently</div>
                <div className="meta-v">
                  Lead AI Animator
                  <small>Infinity Ward · MW II &amp; MW III</small>
                </div>
              </div>
              <div className="meta-block">
                <div className="meta-k">Specialties</div>
                <div className="pills">
                  {["Gameplay anim", "NPC systems", "Mocap direction", "Pipeline", "AI / ML R&D"].map((s) => (
                    <span className="pill" key={s}>{s}</span>
                  ))}
                </div>
              </div>
              <div className="meta-block">
                <div className="meta-k">Stack</div>
                <div className="pills">
                  {["Maya", "MEL scripting", "MotionBuilder", "Game engines"].map((s) => (
                    <span className="pill" key={s}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* § 03 My Work */}
      <section className="s rev" id="work">
        <div className="shell">
          <div className="s-marg">
            <div className="s-num">§ 03</div>
            <div className="s-titlewrap">
              <div className="s-kicker">Portfolio · selected work</div>
              <h2 className="s-title">My <span className="it">Work</span></h2>
            </div>
          </div>

          <div className="play-grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <a className="pcard" href="/portfolio/game-animation">
              <div className="pcard-art">
                <ReelArt />
              </div>
              <div className="pcard-body">
                <div className="pcard-kind">
                  <span className="pip" />ANIMATION · REEL · 01
                </div>
                <h3 className="pcard-name">
                  Game <span className="it">Animation</span>
                </h3>
                <p className="pcard-desc">
                  Nine shipped Call of Duty titles. Gameplay animation, NPC
                  systems, mocap direction, and AI-assisted pipeline work.
                </p>
                <div className="pcard-foot">
                  <span className="pcard-launch">View reel <span className="arr">→</span></span>
                </div>
              </div>
            </a>

            <a className="pcard" href="/portfolio/drawings">
              <div className="pcard-art">
                <DrawingsArt />
              </div>
              <div className="pcard-body">
                <div className="pcard-kind">
                  <span className="pip" />ART · DRAWINGS · 02
                </div>
                <h3 className="pcard-name">
                  2D <span className="it">Art</span>
                </h3>
                <p className="pcard-desc">
                  Personal drawings and sketches — characters, studies, and
                  explorations outside the game pipeline.
                </p>
                <div className="pcard-foot">
                  <span className="pcard-launch">View gallery <span className="arr">→</span></span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* § 04 Playground */}
      <section className="s rev" id="playground">
        <div className="shell">
          <div className="s-marg">
            <div className="s-num">§ 04</div>
            <div className="s-titlewrap">
              <div className="s-kicker">Side projects · tools · experiments</div>
              <h2 className="s-title">The <span className="it">playground</span></h2>
            </div>
          </div>

          <div className="play-grid">
            <a className="pcard" href="/tools/purchasing-power">
              <div className="pcard-art" style={{ maxHeight: "160px" }}>
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
                  An interactive CPI calculator that shows how inflation erodes
                  purchasing power over time. Pulls live data from the Federal
                  Reserve and Bureau of Labor Statistics.
                </p>
                <div className="pcard-foot">
                  <span className="pcard-launch">
                    Launch <span className="arr">→</span>
                  </span>
                  <span className="pcard-status">Live · v1.0</span>
                </div>
              </div>
            </a>

            <a className="pcard" href="/tools/countries-visited">
              <div className="pcard-art" style={{ maxHeight: "160px" }}>
                <MapArt />
              </div>
              <div className="pcard-body">
                <div className="pcard-kind">
                  <span className="pip" />Interactive · TOOL · 02
                </div>
                <h3 className="pcard-name">
                  Countries <span className="it">Visited</span>
                </h3>
                <p className="pcard-desc">
                  Click a country to mark it visited. Tracks your share of the
                  world by count or by land area, with continent breakdowns and a
                  UN-states filter. Saves locally — no account needed.
                </p>
                <div className="pcard-foot">
                  <span className="pcard-launch">
                    Launch <span className="arr">→</span>
                  </span>
                  <span className="pcard-status">Live · v1.0</span>
                </div>
              </div>
            </a>

            <a className="pcard" href="/games/hailstone">
              <div className="pcard-art" style={{ maxHeight: "160px" }}>
                <HailstoneArt />
              </div>
              <div className="pcard-body">
                <div className="pcard-kind">
                  <span className="pip" />Web Game · GAME · 03
                </div>
                <h3 className="pcard-name">
                  Hail<span className="it">stone</span>
                </h3>
                <p className="pcard-desc">
                  A steampunk vertical shooter built with Phaser 3. Dodge,
                  shoot, and survive the boss — right in your browser, no
                  download needed.
                </p>
                <div className="pcard-foot">
                  <span className="pcard-launch">
                    Play <span className="arr">→</span>
                  </span>
                  <span className="pcard-status">Live · v1.0</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="foot rev" id="contact">
        <div className="shell">
          <div className="foot-grid">
            <div>
              <div className="foot-call">
                Got a character<br />
                that needs to <em>feel alive?</em>
              </div>
              <a className="foot-mail" href="mailto:lei@leiyang.me">
                lei@leiyang.me →
              </a>
            </div>
            <div>
              <div className="foot-list-k">Channels</div>
              <ul className="foot-list">
                <li><a href="https://linkedin.com/in/lei-yang" target="_blank" rel="noopener noreferrer">LinkedIn <span className="arr">↗</span></a></li>
                <li><a href="https://vimeo.com/1188283054" target="_blank" rel="noopener noreferrer">Vimeo Reel <span className="arr">↗</span></a></li>
              </ul>
            </div>
            <div>
              <div className="foot-list-k">Pages</div>
              <ul className="foot-list">
                <li><a href="#work">Selected reel <span className="arr">→</span></a></li>
                <li><a href="#playground">Playground <span className="arr">→</span></a></li>
                <li><a href="/portfolio/drawings">2D Art <span className="arr">↗</span></a></li>
                <li><a href="#about">About <span className="arr">→</span></a></li>
                <li><a href="/resume">Resume / CV <span className="arr">↗</span></a></li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 Lei Yang</span>
            <span>Los Angeles</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
