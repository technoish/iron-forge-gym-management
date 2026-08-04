import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'


export default function AuthLayout({ eyebrow, title, description, children, footer }) {
  return (
    <section className="relative overflow-hidden bg-secondary-950 py-28 sm:py-32">
      <div
        className="pointer-events-none absolute -right-24 -top-16 h-72 w-72 rounded-full bg-primary/20 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-primary/10 blur-[110px]"
        aria-hidden="true"
      />
      <div className="container-app relative flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-display text-xl font-extrabold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">IF</span>
            <span className="text-white">
              Iron<span className="text-primary">Forge</span>
            </span>
          </Link>

          <div className="card-surface bg-white p-8 dark:bg-secondary-900">
            {eyebrow && (
              <span className="eyebrow text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-heartbeat" />
                {eyebrow}
              </span>
            )}
            <h1 className="mt-3 font-display text-2xl font-bold text-secondary dark:text-white">{title}</h1>
            {description && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>}

            <div className="mt-6">{children}</div>
          </div>

          {footer && <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>}
        </motion.div>
      </div>
    </section>
  )
}
