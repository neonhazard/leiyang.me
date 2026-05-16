"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
}

interface MastheadProps {
  /** Override nav links. Defaults to homepage anchor links. */
  navLinks?: NavLink[];
}

const DEFAULT_NAV: NavLink[] = [
  { label: "About",      href: "/#about" },
  { label: "My Work",    href: "/#work" },
  { label: "Playground", href: "/#playground" },
  { label: "Resume",     href: "/resume" },
  { label: "Contact",    href: "/#contact" },
];

export default function Masthead({ navLinks }: MastheadProps) {
  const [utc, setUtc] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = String(d.getUTCHours()).padStart(2, "0");
      const m = String(d.getUTCMinutes()).padStart(2, "0");
      setUtc(`${h}:${m} UTC`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const links = navLinks ?? DEFAULT_NAV;

  return (
    <div className="shell">
      <header className="masthead">
        <div className="mast-l">
          <span>VOL · 02</span>
          <span>№ 015</span>
          <span>2026</span>
        </div>
        <div className="mast-c">
          <Link href="/">Lei Yang</Link>
        </div>
        <div className="mast-r">
          <span>{utc}</span>
          <span><b>● </b>open to projects</span>
        </div>
      </header>
      <div className="submast">
        <span>Lead Animator</span>
        <nav>
          {links.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
