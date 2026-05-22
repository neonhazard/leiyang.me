import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2D Art & Drawings",
  description:
    "Life drawings, still life, and animal studies by Lei Yang — traditional 2D art alongside two decades of game animation work.",
  alternates: { canonical: "/portfolio/drawings" },
};

export default function DrawingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
