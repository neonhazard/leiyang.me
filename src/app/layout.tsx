import type { Metadata } from "next";
import { Geist, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lei Yang - Lead Animator & AI Developer",
  description: "Lead Animator with 15+ years of AAA game development experience, including multiple shipped Call of Duty titles. Expert in AI animation systems, motion capture, and animation pipeline design.",
  keywords: ["Lei Yang", "Lead Animator", "AI Animation", "Game Development", "Call of Duty", "Treyarch", "Motion Capture", "Animation Pipeline"],
  authors: [{ name: "Lei Yang" }],
  creator: "Lei Yang",
  openGraph: {
    title: "Lei Yang - Lead Animator & AI Developer",
    description: "Lead Animator with 15+ years of AAA game development experience, including multiple shipped Call of Duty titles.",
    url: "https://leiyang.me",
    siteName: "Lei Yang Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lei Yang - Lead Animator & AI Developer",
    description: "Lead Animator with 15+ years of AAA game development experience, including multiple shipped Call of Duty titles.",
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
        className={`${geistSans.variable} ${fraunces.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
