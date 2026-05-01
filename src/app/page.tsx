import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-page">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="font-display text-2xl font-medium text-fg tracking-tight">Lei Yang</div>
        <div className="hidden md:flex space-x-8">
          <Link href="/portfolio" className="text-muted hover:text-fg transition-colors">
            Portfolio
          </Link>
          <Link href="/resume" className="text-muted hover:text-fg transition-colors">
            Resume
          </Link>
          <Link href="/tools" className="text-muted hover:text-fg transition-colors">
            Tools & AI
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-5xl md:text-7xl font-medium text-fg tracking-tight mb-6">
            Hi, I&apos;m <span className="text-accent">Lei Yang</span>
          </h1>
          <p className="text-xl md:text-2xl text-fg mb-6 leading-relaxed max-w-3xl mx-auto">
            For nearly 20 years, I&apos;ve animated the characters players
            fight, follow, protect, and remember.
          </p>
          <p className="text-lg text-muted mb-6 max-w-2xl mx-auto leading-relaxed">
            Across nine shipped <em className="mr-1">Call of Duty</em> titles, specializing in
            gameplay animation, NPC animation systems, and mocap direction. My
            work lives where animation, design, and engineering meet, turning
            performance, systems, and gameplay needs into characters that feel
            alive in the player&apos;s hands.
          </p>
          <p className="text-lg text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
            Now I&apos;m exploring how AI tools can push that work even
            further, faster prototyping, smarter workflows, and new ways to
            build believable interactive characters.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/portfolio"
              className="bg-accent hover:bg-accent-hover text-page hover:text-fg px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View My Work
            </Link>
            <Link
              href="/tools"
              className="border border-accent text-accent hover:bg-accent hover:text-page px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Try My Tools
            </Link>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <Link href="/portfolio" className="group">
            <div className="bg-surface border border-rule rounded-xl p-6 hover:border-accent transition-colors duration-300 h-full">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-fg mb-2">Animation Portfolio</h3>
              <p className="text-muted">Explore my animation demos and creative projects</p>
            </div>
          </Link>

          <Link href="/resume" className="group">
            <div className="bg-surface border border-rule rounded-xl p-6 hover:border-accent transition-colors duration-300 h-full">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-fg mb-2">Resume & CV</h3>
              <p className="text-muted">Professional experience and skills</p>
            </div>
          </Link>

          <Link href="/tools" className="group">
            <div className="bg-surface border border-rule rounded-xl p-6 hover:border-accent transition-colors duration-300 h-full">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-fg mb-2">AI Tools & Agents</h3>
              <p className="text-muted">Personal tools and AI-powered solutions</p>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-muted">
        <p>&copy; 2026 Lei Yang. Built with Next.js & deployed on Vercel.</p>
      </footer>
    </div>
  );
}
