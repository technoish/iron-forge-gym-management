import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'


export default function PageHero({ eyebrow, title, description, crumb }) {
  return (
    <section className="relative overflow-hidden bg-secondary-950 pb-16 pt-32 sm:pb-20 sm:pt-40">
      <div className="pointer-events-none absolute -right-24 -top-16 h-72 w-72 rounded-full bg-primary/20 blur-[110px]" aria-hidden="true" />
      <div className="container-app relative">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-5 flex items-center gap-2 text-xs font-medium text-slate-400"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-primary-400">Home</Link>
          <FiChevronRight size={12} />
          <span className="text-slate-200">{crumb}</span>
        </motion.nav>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="eyebrow text-primary-400"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-heartbeat" />
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-3 max-w-2xl font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-4 max-w-xl text-slate-300"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  )
}
