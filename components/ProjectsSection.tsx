'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiGithub, FiGlobe } from 'react-icons/fi'
import { FaUsers, FaDatabase, FaMicrophone, FaSearchLocation, FaShieldAlt, FaFlask, FaLungs, FaSearch } from 'react-icons/fa'

interface Project {
  id: string
  title: string
  shortTitle: string
  icon: React.ReactNode
  tagline: string
  description: string[]
  tech: string[]
  color: string
  github?: string
  live?: string
  accentColor: string
  emoji?: string
  headerPattern?: string
  headerPatternSize?: string
  headerGlow?: string
}

const projects: Project[] = [
  {
    id: 'echo',
    title: 'Echo — Real-Time Voice Agent',
    shortTitle: 'Echo',
    icon: <FaMicrophone />,
    tagline: 'Barge-in aborts in-flight tools and TTS',
    description: [
      'Built a duplex voice session where a new utterance cancels the current generation — the agent stream, the TTS queue, and a Twilio clear so buffered carrier audio stops.',
      'Flushes an acknowledgement to speech on the first sentence while tools are still running, and records caller TTFA plus barge-in stop latency as p50/p95 on the session itself.',
      'One runtime serves a WebRTC mic and a 20ms μ-law Media Streams leg, with a Hinglish bench for intent, slots, reply language, and repair after interruption.',
    ],
    tech: ['TypeScript', 'WebRTC', 'Twilio', 'VAD', 'Tool calling', 'TTS'],
    color: 'from-cyan-400 via-sky-500 to-indigo-500',
    accentColor: '#22D3EE',
    github: 'https://github.com/skx56/Echo',
    live: 'https://skx56.github.io/Echo/',
    emoji: '🎙️',
    headerPattern:
      'repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 14px), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.35) 0 1px, transparent 1.5px)',
    headerPatternSize: '100% 100%, 22px 22px',
    headerGlow:
      'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.35), transparent 42%), radial-gradient(circle at 90% 80%, rgba(99,102,241,0.45), transparent 46%)',
  },
  {
    id: 'grain',
    title: 'Grain — SQL Agent That Shows Its Work',
    shortTitle: 'Grain',
    icon: <FaDatabase />,
    tagline: 'Lock the metric, the join, and the grain — then run the query',
    description: [
      'Built an in-browser SQL agent that will not return a number until it locks a metric definition, the join path, and the grain of the result.',
      'Seeded Harbor & Co. with split payments, soft deletes, tag fan-out, and a UTC versus IST quarter boundary so the rejected query and the defended query disagree on purpose.',
      'Ran both queries in SQLite compiled to WebAssembly, with natural language mapped to defended queries rather than concatenated into SQL.',
    ],
    tech: ['TypeScript', 'SQLite WASM', 'Next.js', 'SQL'],
    color: 'from-indigo-500 via-violet-500 to-cyan-500',
    accentColor: '#818CF8',
    github: 'https://github.com/skx56/Grain',
    live: 'https://skx56.github.io/Grain/',
    emoji: '◆',
    headerPattern:
      'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)',
    headerPatternSize: '22px 22px, 22px 22px',
    headerGlow:
      'radial-gradient(circle at 12% 18%, rgba(255,255,255,0.3), transparent 42%), radial-gradient(circle at 88% 82%, rgba(129,140,248,0.38), transparent 46%)',
  },
  {
    id: 'locate-repair',
    title: 'Locate & Repair',
    shortTitle: 'Locate-Repair',
    icon: <FaSearchLocation />,
    tagline: 'Localisation claims must name file, symbol, and line',
    description: [
      'Built a grading harness where a localisation claim passes only when the file, symbol, and line all match the planted defect.',
      'Accepts a repair only when behavior tests pass on the patched file — explanations do not count.',
      'Ships three synthetic defects (path traversal, SQL string matching, export-cap logic) with gold locations and reference repairs.',
    ],
    tech: ['Python', 'unittest', 'Grading', 'Repair eval'],
    color: 'from-amber-500 via-orange-500 to-rose-500',
    accentColor: '#F59E0B',
    github: 'https://github.com/skx56/locate-repair',
    emoji: '🧭',
  },
  {
    id: 'tool-authority',
    title: 'Tool-Authority Bench',
    shortTitle: 'Tool Authority',
    icon: <FaShieldAlt />,
    tagline: 'Trace graders that catch secret-forwarding agents',
    description: [
      'Built a tool-trace bench that fails an agent which sends a secret a document asked it to forward.',
      'The grader ignores explanations and reads the trace: was send called, and did the secret appear in an outbound body?',
      'Includes safe and unsafe reference agents, Docker packaging, and unit tests that prove the harness itself.',
    ],
    tech: ['Python', 'Tool traces', 'Agent safety', 'Docker'],
    color: 'from-rose-500 via-fuchsia-500 to-purple-500',
    accentColor: '#FB7185',
    github: 'https://github.com/skx56/tool-authority-bench',
    emoji: '🛡️',
  },
  {
    id: 'agent-eval',
    title: 'Agent Eval Environments',
    shortTitle: 'Agent Evals',
    icon: <FaFlask />,
    tagline: 'Grade resulting state — not the agent’s story',
    description: [
      'Shipped three self-contained coding tasks with fixtures, reference solutions, unsafe shortcuts, and graders that score resulting state.',
      'Each environment includes instruction.md, a workspace with a planted unsafe shortcut, reference and unsafe submissions, and a Dockerfile for isolated grading.',
      'Graders run the submission and check artifacts (logs, hidden tests, outputs) rather than trusting agent-written tests.',
    ],
    tech: ['Python', 'Docker', 'Eval harness', 'Agent grading'],
    color: 'from-emerald-500 via-teal-500 to-cyan-500',
    accentColor: '#14B8A6',
    github: 'https://github.com/skx56/agent-eval-envs',
    emoji: '🧪',
  },
  {
    id: 'breath-voc',
    title: 'Breath VOC Screening',
    shortTitle: 'Breath VOC',
    icon: <FaLungs />,
    tagline: 'ML on exhaled-breath VOCs for non-invasive screening',
    description: [
      'Built an analysis stack on public breath and e-nose tables for cancer and respiratory screening signals — screening scores, not diagnoses.',
      'Compared model families across lung, breast, and respiratory datasets with stratified cross-validation and AUC / macro-F1 reporting.',
      'Aligned with breath-sensor research directions at IIT Roorkee, with notebooks and an extended multi-diagnosis analysis layer.',
    ],
    tech: ['Python', 'scikit-learn', 'Jupyter', 'Biomedical ML'],
    color: 'from-sky-500 via-cyan-500 to-teal-500',
    accentColor: '#0EA5E9',
    github: 'https://github.com/skx56/breath-voc-screening',
    emoji: '🫁',
  },
  {
    id: 'hack-search',
    title: 'Hack Search',
    shortTitle: 'Hack Search',
    icon: <FaSearch />,
    tagline: 'Hackathon discovery for cash-prize online & hybrid events',
    description: [
      'Built a focused hackathon discovery engine that scrapes major platforms and filters for high-value online and hybrid competitions.',
      'Scores opportunities by prize quality, format, geography, and product / AI relevance, then produces structured reports.',
      'Modular source adapters keep scraping isolated from filtering and report generation.',
    ],
    tech: ['Python', 'BeautifulSoup', 'Scraping', 'HTML'],
    color: 'from-violet-500 via-purple-500 to-fuchsia-500',
    accentColor: '#A78BFA',
    github: 'https://github.com/skx56/Hack-Search',
    live: 'https://skx56.github.io/Hack-Search/',
    emoji: '🔎',
  },
  {
    id: 'together',
    title: 'Together — Shared Spaces',
    shortTitle: 'Together',
    icon: <FaUsers />,
    tagline: 'Tasks, events, notes & chat — organized by space',
    description: [
      'Built a full-stack coordination app that turns messy group chat into clear ownership — isolated spaces with tasks, calendar, notes, and threaded chat.',
      'Shipped natural-language “Tell Together” intent parsing, Clerk auth, Neon Postgres, Prisma, and invites.',
      'Designed day/night themes and a PWA-ready Next.js shell for the OpenAI Hackathon.',
    ],
    tech: ['Next.js', 'TypeScript', 'Clerk', 'Prisma', 'Neon', 'Vercel'],
    color: 'from-emerald-500 via-teal-500 to-cyan-500',
    accentColor: '#14B8A6',
    github: 'https://github.com/skx56/Together',
    live: 'https://together-app-blue.vercel.app/',
    emoji: '🤝',
  },
]

