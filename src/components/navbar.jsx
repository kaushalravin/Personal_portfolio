import { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Nav Sections ───────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Home',         to: 'hero'         },
  { label: 'Projects',     to: 'projects'     },
  { label: 'Skills',       to: 'skills'       },
  { label: 'Education',    to: 'about'        },
  { label: 'Achievements', to: 'achievements' },
  { label: 'Contact',      to: 'contact'      },
];

/* ─── Framer-Motion variants ─────────────────────────────────── */
const mobileMenuVariants = {
  hidden:  { opacity: 0, y: -16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.97,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const linkItemVariants = {
  hidden:  { opacity: 0, x: -14 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.25, ease: 'easeOut' },
  }),
};

/* ─── Hamburger Icon ─────────────────────────────────────────── */
function HamburgerIcon({ open }) {
  const base =
    'block absolute h-0.5 w-5 bg-text-primary rounded-full transition-all duration-300';
  return (
    <span className="relative flex items-center justify-center w-6 h-6 cursor-pointer">
      <span
        className={`${base} ${
          open ? 'rotate-45 top-1/2 -translate-y-1/2' : 'top-1'
        }`}
      />
      <span
        className={`${base} top-1/2 -translate-y-1/2 transition-opacity duration-200 ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`${base} ${
          open ? '-rotate-45 top-1/2 -translate-y-1/2' : 'bottom-1'
        }`}
      />
    </span>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  /* Detect scroll ------------------------------------------------ */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Active section via IntersectionObserver --------------------- */
  useEffect(() => {
    const sections = NAV_LINKS.map(({ to }) => document.getElementById(to)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => sections.forEach((s) => observer.unobserve(s));
  }, []);

  /* Close mobile menu on resize --------------------------------- */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      {/* ── Main Bar ─────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1  }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500
          ${scrolled
            ? 'glass shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-accent/10'
            : 'bg-transparent border-b border-transparent'
          }
        `}
      >
        <nav className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">

          {/* ── Logo ────────────────────────────────────────── */}
          <ScrollLink
            to="hero"
            smooth
            duration={600}
            className="flex items-center gap-1.5 cursor-pointer select-none group"
          >
            <span className="font-mono text-xl font-semibold tracking-tight">
              <span className="text-muted group-hover:text-accent-light transition-colors duration-300">{'{'}</span>
              <span className="text-gradient mx-1">KN</span>
              <span className="text-muted group-hover:text-accent-light transition-colors duration-300">{'}'}</span>
            </span>
            <span className="hidden sm:block font-mono text-xs text-muted/60 tracking-widest uppercase pt-0.5">
              .dev
            </span>
          </ScrollLink>

          {/* ── Desktop Links ───────────────────────────────── */}
          <ul className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to}>
                <ScrollLink
                  to={to}
                  smooth
                  duration={600}
                  offset={-72}
                  className={`
                    nav-link-underline
                    font-sans text-sm font-medium tracking-wide cursor-pointer
                    transition-colors duration-300
                    ${activeSection === to
                      ? 'text-accent-light'
                      : 'text-text-secondary hover:text-text-primary'
                    }
                  `}
                >
                  {label}
                </ScrollLink>
              </li>
            ))}
          </ul>

          {/* ── CTA (desktop) ───────────────────────────────── */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="/resume.pdf"
              download
              className="
                cursor-pointer inline-flex items-center gap-2
                px-4 py-1.5 rounded-md text-sm font-medium
                border border-accent/50 text-accent-light
                hover:bg-accent/10 hover:border-accent hover:shadow-glow-sm
                transition-all duration-300
              "
            >
              <span className="text-accent text-xs">↓</span>
              Download Resume
            </a>
          </div>

          {/* ── Hamburger (mobile) ──────────────────────────── */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-md
                       hover:bg-surface-light transition-colors duration-200"
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </nav>
      </motion.header>

      {/* ── Mobile Dropdown ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="
              fixed top-[72px] left-0 right-0 z-40
              glass border-b border-accent/10
              px-6 py-6 md:hidden
            "
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map(({ label, to }, i) => (
                <motion.li
                  key={to}
                  custom={i}
                  variants={linkItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <ScrollLink
                    to={to}
                    smooth
                    duration={600}
                    offset={-72}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      flex items-center gap-3 w-full px-3 py-3 rounded-lg
                      font-sans text-sm font-medium cursor-pointer
                      transition-all duration-200
                      ${activeSection === to
                        ? 'text-accent-light bg-accent/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
                      }
                    `}
                  >
                    {/* Dot indicator */}
                    <span className={`
                      w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200
                      ${activeSection === to ? 'bg-accent' : 'bg-muted/40'}
                    `} />
                    {label}
                    {activeSection === to && (
                      <span className="ml-auto text-accent text-xs font-mono">—</span>
                    )}
                  </ScrollLink>
                </motion.li>
              ))}

              {/* Download Resume CTA */}
              <motion.li
                custom={NAV_LINKS.length}
                variants={linkItemVariants}
                initial="hidden"
                animate="visible"
              >
                <a
                  href="/resume.pdf"
                  download
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex items-center justify-center gap-2 w-full mt-2 px-4 py-2.5 rounded-lg
                    border border-accent/50 text-accent-light text-sm font-medium
                    hover:bg-accent/10 hover:border-accent
                    transition-all duration-300
                  "
                >
                  <span className="text-accent text-xs">↓</span>
                  Download Resume
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
