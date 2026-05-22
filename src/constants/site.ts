// Central site configuration for SEO, structured data, and analytics.
// Fill in the placeholder values below, then redeploy.

export const SITE_URL = "https://leiyang.me";
export const SITE_NAME = "Lei Yang · Atelier";
export const PERSON_NAME = "Lei Yang";
export const PERSON_JOB_TITLE = "Lead Animator";

// Public profiles linked via Person schema `sameAs` — the strongest signal for
// Google to recognize Lei Yang as a distinct entity. Replace REPLACE_ME with the
// real profile URLs; entries still containing REPLACE_ME are omitted automatically.
export const PROFILE_URLS = {
  linkedin: "https://www.linkedin.com/in/lei-yang/",
  mobygames: "https://www.mobygames.com/person/205426/lei-yang/",
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
