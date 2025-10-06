import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-white">Lei Yang</div>
        <div className="hidden md:flex space-x-8">
          <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors">
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

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Hi, I&apos;m <span className="text-purple-400">Lei Yang</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Animator, Developer & AI Enthusiast
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Welcome to my personal space where creativity meets technology. 
            Explore my animation demos, professional experience, and innovative AI tools.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/portfolio"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View My Work
            </Link>
            <Link 
              href="/tools"
              className="border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Try My Tools
            </Link>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <Link href="/portfolio" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-white mb-2">Animation Portfolio</h3>
              <p className="text-gray-300">Explore my animation demos and creative projects</p>
            </div>
          </Link>
          
          <Link href="/resume" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-white mb-2">Resume & CV</h3>
              <p className="text-gray-300">Professional experience and skills</p>
            </div>
          </Link>
          
          <Link href="/tools" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Tools & Agents</h3>
              <p className="text-gray-300">Personal tools and AI-powered solutions</p>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400">
        <p>&copy; 2024 Lei Yang. Built with Next.js & deployed on Vercel.</p>
      </footer>
    </div>
  );
}