export default function ProjectsSection() {
  const [activeTab, setActiveTab] = useState(projects[0].id)

  const active = projects.find((p) => p.id === activeTab)!
  const headerPattern =
    active.headerPattern ??
    'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.9) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.85) 1px, transparent 1px)'
  const headerPatternSize = active.headerPatternSize ?? '40px 40px'
  const headerGlow =
    active.headerGlow ??
    'linear-gradient(135deg, rgba(255,255,255,0.12), transparent 60%)'

  return (
    <section id="projects" className="py-24 relative" style={{ background: 'var(--bg-section)' }}>
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(20,184,166,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="section-container relative z-10">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p
            className="text-xs font-display font-semibold tracking-[0.3em] uppercase mb-4"
            style={{ color: '#14B8A6' }}
          >
            Selected Work
          </p>
          <h2
            className="font-display font-black"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}
          >
            Featured{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #14B8A6, #0EA5E9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Projects
            </span>
          </h2>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-nowrap overflow-x-auto w-full gap-2 py-4 mb-6 justify-start sm:justify-center px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => setActiveTab(project.id)}
              className="ui-btn"
              style={{
                '--hover-btn-color': project.accentColor,
                '--btn-default-bg': activeTab === project.id ? `${project.accentColor}1A` : 'var(--bg-card)',
                borderColor: activeTab === project.id ? `${project.accentColor}66` : 'var(--bg-card-border)',
                color: activeTab === project.id ? project.accentColor : 'var(--text-secondary)',
                boxShadow: activeTab === project.id ? `0 0 20px ${project.accentColor}33` : '0 4px 15px 0 rgba(0, 0, 0, 0.2)',
              } as React.CSSProperties}
            >
              <span>{project.shortTitle}</span>
            </button>
          ))}
        </div>

        {/* Project card */}
        <div
          key={active.id}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'var(--bg-card)',
            border: `1px solid ${active.accentColor}33`,
            boxShadow: `0 0 60px ${active.accentColor}15, 0 4px 24px var(--shadow)`,
            animation: 'fadeInUp 0.4s ease both',
          }}
        >
          {/* Card header with gradient */}
          <div
            className={`bg-gradient-to-r ${active.color} p-5 sm:p-8 md:p-12 relative overflow-hidden`}
          >
            <div
              className="absolute inset-0 opacity-80"
              style={{ backgroundImage: headerGlow }}
            />
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: headerPattern,
                backgroundSize: headerPatternSize,
              }}
            />
            {/* Giant Watermark Icon */}
            <div className="absolute -right-8 -bottom-8 text-[300px] opacity-[0.2] mix-blend-overlay rotate-12 select-none pointer-events-none transition-all duration-700">
              {active.icon}
            </div>
            
            <div className="relative z-10 flex flex-col justify-start gap-2">
              {active.emoji && (
                <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-white/95 backdrop-blur-md shadow-lg">
                  <span aria-hidden="true">{active.emoji}</span>
                  <span>Featured Build</span>
                </div>
              )}
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl shadow-lg border border-white/20 mb-4 drop-shadow-md">
                {active.icon}
              </div>
              <h3 className="font-display font-black text-white mb-2 tracking-tight drop-shadow-md" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                {active.title}
              </h3>
              <p className="text-white/90 font-medium text-xl border-l-4 border-white/30 pl-4 py-1">{active.tagline}</p>
            </div>
          </div>

          {/* Card body */}
          <div className="p-5 sm:p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Description */}
            <div>
              <h4 className="font-display font-bold text-sm tracking-widest uppercase mb-5" style={{ color: active.accentColor }}>
                What I Built
              </h4>
              <ul className="space-y-4">
                {active.description.map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: active.accentColor }}
                    />
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {point}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech stack */}
            <div>
              <h4 className="font-display font-bold text-sm tracking-widest uppercase mb-5" style={{ color: active.accentColor }}>
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2 mb-10">
                {active.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 backdrop-blur-sm"
                    style={{
                      background: `${active.accentColor}1A`,
                      color: active.accentColor,
                      border: `1px solid ${active.accentColor}33`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              {/* Repository Links */}
              <div>
                <h4 className="font-display font-bold text-sm tracking-widest uppercase mb-6 opacity-80" style={{ color: active.accentColor }}>
                  {active.github ? 'Repository' : 'Demo'}
                </h4>
                {active.github && (
                <a
                  href={active.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gh-button-icon block w-fit"
                >
                    <div className="gh-icon">
                      <FiGithub />
                    </div>
                    <div className="gh-cube">
                      <span className="gh-side gh-front bg-gray-900 border border-gray-700">Code</span>
                      <span
                        className="gh-side gh-top"
                        style={{ backgroundColor: active.accentColor, color: '#fff' }}
                      >
                        GitHub
                      </span>
                    </div>
                  </a>
                )}

                {active.live && (
                  active.live.startsWith('/') ? (
                    <Link
                      href={active.live}
                      className="flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:scale-105 w-fit px-4 py-2 rounded-lg"
                      style={{
                        background: `${active.accentColor}1A`,
                        color: active.accentColor,
                        border: `1px solid ${active.accentColor}44`,
                        marginTop: active.github ? '1rem' : 0,
                      }}
                    >
                      <FiGlobe size={15} />
                      Live Demo
                    </Link>
                  ) : (
                    <a
                      href={active.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 mt-4 text-sm font-semibold transition-all duration-300 hover:scale-105 w-fit px-4 py-2 rounded-lg"
                      style={{
                        background: `${active.accentColor}1A`,
                        color: active.accentColor,
                        border: `1px solid ${active.accentColor}44`,
                      }}
                    >
                      <FiGlobe size={15} />
                      Live Demo
                    </a>
                  )
                )}
              </div>

              {/* Project number indicator */}
              <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--divider)' }}>
                <p className="text-xs" style={{ color: 'var(--text-label)' }}>
                  Project {projects.findIndex((p) => p.id === active.id) + 1} of {projects.length}
                </p>
                <div className="flex gap-1.5 mt-2">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveTab(p.id)}
                      className="h-1 rounded-full transition-all duration-300"
                      style={{
                        width: p.id === active.id ? '24px' : '8px',
                        background: p.id === active.id ? active.accentColor : 'var(--bg-card-border)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
