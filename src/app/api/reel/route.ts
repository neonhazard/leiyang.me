import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, R2_BUCKET, reelVideos } from "@/lib/r2";

export const runtime = "nodejs";

// How long each signed video URL stays valid. Long enough to watch (incl. pausing
// and scrubbing), short enough that a copied link expires quickly. 1 hour.
const URL_TTL_SECONDS = 60 * 60;

function passwordMatches(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false; // length leak is acceptable here
  return timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const expected = process.env.REEL_PASSWORD;
  if (!expected || expected === "changeme") {
    return NextResponse.json(
      { error: "Reel is not configured yet." },
      { status: 500 },
    );
  }

  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  if (!passwordMatches(password, expected)) {
    return NextResponse.json(
      { error: "Incorrect password." },
      { status: 401 },
    );
  }

  const videos = await Promise.all(
    reelVideos().map(async (v) => ({
      title: v.title,
      url: await getSignedUrl(
        r2,
        new GetObjectCommand({ Bucket: R2_BUCKET, Key: v.key }),
        { expiresIn: URL_TTL_SECONDS },
      ),
    })),
  );

  return NextResponse.json({ videos });
}
