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
            Personal tools and AI-powered solutions I&apos;ve built
          </p>

          {/* Tools Grid: centers any number of cards (1, 2, 3+) and wraps cleanly */}
          <div className="flex flex-wrap justify-center gap-8">
            {/* Purchasing Power Calculator */}
            <Link
              href="/tools/purchasing-power"
              className="block w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-white mb-2">Purchasing Power Calculator</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Calculate how the value of money changes over time using official CPI data
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded text-xs">Finance</span>
                  <span className="bg-blue-600/30 text-blue-300 px-2 py-1 rounded text-xs">CPI Data</span>
                  <span className="bg-green-600/30 text-green-300 px-2 py-1 rounded text-xs">API</span>
                </div>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
                  Try It Out
                </button>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
