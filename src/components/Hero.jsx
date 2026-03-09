import { Suspense, lazy, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LaptopScene = lazy(() => import('./three/LaptopScene'));

/* ─── Typing roles ───────────────────────────────────────────────── */
const ROLES = [
  '2nd Year CS Student',
  'Aspiring Software Engineer',
  'Open to Internships',
  'Building Real Projects',
  'Learning Every Day',
];

function TypedRole() {
  const [idx,       setIdx]       = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting,  setDeleting]  = useState(false);

  useEffect(() => {
    const current = ROLES[idx];

    if (!deleting && displayed === current) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    if (deleting && displayed === '') {
      setDeleting(false);
      setIdx((i) => (i + 1) % ROLES.length);
      return;
    }

    const t = setTimeout(
      () =>
        setDisplayed(
          deleting
            ? current.slice(0, displayed.length - 1)
            : current.slice(0, displayed.length + 1)
        ),
      deleting ? 36 : 70
    );
    return () => clearTimeout(t);
  }, [displayed, deleting, idx]);

  return (
    <span className="text-gradient">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.9, repeat: Infinity }}
        className="ml-px text-accent"
      >|</motion.span>
    </span>
  );
}

/* ─── Framer-Motion variants ─────────────────────────────────────── */
const container = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.11, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9 } },
};

/* ─── Static star dots behind text (CSS) ────────────────────────── */
function StarField() {
  const stars = Array.from({ length: 38 }, (_, i) => ({
    id:   i,
    top:  `${Math.random() * 100}%`,
    left: `${Math.random() * 52}%`,
    size: Math.random() < 0.25 ? 2 : 1,
    op:   0.12 + Math.random() * 0.22,
    dur:  2.4 + Math.random() * 3,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <motion.span
          key={s.id}
          animate={{ opacity: [s.op, s.op * 0.25, s.op] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: s.top, left: s.left,
            width:  s.size, height: s.size,
            borderRadius: '50%',
            background: '#818cf8',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-primary"
    >

      {/* ── 3-D scene — full screen ─────────────────────────────── */}
      <motion.div
        variants={fadeIn} initial="hidden" animate="visible"
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Suspense fallback={null}>
          <LaptopScene />
        </Suspense>
      </motion.div>

      {/* ── Ambient star specks on text side ────────────────────── */}
      <StarField />

      {/* ── Left gradient for text legibility ───────────────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(105deg,'
            + ' #0a0a0f 0%,'
            + ' #0a0a0f 18%,'
            + ' rgba(10,10,15,0.95) 32%,'
            + ' rgba(10,10,15,0.72) 50%,'
            + ' rgba(10,10,15,0.18) 68%,'
            + ' transparent 84%)',
        }}
      />

      {/* ── Bottom fade ─────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-44 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0a0a0f 25%, transparent)' }}
      />

      {/* ── Accent glow blob ────────────────────────────────────── */}
      <div
        className="absolute top-[20%] left-[10%] w-[500px] h-[500px] z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* ── TEXT COLUMN ─────────────────────────────────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="
          relative z-10
          ml-[8%] mr-auto
          px-6 sm:px-8 lg:px-10
          pt-32 pb-24
          w-full lg:max-w-[59%]
          lg:min-h-screen flex flex-col justify-center
        "
      >

        {/* ── Eyebrow tag ─────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="mb-7">
          <span className="
            inline-flex items-center gap-2.5
            font-mono text-[10.5px] tracking-[0.25em] uppercase
            text-accent/80
          ">
            <span className="inline-block w-6 h-px bg-gradient-to-r from-accent to-accent-light rounded-full" />
            Available for opportunities
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </span>
        </motion.div>

        {/* ── Name ────────────────────────────────────────────── */}
        <motion.h1
          variants={fadeUp}
          className="font-bold tracking-tight leading-[1.04] mb-4 whitespace-nowrap"
        >
          <span className="text-[3.6rem] sm:text-[4.6rem] md:text-[5.4rem] text-text-primary">
            Kaushal{' '}
          </span>
          <span className="text-[3.6rem] sm:text-[4.6rem] md:text-[5.4rem] text-text-primary">
            .N
          </span>
        </motion.h1>

        {/* ── Typed specialization ────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          className="text-[1.25rem] sm:text-[1.45rem] font-medium text-text-secondary mb-3 h-9 flex items-center"
        >
          <TypedRole />
        </motion.div>

        {/* ── Subheading ──────────────────────────────────────── */}
        <motion.p
          variants={fadeUp}
          className="text-text-primary/90 text-[1.35rem] sm:text-[1.6rem] font-semibold leading-snug mb-7"
        >
          I build{' '}
          <span className="text-gradient">AI-integrated</span>
          {' '}web applications
        </motion.p>

      </motion.div>
    </section>
  );
}


