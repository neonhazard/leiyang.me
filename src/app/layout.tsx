import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
