import type { Metadata } from "next";
import { Bricolage_Grotesque, Bodoni_Moda, Space_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lei Yang — Lead Animator",
  description:
    "Lead Animator with nearly 20 years of AAA game development experience. Nine shipped Call of Duty titles. Specialist in gameplay animation, NPC systems, mocap direction, and AI-assisted animation tooling.",
  keywords: [
    "Lei Yang",
    "Lead Animator",
    "AI Animation",
    "Game Development",
    "Call of Duty",
    "Treyarch",
    "Motion Capture",
    "Animation Pipeline",
  ],
  authors: [{ name: "Lei Yang" }],
  creator: "Lei Yang",
  openGraph: {
    title: "Lei Yang — Lead Animator",
    description:
      "Lead Animator with nearly 20 years of AAA game development experience, including nine shipped Call of Duty titles.",
    url: "https://leiyang.me",
    siteName: "Lei Yang · Atelier",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lei Yang — Lead Animator",
    description:
      "Lead Animator with nearly 20 years of AAA game development experience, including nine shipped Call of Duty titles.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${bodoni.variable} ${spaceMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
