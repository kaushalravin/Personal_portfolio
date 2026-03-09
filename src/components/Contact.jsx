import { Suspense, lazy, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

const GlobeScene = lazy(() => import('./three/GlobeScene'));
const EMAIL_LOCK_KEY = 'portfolio_contact_last_sent_at';
const EMAIL_LOCK_DURATION_MS = 24 * 60 * 60 * 1000;

/* ─────────────────────────────────────────────────────────────────
   EmailJS credentials
   1. Go to https://www.emailjs.com → My Account → API Keys → Public Key
   2. Create a service (Gmail) → note the Service ID
  3. Create a template with variables: {{name}}, {{email}}, {{message}}
      and set "To Email" to kaushal.at.official@gmail.com
   4. Replace the three strings below with your real values.
──────────────────────────────────────────────────────────────────── */
const EJS_SERVICE  = import.meta.env.VITE_EJS_SERVICE;
const EJS_TEMPLATE = import.meta.env.VITE_EJS_TEMPLATE;
const EJS_PUBLIC   = import.meta.env.VITE_EJS_PUBLIC;

/* ─── Input field ────────────────────────────────────────────────── */
function Field({ label, name, type = 'text', textarea = false, value, onChange }) {
  const base = `
    w-full bg-white/5 border border-white/10 rounded-xl
    text-white placeholder-white/25 font-medium text-sm
    px-4 py-3.5 outline-none
    focus:border-accent/60 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]
    transition-all duration-200
  `;
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent-light/70">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          rows={5}
          required
          value={value}
          onChange={onChange}
          placeholder={`Your ${label.toLowerCase()}...`}
          className={base + ' resize-none'}
        />
      ) : (
        <input
          type={type}
          name={name}
          required
          value={value}
          onChange={onChange}
          placeholder={`Your ${label.toLowerCase()}...`}
          className={base}
        />
      )}
    </div>
  );
}

/* ─── Contact form ───────────────────────────────────────────────── */
function ContactForm() {
  const formRef = useRef(null);
  const [fields, setFields]   = useState({ name: '', email: '', message: '' });
  const [status, setStatus]   = useState('idle'); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSent, setHasSent] = useState(() => {
    if (typeof window === 'undefined') return false;
    const lastSentAt = Number(window.localStorage.getItem(EMAIL_LOCK_KEY) || 0);
    return Date.now() - lastSentAt < EMAIL_LOCK_DURATION_MS;
  });

  function getEmailJsErrorMessage(error) {
    const text = error?.text || '';
    const status = error?.status;

    if (status === 412 && text.includes('insufficient authentication scopes')) {
      return 'Your EmailJS Gmail service needs to be reconnected with the required Google permissions.';
    }

    if (status === 400) {
      return 'Check your EmailJS service ID, template ID, and template variables.';
    }

    return 'Something went wrong. Please try again or email directly.';
  }

  function onChange(e) {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    if (hasSent) {
      setStatus('error');
      setErrorMessage('Only one message per day is allowed from this browser.');
      return;
    }

    const honeypot = formRef.current?.elements?.namedItem('website');
    if (honeypot?.value) {
      setStatus('error');
      setErrorMessage('Spam protection triggered.');
      return;
    }

    if (!EJS_SERVICE || !EJS_TEMPLATE || !EJS_PUBLIC) {
      setStatus('error');
      setErrorMessage('Email service is not configured correctly.');
      return;
    }

    setStatus('sending');
    try {
      await emailjs.sendForm(EJS_SERVICE, EJS_TEMPLATE, formRef.current, {
        publicKey: EJS_PUBLIC,
      });
      setStatus('success');
      window.localStorage.setItem(EMAIL_LOCK_KEY, String(Date.now()));
      setHasSent(true);
      setFields({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('EmailJS send failed:', error);
      setStatus('error');
      setErrorMessage(getEmailJsErrorMessage(error));
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <Field label="Name"    name="name"    value={fields.name}    onChange={onChange} />
      <Field label="Email"   name="email"   value={fields.email}   onChange={onChange} type="email" />
      <Field label="Message" name="message" value={fields.message} onChange={onChange} textarea />

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={status === 'sending' || hasSent}
        whileHover={{ scale: status === 'sending' || hasSent ? 1 : 1.03 }}
        whileTap={{   scale: status === 'sending' || hasSent ? 1 : 0.97 }}
        className={`
          relative w-full py-3.5 rounded-xl font-bold text-sm tracking-wide
          transition-all duration-300 overflow-hidden
          ${status === 'sending' || hasSent
            ? 'bg-accent/40 text-white/50 cursor-not-allowed'
            : 'bg-accent hover:bg-accent-glow text-white shadow-glow-sm hover:shadow-glow-md'
          }
        `}
      >
        {status === 'sending' ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
            />
            Sending…
          </span>
        ) : hasSent ? 'Try Again Tomorrow' : 'Send Message →'}
      </motion.button>

      <p className="text-center text-white/35 text-xs font-mono">
        One message per day per browser to reduce spam.
      </p>

      {/* Status feedback */}
      {status === 'success' && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-emerald-400 text-sm font-semibold"
        >
          ✓ Message sent! I&apos;ll get back to you soon.
        </motion.p>
      )}
      {status === 'error' && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-400 text-sm font-semibold"
        >
          ✕ {errorMessage || 'Something went wrong. Please try again or email directly.'}
        </motion.p>
      )}

    </form>
  );
}

/* ─── Section ────────────────────────────────────────────────────── */
export default function Contact() {
  return (
    <section id="contact" className="section-container">

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
          Get In Touch
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
          Contact <span className="text-gradient">Me</span>
        </h2>
        <p className="text-white/50 mt-3 text-sm leading-relaxed max-w-md">
          Have a project, idea, or just want to say hi? Drop a message.
        </p>
      </motion.div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-2 gap-10 items-center">

        {/* ── Left: Form ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/8 p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(10,10,15,0.96) 70%)',
            boxShadow: '0 4px 40px -8px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.04) inset',
          }}
        >
          {/* Card glint */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent rounded-t-2xl" />

          <div className="mb-6">
            <h3 className="text-white font-black text-xl mb-1">Send a message</h3>
            <p className="text-white/40 text-xs font-mono">
              → kaushal.at.official@gmail.com
            </p>
          </div>

          <ContactForm />

          {/* Direct email fallback */}
          <div className="mt-6 pt-5 border-t border-white/8 flex items-center gap-3">
            <span className="text-white/30 text-xs font-mono">or email directly</span>
            <a
              href="mailto:kaushal.at.official@gmail.com"
              className="text-accent-light text-xs font-mono hover:text-white transition-colors duration-200"
            >
              kaushal.at.official@gmail.com
            </a>
          </div>
        </motion.div>

        {/* ── Right: Globe ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex flex-col items-center justify-center"
        >
          {/* Globe canvas */}
          <div className="w-full aspect-square max-w-[460px]">
            <Suspense fallback={null}>
              <GlobeScene />
            </Suspense>
          </div>

          {/* Caption below globe */}
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent/50 mt-2">
            Open to opportunities · Remote friendly
          </p>
        </motion.div>

      </div>
    </section>
  );
}
