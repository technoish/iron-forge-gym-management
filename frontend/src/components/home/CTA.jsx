import { motion } from 'framer-motion'
import Button from '../ui/Button'

export default function CTA() {
  return (
    <section className="px-5 pb-24 sm:px-8 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="container-app relative overflow-hidden rounded-[2rem] bg-secondary-950 px-8 py-16 text-center sm:px-16 sm:py-20"
      >
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/30 blur-[100px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-accent/20 blur-[100px]" aria-hidden="true" />

        <div className="relative">
          <span className="eyebrow text-primary-400">
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-heartbeat" />
            First Session On Us
          </span>
          <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl font-bold text-white sm:text-4xl">
            Your first week is free. Bring your ID, we&rsquo;ll bring the plan.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-slate-300">
            No pressure, no upsell at the door — just a floor tour, a movement assessment, and a program to try.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button to="/membership" variant="primary">Claim Free Week</Button>
            <Button to="/contact" variant="ghostLight">Talk to a Coach</Button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
