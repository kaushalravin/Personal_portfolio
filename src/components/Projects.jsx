import { motion } from 'framer-motion';
import expenseIQ    from '../assets/expense-iq.png';
import chatNest     from '../assets/chatnest.png';
import irrCalc      from '../assets/irr-calculator.png';
import portfolio    from '../assets/portfolio.png';
import passMgr      from '../assets/terminal-command-prompt.png';

/* ─── Project Data ───────────────────────────────────────────────── */
const PROJECTS = [
  {
    name:   'ExpenseIQ',
    title:  'AI-Powered Expense Tracker',
    desc:   'Full-stack MERN expense tracker with AI natural language parsing — type expenses in plain English and they\'re automatically structured and saved.',
    image:  expenseIQ,
    tags:   ['React', 'Node.js', 'Express', 'MongoDB', 'Gemini API'],
    github: 'https://github.com/kaushalravin/ExpenseIQ',
    live:   null,
  },
  {
    name:   'ChatNest',
    title:  'Real-Time Chat Application',
    desc:   'Real-time chat platform where users join named rooms to communicate instantly. Rooms are server-managed with automatic cleanup when empty.',
    image:  chatNest,
    tags:   ['React', 'Node.js', 'Express', 'Socket.io'],
    github: 'https://github.com/kaushalravin/ChatNest',
    live:   null,
  },
  {
    name:   'IRR Calculator',
    title:  'Financial Analysis Tool',
    desc:   'Web-based Internal Rate of Return calculator. Input yearly cash flows and get the IRR computed instantly for investment analysis.',
    image:  irrCalc,
    tags:   ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/kaushalravin/interest-rate-on-return-calculator',
    live:   null,
  },
  {
    name:   'Portfolio',
    title:  'Personal Developer Portfolio',
    desc:   'This portfolio — a dark-themed interactive site built with React, Vite, and Three.js. Features 3D scenes, scroll animations, and an EmailJS contact form.',
    image:  portfolio,
    tags:   ['React', 'Three.js', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    github: 'https://github.com/kaushalravin/Personal_portfolio',
    live:   null,
  },
  {
    name:   'PassVault',
    title:  'Console Password Manager (C++)',
    desc:   'A console-based password manager in C++ with master password protection and symmetric encryption. Securely store, retrieve, modify, and delete credentials for any app — all encrypted to disk using a character-shift cipher keyed to the master password.',
    image:  passMgr,
    tags:   ['C++', 'OOP', 'File I/O', 'Encryption'],
    github: 'https://github.com/kaushalravin/password-manager',
    live:   null,
  },
];

/* ─── Framer variants ────────────────────────────────────────────── */
const container = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};
const cardVariant = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Single Card ────────────────────────────────────────────────── */
function ProjectCard({ project }) {
  const { name, title, desc, image, tags, github, live } = project;
  return (
    <motion.article
      variants={cardVariant}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="
        group flex flex-col rounded-2xl overflow-hidden
        border border-accent/10 bg-surface
        hover:border-accent/30 hover:shadow-glow-sm
        transition-colors duration-300
      "
    >
      {/* Screenshot */}
      <div className="relative overflow-hidden h-48 bg-surface-light flex-shrink-0">
        <img
          src={image}
          alt={`${name} screenshot`}
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-4 font-mono text-[11px] font-semibold tracking-widest uppercase text-accent-light">
          {name}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-4">

        {/* Title + desc */}
        <div>
          <h3 className="text-text-primary font-semibold text-base leading-snug mb-2">{title}</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="font-mono text-[10.5px] px-2.5 py-0.5 rounded-full bg-accent/[0.08] text-accent-light border border-accent/20">
              {t}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-accent/15 to-transparent" />

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-auto">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2
              px-4 py-1.5 rounded-lg text-sm font-medium
              bg-surface-light border border-accent/25 text-text-primary
              hover:border-accent/60 hover:bg-accent/[0.08] hover:shadow-glow-sm
              transition-all duration-250
            "
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.55v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.19a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39C17.03 6 18 6.31 18 6.31c.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.27 5.68.42.36.79 1.06.79 2.14v3.17c0 .3.2.66.8.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/>
            </svg>
            GitHub
          </a>
          {live && (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium bg-accent hover:bg-accent-glow text-white shadow-glow-sm hover:shadow-glow-md transition-all duration-250"
            >
              Live ↗
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Section ────────────────────────────────────────────────────── */
export default function Projects() {
  return (
    <section id="projects" className="section-container">

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14"
      >
        <span className="font-mono text-[10.5px] tracking-[0.25em] uppercase text-accent/70 flex items-center gap-2.5 mb-4">
          <span className="inline-block w-6 h-px bg-gradient-to-r from-accent to-accent-light rounded-full" />
          Selected Work
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight">
          Things I&apos;ve <span className="text-gradient">Built</span>
        </h2>
        <p className="text-text-secondary mt-3 text-sm max-w-md leading-relaxed">
          A few projects that reflect how I think, build, and ship.
        </p>
      </motion.div>

      {/* Cards grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {PROJECTS.map((p) => (
          <ProjectCard key={p.name} project={p} />
        ))}
      </motion.div>

    </section>
  );
}
