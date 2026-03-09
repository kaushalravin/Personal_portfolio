import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

const EducationBG = lazy(() => import('./three/EducationBG'));

const EDUCATION = [
  {
    institution: 'Madras Institute of Technology',
    sub:         'Anna University',
    degree:      'B.E. Computer Science and Engineering',
    score:       '9.80 / 10.0',
    scoreLabel:  'CGPA',
    year:        'Expected 2028',
    location:    'Chennai, India',
    featured:    true,
  },
  {
    institution: 'A.V. Meiyappan Matric. Hr. Sec. School',
    sub:         null,
    degree:      'Higher Secondary Certificate (HSC)',
    score:       '98.33%',
    scoreLabel:  'Score',
    year:        '2023 – 2024',
    location:    'Chennai, India',
    featured:    false,
  },
  {
    institution: 'A.V. Meiyappan Matric. Hr. Sec. School',
    sub:         null,
    degree:      'Secondary School Leaving Certificate (SSLC)',
    score:       '93.2%',
    scoreLabel:  'Score',
    year:        '2021 – 2022',
    location:    'Chennai, India',
    featured:    false,
  },
];

function EducationCard({ edu, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      className="flex flex-col h-full"
    >
      <div
        className={`
          relative flex flex-col h-full rounded-2xl overflow-hidden
          border backdrop-blur-sm
          ${edu.featured
            ? 'border-accent/60 bg-[rgba(99,102,241,0.08)]'
            : 'border-white/10 bg-[rgba(255,255,255,0.04)]'
          }
        `}
        style={{
          boxShadow: edu.featured
            ? '0 0 0 1px rgba(99,102,241,0.2), 0 24px 48px -12px rgba(0,0,0,0.7), 0 0 60px -20px rgba(99,102,241,0.3)'
            : '0 24px 48px -12px rgba(0,0,0,0.6)',
        }}
      >
        {/* Top accent stripe */}
        <div className={`h-1 w-full ${edu.featured ? 'bg-gradient-to-r from-accent via-accent-light to-accent/40' : 'bg-white/10'}`} />

        <div className="flex flex-col flex-1 p-8 gap-6">

          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white font-black text-lg leading-tight">{edu.institution}</p>
              {edu.sub && <p className="text-white/50 text-sm font-medium mt-0.5">{edu.sub}</p>}
            </div>
            {edu.featured && (
              <span className="flex-shrink-0 text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1 rounded-full bg-accent text-white">
                Current
              </span>
            )}
          </div>

          {/* Degree */}
          <p className="text-white/80 font-bold text-base leading-snug">
            {edu.degree}
          </p>

          {/* Score — big hero number */}
          <div className={`rounded-xl p-5 ${edu.featured ? 'bg-accent/15 border border-accent/25' : 'bg-white/[0.06] border border-white/10'}`}>
            <p className={`text-5xl font-black tracking-tight leading-none ${edu.featured ? 'text-white' : 'text-white'}`}>
              {edu.score}
            </p>
            <p className={`text-xs font-bold tracking-[0.2em] uppercase mt-2 ${edu.featured ? 'text-accent-light' : 'text-white/40'}`}>
              {edu.scoreLabel}
            </p>
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-black ${edu.featured ? 'text-accent-light' : 'text-white/50'}`}>◷</span>
              <span className="text-white font-bold text-sm">{edu.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-black ${edu.featured ? 'text-accent-light' : 'text-white/50'}`}>◎</span>
              <span className="text-white font-bold text-sm">{edu.location}</span>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden" style={{ padding: '7rem 0' }}>

      {/* Three.js floating books background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Suspense fallback={null}>
          <EducationBG />
        </Suspense>
      </div>

      {/* Dark overlay so text stays sharp */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,15,0.82) 0%, rgba(10,10,15,0.75) 50%, rgba(10,10,15,0.88) 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span className="font-mono text-[10.5px] tracking-[0.25em] uppercase text-accent/70 flex items-center gap-2.5 mb-4">
            <span className="inline-block w-6 h-px bg-gradient-to-r from-accent to-accent-light rounded-full" />
            Academic Background
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            Education
          </h2>
          <p className="text-white/60 mt-4 text-base font-medium leading-relaxed max-w-xl">
            My academic journey reflects a strong foundation in computer science and consistent academic performance.
          </p>
          <p className="text-white/40 mt-2 text-sm leading-relaxed max-w-xl">
            I strive to apply these fundamentals while building real-world software projects.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {EDUCATION.map((edu, i) => (
            <EducationCard key={i} edu={edu} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
