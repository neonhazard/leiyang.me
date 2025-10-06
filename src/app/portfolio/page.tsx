import Link from "next/link";

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
            Animation <span className="text-purple-400">Portfolio</span>
          </h1>
          <p className="text-xl text-gray-300 text-center mb-12">
            A showcase of my animation work and creative projects
          </p>

          {/* Portfolio Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder for animation demos */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400">🎬 Demo Reel 1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Character Animation</h3>
              <p className="text-gray-300 text-sm">3D character animation showcase</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400">🎨 Motion Graphics</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Motion Graphics</h3>
              <p className="text-gray-300 text-sm">2D motion graphics and visual effects</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400">🎭 Storytelling</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Narrative Animation</h3>
              <p className="text-gray-300 text-sm">Short films and storytelling projects</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400">🎮 Game Animation</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Game Animation</h3>
              <p className="text-gray-300 text-sm">Interactive character animations</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400">🎪 Experimental</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Experimental Work</h3>
              <p className="text-gray-300 text-sm">Creative and experimental animations</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400">📱 UI Animation</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">UI/UX Animation</h3>
              <p className="text-gray-300 text-sm">Interface and user experience animations</p>
            </div>
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
