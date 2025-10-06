import Link from "next/link";

export default function Resume() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <Link href="/" className="text-2xl font-bold text-white">Lei Yang</Link>
        <div className="hidden md:flex space-x-8">
          <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors">
            Portfolio
          </Link>
          <Link href="/resume" className="text-purple-400 hover:text-white transition-colors">
            Resume
          </Link>
          <Link href="/tools" className="text-gray-300 hover:text-white transition-colors">
            Tools & AI
          </Link>
        </div>
      </nav>

      {/* Resume Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center">
            Resume & <span className="text-purple-400">Experience</span>
          </h1>
          
          {/* Resume Sections */}
          <div className="space-y-12">
            {/* About Section */}
            <section className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
              <p className="text-gray-300 leading-relaxed">
                Passionate animator and developer with expertise in 3D animation, motion graphics, 
                and emerging AI technologies. I combine creative storytelling with technical innovation 
                to create engaging visual experiences and intelligent tools.
              </p>
            </section>

            {/* Skills Section */}
            <section className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Skills & Expertise</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">Animation & Design</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• 3D Character Animation</li>
                    <li>• Motion Graphics</li>
                    <li>• Visual Effects</li>
                    <li>• Storyboarding</li>
                    <li>• UI/UX Design</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">Development & AI</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Web Development (Next.js, React)</li>
                    <li>• AI/ML Integration</li>
                    <li>• API Development</li>
                    <li>• Automation Tools</li>
                    <li>• Cloud Deployment</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Experience Section */}
            <section className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Professional Experience</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-purple-400 pl-6">
                  <h3 className="text-xl font-semibold text-white">Senior Animator</h3>
                  <p className="text-purple-400">Company Name • 2022 - Present</p>
                  <p className="text-gray-300 mt-2">
                    Lead character animation projects, mentor junior animators, and develop 
                    innovative animation pipelines using cutting-edge tools and AI assistance.
                  </p>
                </div>
                <div className="border-l-4 border-purple-400 pl-6">
                  <h3 className="text-xl font-semibold text-white">Motion Graphics Designer</h3>
                  <p className="text-purple-400">Previous Company • 2020 - 2022</p>
                  <p className="text-gray-300 mt-2">
                    Created dynamic motion graphics for marketing campaigns, social media content, 
                    and interactive web experiences.
                  </p>
                </div>
                <div className="border-l-4 border-purple-400 pl-6">
                  <h3 className="text-xl font-semibold text-white">Freelance Animator</h3>
                  <p className="text-purple-400">Self-Employed • 2018 - 2020</p>
                  <p className="text-gray-300 mt-2">
                    Worked with various clients on animation projects, from concept to final delivery, 
                    while developing personal tools and automation workflows.
                  </p>
                </div>
              </div>
            </section>

            {/* Education Section */}
            <section className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Education</h2>
              <div className="border-l-4 border-purple-400 pl-6">
                <h3 className="text-xl font-semibold text-white">Bachelor of Fine Arts in Animation</h3>
                <p className="text-purple-400">University Name • 2014 - 2018</p>
                <p className="text-gray-300 mt-2">
                  Specialized in 3D animation, character design, and digital storytelling. 
                  Graduated with honors and completed multiple award-winning student projects.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Get In Touch</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">Email</h3>
                  <p className="text-gray-300">neonhazard@gmail.com</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">LinkedIn</h3>
                  <p className="text-gray-300">linkedin.com/in/leiyang</p>
                </div>
              </div>
              <div className="mt-6">
                <Link 
                  href="/portfolio"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  View My Portfolio
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
