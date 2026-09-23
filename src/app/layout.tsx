import type { Metadata } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, Bodoni_Moda, Space_Mono } from "next/font/google";
import "./globals.css";
import {
  SITE_URL,
  SITE_NAME,
  PERSON_NAME,
  PERSON_JOB_TITLE,
  PERSON_EMAIL,
  PERSON_LOCALITY,
  PERSON_REGION,
  PERSON_SUMMARY,
  CURRENT_ROLE,
  PAST_EMPLOYERS,
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

const DEFAULT_TITLE = "Lei Yang — Principal Gameplay Animator · Call of Duty";
const SHORT_DESCRIPTION =
  "Principal Gameplay Animator at Tencent with nearly 20 years of AAA experience and nine shipped Call of Duty titles at Infinity Ward.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s — Lei Yang",
  },
  description:
    "Lei Yang is a Principal Gameplay Animator at Tencent with nearly 20 years of AAA experience — including nine shipped Call of Duty titles at Infinity Ward, from Call of Duty 2 to Modern Warfare III. Gameplay animation, NPC systems, mocap direction, and AI-assisted animation tooling.",
  keywords: [
    "Lei Yang",
    "Lei Yang animator",
    "Lei Yang Call of Duty",
    "Lei Yang Infinity Ward",
    "Lei Yang Tencent",
    "Call of Duty animator",
    "Call of Duty Lead Animator",
    "Principal Gameplay Animator",
    "Infinity Ward animator",
    "Tencent animator",
    "Gameplay Animator",
    "Lead Animator",
    "Game Animator",
    "NPC animation",
    "Motion Capture",
  ],
  authors: [{ name: PERSON_NAME, url: SITE_URL }],
  creator: PERSON_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: SHORT_DESCRIPTION,
    siteName: SITE_NAME,
    type: "profile",
    firstName: "Lei",
    lastName: "Yang",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SHORT_DESCRIPTION,
  },
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
};

const org = (o: { name: string; url: string }) => ({
  "@type": "Organization",
  name: o.name,
  sameAs: o.url,
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: PERSON_NAME,
      givenName: "Lei",
      familyName: "Yang",
      jobTitle: PERSON_JOB_TITLE,
      url: SITE_URL,
      email: `mailto:${PERSON_EMAIL}`,
      description: PERSON_SUMMARY,
      ...(SAME_AS.length > 0 ? { sameAs: SAME_AS } : {}),
      worksFor: org({ name: CURRENT_ROLE.org, url: CURRENT_ROLE.orgUrl }),
      // Former employers — schema.org's accepted way to express past orgs.
      alumniOf: PAST_EMPLOYERS.map(org),
      hasOccupation: {
        "@type": "Occupation",
        name: "Game Animator",
        occupationalCategory: "27-1014.00 Special Effects Artists and Animators",
        skills:
          "Gameplay animation, NPC animation systems, motion capture direction, rigging, animation pipelines, Maya, MotionBuilder",
      },
      homeLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: PERSON_LOCALITY,
          addressRegion: PERSON_REGION,
          addressCountry: "US",
        },
      },
      knowsAbout: [
        "Gameplay Animation",
        "Game Animation",
        "NPC Animation Systems",
        "Motion Capture Direction",
        "Character Rigging",
        "Animation Pipelines",
        "AI-Assisted Animation",
        "Call of Duty",
        "Autodesk Maya",
        "MotionBuilder",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      author: { "@id": `${SITE_URL}/#person` },
      publisher: { "@id": `${SITE_URL}/#person` },
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
