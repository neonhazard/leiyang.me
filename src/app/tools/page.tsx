import Link from "next/link";

export default function Tools() {
  return (
    <div className="theme-lab min-h-screen bg-page">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <Link href="/" className="font-display text-2xl font-medium text-fg tracking-tight">Lei Yang</Link>
        <div className="hidden md:flex space-x-8">
          <Link href="/portfolio" className="text-muted hover:text-fg transition-colors">
            Portfolio
          </Link>
          <Link href="/resume" className="text-muted hover:text-fg transition-colors">
            Resume
          </Link>
          <Link href="/tools" className="text-accent hover:text-fg transition-colors">
            Tools & AI
          </Link>
        </div>
      </nav>

      {/* Tools Header */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-mono text-4xl md:text-6xl font-medium text-fg tracking-tight mb-6 text-center">
            AI Tools & <span className="text-accent">Agents</span>
          </h1>
          <p className="text-xl text-muted text-center mb-12">
            Personal tools and AI-powered solutions I&apos;ve built
          </p>

          {/* Tools Grid: centers any number of cards (1, 2, 3+) and wraps cleanly */}
          <div className="flex flex-wrap justify-center gap-8">
            {/* Purchasing Power Calculator */}
            <Link
              href="/tools/purchasing-power"
              className="block w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]"
            >
              <div className="bg-surface border border-rule rounded-xl p-6 hover:border-accent transition-colors duration-300 h-full">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-fg mb-2">Purchasing Power Calculator</h3>
                <p className="text-muted text-sm mb-4">
                  Calculate how the value of money changes over time using official CPI data
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-elevated text-muted border border-rule px-2 py-1 rounded font-mono text-xs uppercase tracking-wider">Finance</span>
                  <span className="bg-elevated text-muted border border-rule px-2 py-1 rounded font-mono text-xs uppercase tracking-wider">CPI Data</span>
                  <span className="bg-elevated text-muted border border-rule px-2 py-1 rounded font-mono text-xs uppercase tracking-wider">API</span>
                </div>
                <button className="w-full bg-accent hover:bg-accent-hover text-page py-2 rounded-lg transition-colors font-semibold">
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
