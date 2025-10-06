import Link from "next/link";

export default function Tools() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <Link href="/" className="text-2xl font-bold text-white">Lei Yang</Link>
        <div className="hidden md:flex space-x-8">
          <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors">
            Portfolio
          </Link>
          <Link href="/resume" className="text-gray-300 hover:text-white transition-colors">
            Resume
          </Link>
          <Link href="/tools" className="text-purple-400 hover:text-white transition-colors">
            Tools & AI
          </Link>
        </div>
      </nav>

      {/* Tools Header */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center">
            AI Tools & <span className="text-purple-400">Agents</span>
          </h1>
          <p className="text-xl text-gray-300 text-center mb-12">
            Personal tools and AI-powered solutions I've built
          </p>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Animation Assistant */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Animation Assistant</h3>
              <p className="text-gray-300 text-sm mb-4">
                AI-powered tool that helps with animation timing, easing, and creative suggestions
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded text-xs">AI</span>
                <span className="bg-blue-600/30 text-blue-300 px-2 py-1 rounded text-xs">Animation</span>
                <span className="bg-green-600/30 text-green-300 px-2 py-1 rounded text-xs">Next.js</span>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
                Try It Out
              </button>
            </div>

            {/* Portfolio Generator */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">Portfolio Generator</h3>
              <p className="text-gray-300 text-sm mb-4">
                Automatically generates portfolio descriptions and project summaries
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded text-xs">AI</span>
                <span className="bg-orange-600/30 text-orange-300 px-2 py-1 rounded text-xs">Content</span>
                <span className="bg-green-600/30 text-green-300 px-2 py-1 rounded text-xs">API</span>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
                Try It Out
              </button>
            </div>

            {/* Color Palette AI */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-white mb-2">Color Palette AI</h3>
              <p className="text-gray-300 text-sm mb-4">
                Generates harmonious color palettes based on mood, style, or reference images
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded text-xs">AI</span>
                <span className="bg-pink-600/30 text-pink-300 px-2 py-1 rounded text-xs">Design</span>
                <span className="bg-green-600/30 text-green-300 px-2 py-1 rounded text-xs">ML</span>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
                Try It Out
              </button>
            </div>

            {/* Animation Timeline Optimizer */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Timeline Optimizer</h3>
              <p className="text-gray-300 text-sm mb-4">
                AI tool that optimizes animation timelines and suggests improvements
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded text-xs">AI</span>
                <span className="bg-blue-600/30 text-blue-300 px-2 py-1 rounded text-xs">Optimization</span>
                <span className="bg-green-600/30 text-green-300 px-2 py-1 rounded text-xs">Python</span>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
                Try It Out
              </button>
            </div>

            {/* Resume Analyzer */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-white mb-2">Resume Analyzer</h3>
              <p className="text-gray-300 text-sm mb-4">
                AI-powered resume analysis and improvement suggestions
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded text-xs">AI</span>
                <span className="bg-yellow-600/30 text-yellow-300 px-2 py-1 rounded text-xs">Analysis</span>
                <span className="bg-green-600/30 text-green-300 px-2 py-1 rounded text-xs">NLP</span>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
                Try It Out
              </button>
            </div>

            {/* Coming Soon */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border-2 border-dashed border-gray-600">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">More Tools Coming</h3>
              <p className="text-gray-500 text-sm mb-4">
                I&apos;m constantly building new AI-powered tools and agents
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-600/30 text-gray-400 px-2 py-1 rounded text-xs">Coming Soon</span>
              </div>
              <button className="w-full bg-gray-600 text-gray-300 py-2 rounded-lg cursor-not-allowed">
                In Development
              </button>
            </div>
          </div>

          {/* API Section */}
          <section className="mt-16 bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">API & Integration</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Available APIs</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• Animation Analysis API</li>
                  <li>• Color Palette Generation</li>
                  <li>• Content Generation</li>
                  <li>• Resume Optimization</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Integration Options</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• REST API endpoints</li>
                  <li>• Webhook support</li>
                  <li>• SDK for popular languages</li>
                  <li>• Custom integrations</li>
                </ul>
              </div>
            </div>
            <div className="text-center mt-8">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                View API Documentation
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
