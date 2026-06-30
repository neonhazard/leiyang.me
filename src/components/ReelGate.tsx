"use client";

import { useState } from "react";
import Link from "next/link";

type Video = { title: string; url: string };

export default function ReelGate() {
  const [password, setPassword] = useState("");
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/reel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data?.error ?? "Something went wrong.");
        return;
      }
      setVideos(data.videos as Video[]);
      setStatus("idle");
    } catch {
      setStatus("error");
      setError("Network error — please try again.");
    }
  }

  if (videos) {
    return (
      <div style={{ display: "grid", gap: 48 }}>
        {videos.length === 0 && (
          <p style={{ color: "var(--muted)", fontSize: 16, fontWeight: 300 }}>
            No videos are available yet.
          </p>
        )}
        {videos.map((v) => (
          <section key={v.title}>
            <h2
              style={{
                fontFamily: "var(--font-bricolage), sans-serif",
                fontWeight: 600,
                fontSize: 22,
                letterSpacing: "-0.02em",
                color: "var(--fg)",
                margin: "0 0 12px",
              }}
            >
              {v.title}
            </h2>
            <div
              style={{
                border: "1px solid var(--rule)",
                overflow: "hidden",
                background: "#000",
              }}
            >
              <video
                src={v.url}
                controls
                playsInline
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                style={{ width: "100%", display: "block", aspectRatio: "16 / 9" }}
              />
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 380 }}>
      <label
        htmlFor="reel-password"
        style={{
          display: "block",
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 10,
        }}
      >
        Enter password to view
      </label>
      <input
        id="reel-password"
        type="password"
        value={password}
        autoFocus
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={{
          width: "100%",
          padding: "12px 14px",
          fontSize: 15,
          color: "var(--fg)",
          background: "transparent",
          border: "1px solid var(--rule)",
          outline: "none",
          marginBottom: 14,
        }}
      />
      <button
        type="submit"
        className="btn-primary"
        disabled={status === "loading" || password.length === 0}
        style={{ opacity: status === "loading" || password.length === 0 ? 0.5 : 1 }}
      >
        {status === "loading" ? "Checking…" : "Unlock reel"}
      </button>
      {status === "error" && (
        <p style={{ color: "var(--accent)", fontSize: 13, marginTop: 12 }}>
          {error}
        </p>
      )}
      <p style={{ color: "var(--muted)", fontSize: 12, fontWeight: 300, marginTop: 20 }}>
        Need access?{" "}
        <Link href="/#contact" style={{ color: "var(--accent)" }}>
          Get in touch
        </Link>
        .
      </p>
    </form>
  );
}
