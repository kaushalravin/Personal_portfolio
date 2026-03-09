import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

const OrbitalRings = lazy(() => import('./three/OrbitalRings'));

/* ─── Data ───────────────────────────────────────────────────────── */
const ACHIEVEMENTS = [
  {
    icon: '⌗',
    title: 'LeetCode — 200+ Problems',
    desc: 'Completed 200+ problems focusing on Data Structures and Algorithms.',
    tag: 'DSA',
  },
  {
    icon: '🏆',
    title: 'Code Rush — Runner Up',
    desc: 'Secured 2nd place in a college-level competition covering DSA, OOP, and DBMS.',
    tag: 'Competition',
  },
  {
    icon: '★',
    title: 'School Topper — Class XII',
    desc: 'Academic excellence with centum in Computer Science, Physics, and French. Score: 98.33%.',
    tag: 'Academic',
  },
  {
    icon: '◈',
    title: 'Full-Stack Certifications',
    desc: 'Foundations of Full-Stack Web Development (HTML, CSS, React, Node.js) · Web Developer Bootcamp 2026 (Udemy).',
    tag: 'Certification',
  },
  {
    icon: '✦',
    title: 'Black Belt — Zen Isshinryu Karate',
    desc: 'Earned black belt demonstrating long-term discipline, commitment, and perseverance.',
    tag: 'Personal',
  },
];

/* ─── Card ───────────────────────────────────────────────────────── */
function AchievementCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.22 } }}
      className="relative group rounded-2xl border border-white/8 overflow-hidden
                 hover:border-accent/40 transition-colors duration-300"
      style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(10,10,15,0.95) 60%)',
        boxShadow: '0 4px 32px -8px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.04) inset',
      }}
    >
      {/* Top glint */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />

      <div className="p-7">
        {/* Icon + tag row */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-3xl leading-none text-white drop-shadow-lg">{item.icon}</span>
          <span className="font-mono text-[9px] tracking-[0.22em] uppercase px-2.5 py-1 rounded-full
                           bg-accent/10 text-accent-light border border-accent/25">
            {item.tag}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-black text-lg leading-tight mb-3 tracking-tight">
          {item.title}
        </h3>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-accent/30 to-transparent mb-4" />

        {/* Description */}
        <p className="text-white/70 text-sm leading-relaxed font-medium">
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Section ────────────────────────────────────────────────────── */
export default function Achievements() {
  return (
    <section id="achievements" className="relative section-container overflow-hidden">

      {/* ── Orbital rings Three.js background ─────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none"
           style={{ opacity: 0.55 }}>
        <Suspense fallback={null}>
          <OrbitalRings />
        </Suspense>
      </div>

      {/* Radial dark vignette — keeps text readable */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, rgba(10,10,15,0.88) 80%)' }} />

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span className="font-mono text-[10.5px] tracking-[0.25em] uppercase text-accent/70
                           flex items-center gap-2.5 mb-4">
            <span className="inline-block w-6 h-px bg-gradient-to-r from-accent to-accent-light rounded-full" />
            Milestones
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Achievements
          </h2>
          <p className="text-white/50 mt-3 text-sm leading-relaxed max-w-md font-medium">
            Competitions, recognitions, certifications, and personal milestones that shaped who I am.
          </p>
        </motion.div>

        {/* Cards — 2 col on md, 3 col on lg, last card centred if odd */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ACHIEVEMENTS.map((item, i) => (
            <AchievementCard key={item.title} item={item} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}

