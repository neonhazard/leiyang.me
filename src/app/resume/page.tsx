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
            {/* Header with Name and Contact Info */}
            <section className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">LEI YANG</h2>
              <div className="text-gray-300 space-y-2">
                <p>661-755-0727</p>
                <p>
                  <a 
                    href="mailto:lei@leiyang.me" 
                    className="text-purple-400 hover:text-white transition-colors"
                  >
                    lei@leiyang.me
                  </a>
                  {' • '}
                  <a 
                    href="https://linkedin.com/in/lei-yang" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-white transition-colors"
                  >
                    linkedin.com/in/lei-yang
                  </a>
                  {' • '}
                  <a 
                    href="https://www.leiyang.me" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-white transition-colors"
                  >
                    www.leiyang.me
                  </a>
                </p>
              </div>
            </section>

            {/* Profile Section */}
            <section className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">PROFILE</h2>
              <ul className="text-gray-300 space-y-3">
                <li>• Lead Animator with 15+ years of AAA game development experience, including multiple shipped Call of Duty titles</li>
                <li>• Proven expertise in AI animation systems, motion capture direction, and animation pipeline design</li>
                <li>• Strong leader of distributed teams, mentoring animators across international studios to deliver high-quality results</li>
                <li>• Blends realism with cinematic impact to create immersive, responsive, and memorable gameplay experiences</li>
                <li>• Highly technical, with deep proficiency in Maya, MEL scripting, rigging, and game engines</li>
              </ul>
            </section>

            {/* Experience Section */}
            <section className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">EXPERIENCE</h2>
              <div className="space-y-8">
                {/* Lead AI Animator */}
                <div className="border-l-4 border-purple-400 pl-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">LEAD AI ANIMATOR</h3>
                      <p className="text-purple-400">INFINITY WARD, WOODLAND HILLS, CALIFORNIA</p>
                    </div>
                    <p className="text-gray-400 text-sm">2021 – 2025</p>
                  </div>
                  <div className="text-gray-300 text-sm mb-3">
                    <p className="font-semibold">PROJECT: CALL OF DUTY: MODERN WARFARE II</p>
                    <p className="font-semibold">PROJECT: CALL OF DUTY: MODERN WARFARE III</p>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Directed animation pipelines for gameplay NPC behaviors to meet AAA quality standards</li>
                    <li>• Supervised and developed a team of 5 animators (3 in Los Angeles, 2 in Poland), elevating artistic quality and technical efficiency</li>
                    <li>• Partnered with design and engineering teams to deliver realistic AI behaviors and immersive combat experiences</li>
                    <li>• Redesigned AI combat loop and reaction systems, improving NPC responsiveness and overall player immersion</li>
                    <li>• Oversaw motion capture shoots, capturing authentic military performances and streamlining asset integration</li>
                    <li>• Owned animation systems for all soldier and civilian AI, ensuring consistency and gameplay readability</li>
                  </ul>
                </div>

                {/* Contract Lead Animator */}
                <div className="border-l-4 border-purple-400 pl-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">CONTRACT LEAD ANIMATOR</h3>
                      <p className="text-purple-400">ROGUE INITIATIVE STUDIO, LOS ANGELES, CALIFORNIA</p>
                    </div>
                    <p className="text-gray-400 text-sm">2019 – 2021</p>
                  </div>
                  <div className="text-gray-300 text-sm mb-3">
                    <p className="font-semibold">PROJECT: UNANNOUNCED GAME PROJECT</p>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-1 mb-4">
                    <li>• Designed and maintained animation pipelines, including rigging, skinning, and tool development, to streamline production workflows</li>
                    <li>• Led animation team remotely across multiple locations, providing mentorship, feedback, and direction to ensure alignment and quality</li>
                  </ul>
                  <div className="text-gray-300 text-sm mb-3">
                    <p className="font-semibold">PROJECT: UNANNOUNCED MOVIE PROJECT</p>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Created Previz shots based on director&apos;s vision</li>
                    <li>• Created rigs, skinned mesh, and produced animations</li>
                  </ul>
                </div>

                {/* Co-Founder */}
                <div className="border-l-4 border-purple-400 pl-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">CO-FOUNDER</h3>
                      <p className="text-purple-400">SUPERFINE GAMES INC, DELAWARE</p>
                    </div>
                    <p className="text-gray-400 text-sm">2017 – 2019</p>
                  </div>
                  <div className="text-gray-300 text-sm mb-3">
                    <p className="font-semibold">PROJECT: TINY SHEEP AR</p>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Created animation pipeline and assets for Unity</li>
                  </ul>
                </div>

                {/* VFX Supervisor */}
                <div className="border-l-4 border-purple-400 pl-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">VFX SUPERVISOR</h3>
                      <p className="text-purple-400">LEBUSISHU FILMS CO,.LTD, CHINA</p>
                    </div>
                    <p className="text-gray-400 text-sm">2016 – 2017</p>
                  </div>
                  <div className="text-gray-300 text-sm mb-3">
                    <p className="font-semibold">PROJECT: GUNS AND KIDNEYS</p>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Planned and executed VFX shots to the director&apos;s vision</li>
                    <li>• Managed VFX team for onsite data collection and back plate shots</li>
                    <li>• Supervised post production VFX shots</li>
                  </ul>
                </div>

                {/* Senior Animator */}
                <div className="border-l-4 border-purple-400 pl-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">SENIOR ANIMATOR</h3>
                      <p className="text-purple-400">INFINITY WARD, WOODLAND HILLS, CALIFORNIA</p>
                    </div>
                    <p className="text-gray-400 text-sm">2004 – 2015</p>
                  </div>
                  <div className="text-gray-300 text-sm mb-3">
                    <p className="font-semibold">PROJECT: CALL OF DUTY: INFINITE WARFARE</p>
                    <p className="font-semibold">PROJECT: CALL OF DUTY: ADVANCED WARFARE</p>
                    <p className="font-semibold">PROJECT: CALL OF DUTY: GHOSTS</p>
                    <p className="font-semibold">PROJECT: CALL OF DUTY: MODERN WARFARE 3</p>
                    <p className="font-semibold">PROJECT: CALL OF DUTY: MODERN WARFARE 2</p>
                    <p className="font-semibold">PROJECT: CALL OF DUTY: MODERN WARFARE</p>
                    <p className="font-semibold">PROJECT: CALL OF DUTY 2</p>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Contributed AI, cinematic, and vehicle animations across five major Call of Duty titles, from Call of Duty 2 through Infinite Warfare</li>
                    <li>• Vehicle rigging and skinning</li>
                    <li>• Led development of dog &quot;Riley&quot; animation assets, a signature gameplay feature, collaborating with one other animator on design, creation, and implementation</li>
                    <li>• Drove the design and creation of snowmobile animation assets, ensuring gameplay integration and polish</li>
                    <li>• Owned creation and implementation of animation assets for the level &quot;The Coup,&quot; driving cinematic impact</li>
                    <li>• Spearheaded the &quot;Pointe Du Hoc&quot; massive beach invasion scene for the E3 showcase, delivering a high-visibility feature under tight deadlines</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Download Section */}
            <section className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/portfolio"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-center"
                >
                  View My Portfolio
                </Link>
                <a 
                  href="/documents/Lei_Yang_resume.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors text-center"
                >
                  Download PDF Resume
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}