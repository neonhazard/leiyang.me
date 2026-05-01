import Link from "next/link";

export default function GameAnimation() {
  return (
    <div className="min-h-screen bg-page">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <Link href="/" className="font-display text-2xl font-medium text-fg tracking-tight">
          Lei Yang
        </Link>
        <div className="hidden md:flex space-x-8">
          <Link
            href="/portfolio"
            className="text-accent hover:text-fg transition-colors"
          >
            Portfolio
          </Link>
          <Link
            href="/resume"
            className="text-muted hover:text-fg transition-colors"
          >
            Resume
          </Link>
          <Link
            href="/tools"
            className="text-muted hover:text-fg transition-colors"
          >
            Tools & AI
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Link
              href="/portfolio"
              className="text-accent hover:text-fg transition-colors inline-flex items-center mb-4"
            >
              ← Back to Portfolio
            </Link>
            <h1 className="font-display text-4xl md:text-6xl font-medium text-fg tracking-tight mb-4">
              Game <span className="text-accent">Animation</span>
            </h1>
            <p className="text-xl text-muted">
              Demo reel and interactive character animations
            </p>
          </div>

          {/* Demo Reel (Vimeo embed) */}
          <section className="mb-12">
            <div className="bg-surface border border-rule rounded-xl overflow-hidden">
              <div className="aspect-video bg-black">
                <iframe
                  src="https://player.vimeo.com/video/1188283054?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479"
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Lei Yang Demo Reel"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-fg mb-2">
                  Demo Reel
                </h2>
                <p className="text-muted text-sm">
                  A selection of character animation work across shipped titles.
                  An updated reel is on the way.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center mt-12">
            <Link
              href="/portfolio"
              className="bg-accent hover:bg-accent-hover text-page hover:text-fg px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Back to Portfolio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
