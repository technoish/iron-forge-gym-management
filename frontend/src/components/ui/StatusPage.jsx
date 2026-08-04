import { motion } from 'framer-motion'
import Button from './Button'

export default function StatusPage({ code, title, message, actions }) {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-secondary-950 px-6 text-center">
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="font-display text-8xl font-extrabold text-primary"
      >
        {code}
      </motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 font-display text-2xl font-bold text-white"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-2 max-w-sm text-slate-400"
      >
        {message}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 flex gap-3"
      >
        {actions || <Button to="/" variant="primary">Back to Home</Button>}
      </motion.div>
    </section>
  )
}
