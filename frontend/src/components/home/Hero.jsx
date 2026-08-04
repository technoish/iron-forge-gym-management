import { motion } from 'framer-motion'
import { FiPlay, FiArrowDown } from 'react-icons/fi'
import Button from '../ui/Button'

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-secondary-950">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2000&auto=format&fit=crop"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-grid-fade" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-950 via-secondary-950/70 to-transparent" />
      </div>

      {/* Ambient floating accent */}
      <div className="pointer-events-none absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px] animate-floatSlow" aria-hidden="true" />

      <div className="container-app relative z-10 pt-28">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow text-primary-400"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-heartbeat" />
            Austin&rsquo;s Strength &amp; Conditioning Gym
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-5 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Train with
            <span className="relative ml-4 inline-block text-primary">
              intent
              <svg
                className="absolute -bottom-2 left-0 w-full text-primary/70"
                viewBox="0 0 200 12"
                fill="none"
                aria-hidden="true"
              >
                <path d="M2 9C40 2 160 2 198 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-slate-300"
          >
            No generic templates, no guesswork. Every member trains on a program a certified
            coach actually built for them — tracked, adjusted, and pushed week over week.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button to="/membership" variant="primary">
              Start Your Free Trial
            </Button>
            <Button href="#" variant="ghostLight">
              <FiPlay size={16} /> Watch the Tour
            </Button>
          </motion.div>
        </div>
      </div>

     
      <div className="absolute inset-x-0 bottom-0 z-10">
        <PulseDivider />
      </div>

      <motion.a
        href="#stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium uppercase tracking-widest text-slate-400 sm:flex"
      >
        Scroll
        <FiArrowDown className="animate-bounce" />
      </motion.a>
    </section>
  )
}

function PulseDivider() {
  return (
    <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="h-16 w-full sm:h-20" aria-hidden="true">
      <path d="M0 40 H420 L450 40 L465 10 L485 68 L505 40 L525 40 H1200" fill="none" stroke="#EF4444" strokeWidth="3" className="text-primary" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M0 55 H1200" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
    </svg>
  )
}
