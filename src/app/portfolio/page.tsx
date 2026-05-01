import Link from "next/link";
import Image from "next/image";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <Link href="/" className="text-2xl font-bold text-white">Lei Yang</Link>
        <div className="hidden md:flex space-x-8">
          <Link href="/portfolio" className="text-purple-400 hover:text-white transition-colors">
            Portfolio
          </Link>
          <Link href="/resume" className="text-gray-300 hover:text-white transition-colors">
            Resume
          </Link>
          <Link href="/tools" className="text-gray-300 hover:text-white transition-colors">
            Tools & AI
          </Link>
        </div>
      </nav>

      {/* Portfolio Header */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center">
            <span className="text-purple-400">Portfolio</span>
          </h1>
          <p className="text-xl text-gray-300 text-center mb-12">
            A showcase of my animation work and creative projects
          </p>

          {/* Portfolio Grid: centers any number of cards (1, 2, 3+) and wraps cleanly */}
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              href="/portfolio/game-animation"
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 block hover:scale-105 cursor-pointer w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]"
            >
              <div className="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400">🎮 Game Animation</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Game Animation</h3>
              <p className="text-gray-300 text-sm">Demo reel and interactive character animations</p>
            </Link>

            <Link
              href="/portfolio/drawings"
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 block hover:scale-105 cursor-pointer w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]"
            >
              <div className="aspect-video bg-gray-700 rounded-lg mb-4 overflow-hidden relative">
                <Image
                  src="/images/portfolio/life_drawing_01.jpg"
                  alt="2D Art Preview"
                  fill
                  className="object-cover pointer-events-none"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                  <span className="text-white text-2xl">🎨</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">2D Art</h3>
              <p className="text-gray-300 text-sm">Life drawings, still life, and animal studies</p>
            </Link>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-gray-300 mb-6">Want to see more of my work?</p>
            <Link 
              href="/resume"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View My Resume
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

