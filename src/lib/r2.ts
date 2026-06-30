import { S3Client } from "@aws-sdk/client-s3";

// Cloudflare R2 is S3-compatible. Credentials and account id come from .env.local
// (and Vercel project env vars in production). This client is server-only — never
// import it into a client component.
export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

export const R2_BUCKET = process.env.R2_BUCKET ?? "";

// The configured reel videos. A slot is ignored if its key is unset or still a
// placeholder, so you can launch with one video and add the second later.
export function reelVideos() {
  return [
    { key: process.env.R2_REEL_KEY_1, title: process.env.R2_REEL_TITLE_1 },
    { key: process.env.R2_REEL_KEY_2, title: process.env.R2_REEL_TITLE_2 },
  ].filter(
    (v): v is { key: string; title: string } =>
      !!v.key && !v.key.startsWith("PASTE_"),
  );
}
