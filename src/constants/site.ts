// Central site configuration for SEO, structured data, and analytics.
// Fill in the placeholder values below, then redeploy.

export const SITE_URL = "https://leiyang.me";
export const SITE_NAME = "Lei Yang · Atelier";
export const PERSON_NAME = "Lei Yang";
export const PERSON_JOB_TITLE = "Principal Gameplay Animator";
export const PERSON_EMAIL = "lei@leiyang.me";
export const PERSON_LOCALITY = "Los Angeles";
export const PERSON_REGION = "California";

// One-sentence bio reused by meta descriptions, JSON-LD, and /llms.txt.
export const PERSON_SUMMARY =
  "Lei Yang is a Principal Gameplay Animator at Tencent with nearly 20 years of AAA experience, including nine shipped Call of Duty titles at Infinity Ward.";

// Current employer. `studio` is optional — add the Tencent studio name to show
// it on the resume and homepage.
export const CURRENT_ROLE = {
  org: "Tencent",
  orgUrl: "https://en.wikipedia.org/wiki/Tencent",
  studio: "",
  title: PERSON_JOB_TITLE,
  since: "2025",
};

export const PAST_EMPLOYERS = [
  { name: "Infinity Ward", url: "https://en.wikipedia.org/wiki/Infinity_Ward" },
  { name: "Activision", url: "https://en.wikipedia.org/wiki/Activision" },
];

// Shipped Call of Duty credits, oldest first. Wikipedia URLs anchor each game
// as a known entity in structured data.
export const SHIPPED_TITLES = [
  { name: "Call of Duty 2", year: 2005, wiki: "Call_of_Duty_2" },
  { name: "Call of Duty 4: Modern Warfare", year: 2007, wiki: "Call_of_Duty_4:_Modern_Warfare" },
  { name: "Call of Duty: Modern Warfare 2", year: 2009, wiki: "Call_of_Duty:_Modern_Warfare_2" },
  { name: "Call of Duty: Modern Warfare 3", year: 2011, wiki: "Call_of_Duty:_Modern_Warfare_3" },
  { name: "Call of Duty: Ghosts", year: 2013, wiki: "Call_of_Duty:_Ghosts" },
  { name: "Call of Duty: Advanced Warfare", year: 2014, wiki: "Call_of_Duty:_Advanced_Warfare" },
  { name: "Call of Duty: Infinite Warfare", year: 2016, wiki: "Call_of_Duty:_Infinite_Warfare" },
  { name: "Call of Duty: Modern Warfare II", year: 2022, wiki: "Call_of_Duty:_Modern_Warfare_II" },
  { name: "Call of Duty: Modern Warfare III", year: 2023, wiki: "Call_of_Duty:_Modern_Warfare_III" },
].map((t) => ({ ...t, url: `https://en.wikipedia.org/wiki/${t.wiki}` }));

// Public profiles linked via Person schema `sameAs` — the strongest signal for
// Google to recognize Lei Yang as a distinct entity. Replace REPLACE_ME with the
// real profile URLs; entries still containing REPLACE_ME are omitted automatically.
// Worth adding when they exist: IMDb (Call of Duty credits are listed there),
// ArtStation, and a Wikidata item.
export const PROFILE_URLS = {
  linkedin: "https://www.linkedin.com/in/lei-yang/",
  mobygames: "https://www.mobygames.com/person/205426/lei-yang/",
  imdb: "REPLACE_ME",
  artstation: "REPLACE_ME",
  wikidata: "REPLACE_ME",
};

// Google Analytics 4 Measurement ID, e.g. "G-XXXXXXXXXX". Leave blank to disable.
export const GA_MEASUREMENT_ID = "G-8ZZW9FEXBH";

// Google Search Console verification token (the content of the HTML-tag method).
// Leave blank to omit the verification meta tag.
export const GOOGLE_SITE_VERIFICATION = "HayHNCzFHCEOr38fduaV8JC8W2pumilTvRMNUhaJek4";

// Resolved list of valid sameAs URLs (placeholders filtered out).
export const SAME_AS = Object.values(PROFILE_URLS).filter(
  (url) => !url.includes("REPLACE_ME"),
);

// Per-page Open Graph + Twitter metadata. A page that sets its own `openGraph`
// replaces the root one wholesale, so the share image is re-attached here.
export function socialMetadata(title: string, description: string, path: string) {
  const fullTitle = `${title} — ${PERSON_NAME}`;
  const images = ["/opengraph-image"];
  return {
    openGraph: { title: fullTitle, description, url: path, images },
    twitter: { card: "summary_large_image" as const, title: fullTitle, description, images },
  };
}
