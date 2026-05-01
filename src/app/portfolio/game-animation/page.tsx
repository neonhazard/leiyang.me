import Link from "next/link";

export default function GameAnimation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <Link href="/" className="text-2xl font-bold text-white">
          Lei Yang
        </Link>
        <div className="hidden md:flex space-x-8">
          <Link
            href="/portfolio"
            className="text-purple-400 hover:text-white transition-colors"
          >
            Portfolio
          </Link>
          <Link
            href="/resume"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Resume
          </Link>
          <Link
            href="/tools"
            className="text-gray-300 hover:text-white transition-colors"
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
              className="text-purple-400 hover:text-white transition-colors inline-flex items-center mb-4"
            >
              ← Back to Portfolio
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Game <span className="text-purple-400">Animation</span>
            </h1>
            <p className="text-xl text-gray-300">
              Demo reel and interactive character animations
            </p>
          </div>

          {/* Demo Reel (Vimeo embed) */}
          <section className="mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
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
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Demo Reel
                </h2>
                <p className="text-gray-300 text-sm">
                  A selection of character animation work across shipped titles.
                  An updated reel is on the way.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center mt-12">
            <Link
              href="/portfolio"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Back to Portfolio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
