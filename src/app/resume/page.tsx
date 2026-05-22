import type { Metadata } from "next";
import Link from "next/link";
import Masthead from "@/components/Masthead";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Lei Yang's resume — Lead Animator with nearly 20 years of AAA game development experience across nine shipped Call of Duty titles, specializing in gameplay animation, NPC systems, and mocap direction.",
  alternates: { canonical: "/resume" },
};

export default function Resume() {
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
            Curriculum Vitae
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
            Resume &amp; <span style={{ fontFamily: "var(--font-bodoni), serif", fontStyle: "italic", color: "var(--accent)" }}>Experience</span>
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

          {/* Contact header */}
          <section
            style={{
              border: "1px solid var(--rule)",
              padding: "32px 40px",
              textAlign: "center",
              marginBottom: -1,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-bricolage), sans-serif",
                fontWeight: 700,
                fontVariationSettings: '"opsz" 72',
                fontSize: 36,
                letterSpacing: "-0.03em",
                color: "var(--fg)",
                margin: "0 0 12px",
              }}
            >
              LEI YANG
            </h2>
            <div
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.06em",
                color: "var(--muted)",
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "0 16px",
              }}
            >
              <span>661-755-0727</span>
              <a href="mailto:lei@leiyang.me" style={{ color: "var(--accent)" }}>lei@leiyang.me</a>
              <a href="https://linkedin.com/in/lei-yang" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
                linkedin.com/in/lei-yang
              </a>
              <a href="https://www.leiyang.me" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
                leiyang.me
              </a>
            </div>
          </section>

          {/* Profile */}
          <section style={{ border: "1px solid var(--rule)", padding: "32px 40px", marginBottom: -1 }}>
            <h2
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--accent)",
                margin: "0 0 20px",
              }}
            >
              Profile
            </h2>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Lead Animator with 15+ years of AAA game development experience, including multiple shipped Call of Duty titles",
                "Proven expertise in AI animation systems, motion capture direction, and animation pipeline design",
                "Strong leader of distributed teams, mentoring animators across international studios to deliver high-quality results",
                "Blends realism with cinematic impact to create immersive, responsive, and memorable gameplay experiences",
                "Highly technical, with deep proficiency in Maya, MEL scripting, rigging, and game engines",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    fontFamily: "var(--font-bricolage), sans-serif",
                    fontWeight: 300,
                    fontSize: 15,
                    color: "var(--muted)",
                    paddingLeft: 18,
                    position: "relative",
                  }}
                >
                  <span style={{ position: "absolute", left: 0, color: "var(--accent)" }}>·</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Experience */}
          <section style={{ border: "1px solid var(--rule)", padding: "32px 40px", marginBottom: -1 }}>
            <h2
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--accent)",
                margin: "0 0 32px",
              }}
            >
              Experience
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

              <ExperienceBlock
                title="LEAD AI ANIMATOR"
                company="INFINITY WARD, WOODLAND HILLS, CALIFORNIA"
                period="2021 – 2025"
                projects={["CALL OF DUTY: MODERN WARFARE II", "CALL OF DUTY: MODERN WARFARE III"]}
                bullets={[
                  "Directed animation pipelines for gameplay NPC behaviors to meet AAA quality standards",
                  "Supervised and developed a team of 5 animators (3 in Los Angeles, 2 in Poland), elevating artistic quality and technical efficiency",
                  "Partnered with design and engineering teams to deliver realistic AI behaviors and immersive combat experiences",
                  "Redesigned AI combat loop and reaction systems, improving NPC responsiveness and overall player immersion",
                  "Oversaw motion capture shoots, capturing authentic military performances and streamlining asset integration",
                  "Owned animation systems for all soldier and civilian AI, ensuring consistency and gameplay readability",
                ]}
              />

              <ExperienceBlock
                title="CONTRACT LEAD ANIMATOR"
                company="ROGUE INITIATIVE STUDIO, LOS ANGELES, CALIFORNIA"
                period="2019 – 2021"
                projects={["UNANNOUNCED GAME PROJECT", "UNANNOUNCED MOVIE PROJECT"]}
                bullets={[
                  "Designed and maintained animation pipelines, including rigging, skinning, and tool development, to streamline production workflows",
                  "Led animation team remotely across multiple locations, providing mentorship, feedback, and direction",
                  "Created Previz shots based on director's vision",
                  "Created rigs, skinned mesh, and produced animations",
                ]}
              />

              <ExperienceBlock
                title="CO-FOUNDER"
                company="SUPERFINE GAMES INC, DELAWARE"
                period="2017 – 2019"
                projects={["TINY SHEEP AR"]}
                bullets={["Created animation pipeline and assets for Unity"]}
              />

              <ExperienceBlock
                title="VFX SUPERVISOR"
                company="LEBUSISHU FILMS CO,.LTD, CHINA"
                period="2016 – 2017"
                projects={["GUNS AND KIDNEYS"]}
                bullets={[
                  "Planned and executed VFX shots to the director's vision",
                  "Managed VFX team for onsite data collection and back plate shots",
                  "Supervised post production VFX shots",
                ]}
              />

              <ExperienceBlock
                title="SENIOR ANIMATOR"
                company="INFINITY WARD, WOODLAND HILLS, CALIFORNIA"
                period="2004 – 2015"
                projects={[
                  "CALL OF DUTY: INFINITE WARFARE",
                  "CALL OF DUTY: ADVANCED WARFARE",
                  "CALL OF DUTY: GHOSTS",
                  "CALL OF DUTY: MODERN WARFARE 3",
                  "CALL OF DUTY: MODERN WARFARE 2",
                  "CALL OF DUTY: MODERN WARFARE",
                  "CALL OF DUTY 2",
                ]}
                bullets={[
                  "Contributed AI, cinematic, and vehicle animations across five major Call of Duty titles",
                  "Vehicle rigging and skinning",
                  'Led development of dog "Riley" animation assets, a signature gameplay feature',
                  "Drove the design and creation of snowmobile animation assets",
                  'Owned creation and implementation of animation assets for the level "The Coup"',
                  'Spearheaded the "Pointe Du Hoc" massive beach invasion scene for the E3 showcase',
                ]}
              />
            </div>
          </section>

          {/* CTA */}
          <section style={{ border: "1px solid var(--rule)", padding: "32px 40px" }}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/#work" className="btn btn-primary">
                View My Work <span className="arr">→</span>
              </Link>
              <a
                href="/documents/Lei_Yang_resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                Download PDF <span className="arr">↗</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function ExperienceBlock({
  title,
  company,
  period,
  projects,
  bullets,
}: {
  title: string;
  company: string;
  period: string;
  projects: string[];
  bullets: string[];
}) {
  return (
    <div style={{ paddingLeft: 24, borderLeft: "2px solid var(--accent)" }}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start" style={{ marginBottom: 10 }}>
        <div>
          <h3
            style={{
              fontFamily: "var(--font-bricolage), sans-serif",
              fontWeight: 600,
              fontSize: 17,
              letterSpacing: "-0.01em",
              color: "var(--fg)",
              margin: "0 0 4px",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent)",
              margin: 0,
            }}
          >
            {company}
          </p>
        </div>
        <span
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.06em",
            color: "var(--muted-2)",
            whiteSpace: "nowrap",
            marginTop: 2,
          }}
        >
          {period}
        </span>
      </div>

      <div style={{ marginBottom: 10 }}>
        {projects.map((p) => (
          <div
            key={p}
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted-2)",
            }}
          >
            {p}
          </div>
        ))}
      </div>

      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
        {bullets.map((b) => (
          <li
            key={b}
            style={{
              fontFamily: "var(--font-bricolage), sans-serif",
              fontWeight: 300,
              fontSize: 13,
              color: "var(--muted)",
              paddingLeft: 14,
              position: "relative",
            }}
          >
            <span style={{ position: "absolute", left: 0, color: "var(--accent)" }}>·</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
