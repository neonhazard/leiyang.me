import type { Metadata } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, Bodoni_Moda, Space_Mono } from "next/font/google";
import "./globals.css";
import {
  SITE_URL,
  SITE_NAME,
  PERSON_NAME,
  PERSON_JOB_TITLE,
  SAME_AS,
  GA_MEASUREMENT_ID,
  GOOGLE_SITE_VERIFICATION,
} from "@/constants/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lei Yang — Call of Duty Animator",
    template: "%s — Lei Yang",
  },
  description:
    "Lei Yang is a Call of Duty animator and Lead Animator with nearly 20 years of AAA game development experience across nine shipped Call of Duty titles — specializing in gameplay animation, NPC systems, mocap direction, and AI-assisted animation tooling.",
  keywords: [
    "Lei Yang",
    "Lei Yang animator",
    "Lei Yang Call of Duty",
    "Call of Duty animator",
    "Call of Duty Lead Animator",
    "Lead Animator",
    "Game Animator",
    "AI Animation",
    "Game Development",
    "Call of Duty",
    "Treyarch",
    "Motion Capture",
    "Animation Pipeline",
  ],
  authors: [{ name: "Lei Yang", url: SITE_URL }],
  creator: "Lei Yang",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lei Yang — Call of Duty Animator",
    description:
      "Call of Duty animator and Lead Animator with nearly 20 years of AAA game development experience across nine shipped Call of Duty titles.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lei Yang — Call of Duty Animator",
    description:
      "Call of Duty animator and Lead Animator with nearly 20 years of AAA game development experience across nine shipped Call of Duty titles.",
  },
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: PERSON_NAME,
      jobTitle: PERSON_JOB_TITLE,
      url: SITE_URL,
      ...(SAME_AS.length > 0 ? { sameAs: SAME_AS } : {}),
      knowsAbout: [
        "Gameplay Animation",
        "NPC Animation Systems",
        "Motion Capture Direction",
        "Game Development",
        "Call of Duty",
        "AI-Assisted Animation",
      ],
      description:
        "Call of Duty animator and Lead Animator with nearly 20 years of AAA game development experience across nine shipped Call of Duty titles.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      author: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        {GA_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
