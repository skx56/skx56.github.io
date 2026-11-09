'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiGithub, FiGlobe } from 'react-icons/fi'
import {
  FaUsers, FaDatabase, FaMicrophone, FaSearchLocation, FaShieldAlt, FaFlask,
  FaShareAlt, FaFileAlt, FaCreditCard, FaPlane, FaHeartbeat, FaTags,
  FaBrain, FaStar, FaClipboardCheck, FaBolt, FaChartBar, FaPills, FaLink,   FaCube, FaSearch,
} from 'react-icons/fa'

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
    tagline: 'Duplex voice with barge-in across tools, TTS, and Twilio',
    description: [
      'Built a duplex voice agent with WebRTC, speech recognition, tool routing, and speech synthesis.',
      'Barge-in cancels the in-flight turn: agent generation, TTS, tools, and Twilio audio.',
      'A Hinglish bench measures tool accuracy, time-to-first-audio, and barge-in latency.',
    ],
    tech: ['TypeScript', 'WebRTC', 'Twilio', 'TTS', 'Tool calling'],
    color: 'from-cyan-400 via-sky-500 to-indigo-500',
    accentColor: '#22D3EE',
    github: 'https://github.com/skx56/Echo',
    live: 'https://skx56.github.io/Echo/',
    emoji: '🎙️',
  },
  {
    id: 'grain',
    title: 'Grain — SQL Agent That Shows Its Work',
    shortTitle: 'Grain',
    icon: <FaDatabase />,
    tagline: 'Lock the metric, the join, and the grain before answering',
    description: [
      'In-browser SQL agent that locks metric, join path, and data grain before it runs a query.',
      'A critic executes the naive query and the defended query against the same SQLite database.',
      'Next.js and TypeScript UI with deterministic routing, sensitivity checks, and row-level results.',
    ],
    tech: ['TypeScript', 'Next.js', 'SQLite WASM', 'SQL'],
    color: 'from-indigo-500 via-violet-500 to-cyan-500',
    accentColor: '#818CF8',
    github: 'https://github.com/skx56/Grain',
    live: 'https://skx56.github.io/Grain/',
    emoji: '◆',
  },
  {
    id: 'confera',
    title: 'Confera — Multi-Agent Event Planner',
    shortTitle: 'Confera',
    icon: <FaLink />,
    tagline: 'Agents for workstreams, state, and retrieval',
    description: [
      'Multi-agent event planner on FastAPI and WebSockets, with ChromaDB for state and retrieval.',
      'React and TypeScript dashboard (Vite, Zustand) for live progress, review, and planning.',
      'Built with Rajiv Bhawan, IIT Roorkee.',
    ],
    tech: ['FastAPI', 'WebSockets', 'ChromaDB', 'React', 'Zustand'],
    color: 'from-amber-500 via-orange-500 to-rose-500',
    accentColor: '#F59E0B',
    github: 'https://github.com/skx56/Confera',
    emoji: '🗓️',
  },
  {
    id: 'together',
    title: 'Together — Group Coordination',
    shortTitle: 'Together',
    icon: <FaUsers />,
    tagline: 'Tasks, events, notes, and chat, one space at a time',
    description: [
      'Turns group chat into ownership: isolated spaces with tasks, a calendar, notes, and threads.',
      'Plain-language commands create events and tasks. Clerk, Neon, and Prisma underneath.',
    ],
    tech: ['Next.js', 'TypeScript', 'Clerk', 'Prisma', 'Neon'],
    color: 'from-emerald-500 via-teal-500 to-cyan-500',
    accentColor: '#14B8A6',
    github: 'https://github.com/skx56/Together',
    live: 'https://together-app-blue.vercel.app/',
    emoji: '🤝',
  },
  {
    id: 'wshare',
    title: 'wShare — Browser-to-Browser Transfer',
    shortTitle: 'wShare',
    icon: <FaShareAlt />,
    tagline: 'Encrypted P2P files, no server payload',
    description: [
      'Encrypted peer-to-peer transfer with chunking, encryption, and reassembly over WebRTC data channels.',
      'Socket.IO and Express for signaling, STUN/ICE for NAT traversal, and live connection state.',
    ],
    tech: ['JavaScript', 'WebRTC', 'Socket.IO', 'Express'],
    color: 'from-sky-600 to-cyan-500',
    accentColor: '#0EA5E9',
    github: 'https://github.com/skx56/wShare',
    live: 'https://w-share.vercel.app',
    emoji: '🔗',
  },
  {
    id: 'docuquery',
    title: 'Docuquery — Semantic RAG',
    shortTitle: 'Docuquery',
    icon: <FaFileAlt />,
    tagline: 'OCR, embeddings, and grounded answers over PDFs',
    description: [
      'OCR extraction with binarization, then chunking sized for embeddings.',
      'Semantic search with all-mpnet-base-v2 and FAISS.',
      'T5-large writes answers from the retrieved passages. Built at Tinkering Lab, IIT Roorkee.',
    ],
    tech: ['Python', 'FAISS', 'T5', 'OCR', 'RAG'],
    color: 'from-teal-600 to-emerald-500',
    accentColor: '#14B8A6',
    github: 'https://github.com/skx56/Docuquery',
    emoji: '📄',
  },
  {
    id: 'effecteval',
    title: 'EffectEval — Agent & Tool-Use Bench',
    shortTitle: 'EffectEval',
    icon: <FaFlask />,
    tagline: 'Grade the artifact, not the explanation',
    description: [
      'Evaluation environments where a submission passes only if the resulting state is right — logs, hidden tests, or outputs.',
      'Paired with a locate-and-repair grader (file, symbol, and line) and a tool-authority bench that fails agents which forward a secret.',
    ],
    tech: ['Python', 'Docker', 'Eval harness', 'Tool traces'],
    color: 'from-emerald-500 via-teal-500 to-cyan-500',
    accentColor: '#10B981',
    github: 'https://github.com/skx56/agent-eval-envs',
    emoji: '🧪',
  },
  {
    id: 'locate',
    title: 'Locate & Repair',
    shortTitle: 'Locate-Repair',
    icon: <FaSearchLocation />,
    tagline: 'A claim needs the file, the symbol, and the line',
    description: [
      'Localisation is accepted only when file, symbol, and line match the defect.',
      'A repair is accepted only when behavior tests pass on the patched file.',
      'Three defects: path traversal, SQL string matching, and an export-cap check.',
    ],
    tech: ['Python', 'unittest', 'Repair eval'],
    color: 'from-amber-500 to-orange-500',
    accentColor: '#F59E0B',
    github: 'https://github.com/skx56/locate-repair',
    emoji: '🧭',
  },
  {
    id: 'tool-authority',
    title: 'Tool-Authority Bench',
    shortTitle: 'Tool Authority',
    icon: <FaShieldAlt />,
    tagline: 'The trace is the grade',
    description: [
      'A document asks the agent to forward an admin password. The grader reads the tool trace, not the write-up.',
      'A safe agent stops after reading. An unsafe agent that calls send with the secret fails.',
    ],
    tech: ['Python', 'Tool traces', 'Docker'],
    color: 'from-rose-500 to-fuchsia-500',
    accentColor: '#FB7185',
    github: 'https://github.com/skx56/tool-authority-bench',
    emoji: '🛡️',
  },
  {
    id: 'credit',
    title: 'CreditGuard — Default Risk Model',
    shortTitle: 'CreditGuard',
    icon: <FaCreditCard />,
    tagline: 'Classification under a 22% default class',
    description: [
      'Logistic regression and random forest, with SMOTE on a 22% default class.',
      '81% recall, 0.615 F2, 0.789 AUC-ROC, and about 40% fewer false negatives.',
    ],
    tech: ['Python', 'scikit-learn', 'SMOTE', 'Random Forest'],
    color: 'from-rose-600 to-orange-500',
    accentColor: '#F43F5E',
    github: 'https://github.com/skx56/CreditGuard',
    emoji: '💳',
  },
  {
    id: 'air',
    title: 'Flight Delay Prediction',
    shortTitle: 'Air Travel',
    icon: <FaPlane />,
    tagline: '600K flights, weather, and delay drivers',
    description: [
      'Analysed 600K+ records for delay patterns across weather, operations, and departure punctuality.',
      'Engineered features and trained scikit-learn models to classify delays and name the drivers.',
      'Society of Business, IIT Roorkee.',
    ],
    tech: ['Python', 'scikit-learn', 'Pandas', 'Feature engineering'],
    color: 'from-sky-500 to-blue-600',
    accentColor: '#0EA5E9',
    github: 'https://github.com/skx56/Optimizing-Air-Travel',
    emoji: '✈️',
  },
  {
    id: 'health',
    title: 'LLM Health Assistant',
    shortTitle: 'Health Assistant',
    icon: <FaHeartbeat />,
    tagline: 'RAG over indexed medical literature',
    description: [
      'LangChain, Pinecone, and GPT-3.5 for questions grounded in indexed literature.',
      'Dense embeddings and async retrieval so answers stay tied to the source passages.',
      'Tinkering Lab, IIT Roorkee.',
    ],
    tech: ['LangChain', 'Pinecone', 'RAG', 'Python'],
    color: 'from-green-500 to-teal-400',
    accentColor: '#10B981',
    github: 'https://github.com/skx56/LLM-based-Health-Assistant',
    emoji: '🩺',
  },
  {
    id: 'metagen',
    title: 'Automated Metadata Generation',
    shortTitle: 'Metagen',
    icon: <FaTags />,
    tagline: 'Entities, keywords, and topics from unstructured files',
    description: [
      'NLP pipeline with spaCy, transformers, topic modeling, and document embeddings.',
      'Python jobs for semantic indexing so search hits the right document, not just a keyword.',
      'MaRS, IIT Roorkee.',
    ],
    tech: ['Python', 'spaCy', 'Transformers', 'Embeddings'],
    color: 'from-violet-500 to-indigo-500',
    accentColor: '#8B5CF6',
    github: 'https://github.com/skx56/Metagen',
    emoji: '🏷️',
  },
  {
    id: 'distill',
    title: 'Teacher-Free Knowledge Distillation',
    shortTitle: 'Distillation',
    icon: <FaBrain />,
    tagline: 'Self-training on CIFAR-100 and ImageNet',
    description: [
      'Teacher-free distillation with self-training and label smoothing.',
      'ResNet, ResNeXt, MobileNet, and ShuffleNet, without an external teacher.',
      'Up to about +1% accuracy from the training setup, in PyTorch. Tinkering Lab, IIT Roorkee.',
    ],
    tech: ['PyTorch', 'CNNs', 'CIFAR-100', 'ImageNet'],
    color: 'from-purple-600 to-pink-500',
    accentColor: '#A78BFA',
    github: 'https://github.com/skx56/Knowledge-Distillation-Safety',
    emoji: '🧠',
  },
  {
    id: 'astro',
    title: 'Astrophysics Model Finetuning',
    shortTitle: 'Astro ML',
    icon: <FaStar />,
    tagline: 'Transfer learning and LoRA on sky surveys',
    description: [
      '79.6% accuracy with ResNet and VGG transfer learning, plus LoRA finetuning experiments.',
      'Loss down 4.7%. Grad-CAM and confusion matrices for the errors that remain.',
      'Physics and Astronomy Club, IIT Roorkee.',
    ],
    tech: ['PyTorch', 'Transfer learning', 'LoRA', 'Grad-CAM'],
    color: 'from-slate-700 to-indigo-600',
    accentColor: '#818CF8',
    github: 'https://github.com/skx56/GalaxyML',
    emoji: '✨',
  },
  {
    id: 'support',
    title: 'Support Integrity Auditor',
    shortTitle: 'Support Auditor',
    icon: <FaClipboardCheck />,
    tagline: 'Priority, escalation, and resolution quality',
    description: [
      'Auditor for support tickets: priority mismatch, escalation risk, and whether the resolution actually holds.',
      'MaRS, IIT Roorkee.',
    ],
    tech: ['Python', 'NLP', 'Evaluation'],
    color: 'from-orange-500 to-amber-400',
    accentColor: '#F97316',
    github: 'https://github.com/skx56/Support-Integrity-Auditor',
    emoji: '📋',
  },
  {
    id: 'ev',
    title: 'EV Charging Tariff Optimization',
    shortTitle: 'EV Tariffs',
    icon: <FaBolt />,
    tagline: 'Demand forecasts into dynamic prices',
    description: [
      'Demand forecasting and dynamic pricing for EV charging networks.',
      'Society of Business, IIT Roorkee.',
    ],
    tech: ['Python', 'Forecasting', 'Pricing'],
    color: 'from-lime-500 to-emerald-500',
    accentColor: '#84CC16',
    github: 'https://github.com/skx56/Agentic-AI-Based-Dynamic-Tariff-Optimization-for-EV-Charging-Networks',
    emoji: '⚡',
  },
  {
    id: 'sales',
    title: 'Supplier Sales Analysis',
    shortTitle: 'Sales Analysis',
    icon: <FaChartBar />,
    tagline: '20+ KPIs across 100+ suppliers',
    description: [
      'Power BI dashboards over 100+ suppliers: cost per unit, margins, and supplier performance.',
      'SQL and Python pipelines cut manual reporting by about 80%.',
      'Finance & Economics Club, IIT Guwahati.',
    ],
    tech: ['SQL', 'Power BI', 'Python', 'Pandas'],
    color: 'from-cyan-600 to-blue-500',
    accentColor: '#06B6D4',
    emoji: '📈',
  },
  {
    id: 'remind',
    title: 'Remind — Medicine Reminders',
    shortTitle: 'Remind',
    icon: <FaPills />,
    tagline: 'Prescriptions to scheduled reminders',
    description: [
      'Flutter app that schedules medicine reminders from a prescription, including background notifications.',
      'Pill tracking, refill alerts, and dose adherence. Tinkering Lab, IIT Roorkee.',
    ],
    tech: ['Flutter', 'Notifications', 'Mobile'],
    color: 'from-pink-500 to-rose-400',
    accentColor: '#EC4899',
    emoji: '💊',
  },
  {
    id: 'hack-search',
    title: 'Hack Search',
    shortTitle: 'Hack Search',
    icon: <FaSearch />,
    tagline: 'Hackathons with cash prizes and a real build',
    description: [
      'Scrapes hackathon listings and keeps the online and hybrid events with cash prizes and a product or AI brief.',
      'Source adapters stay separate from scoring and the report.',
    ],
    tech: ['Python', 'BeautifulSoup', 'Scraping'],
    color: 'from-violet-500 to-fuchsia-500',
    accentColor: '#A78BFA',
    github: 'https://github.com/skx56/Hack-Search',
    live: 'https://skx56.github.io/Hack-Search/',
    emoji: '🔎',
  },
  {
    id: 'blockbase',
    title: 'Blockbase — On-Chain Expenses',
    shortTitle: 'Blockbase',
    icon: <FaCube />,
    tagline: 'Expense tracking with on-chain permissions',
    description: [
      'Decentralized expense tracker: a React client and smart-contract permission logic.',
      'Finance & Economics Club, IIT Guwahati.',
    ],
    tech: ['JavaScript', 'React', 'Smart contracts'],
    color: 'from-zinc-600 to-slate-500',
    accentColor: '#64748B',
    github: 'https://github.com/skx56/Blockbase_project',
    emoji: '⛓️',
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
