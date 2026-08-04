import { motion } from 'framer-motion'


export default function SectionTitle({ eyebrow, title, description, align = 'center', light = false }) {
  const alignment = align === 'left' ? 'items-start text-left' : 'items-center text-center'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`flex flex-col ${alignment} gap-3 max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}
    >
      {eyebrow && (
        <span className={`eyebrow ${light ? 'text-primary-400' : 'text-primary'}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-heartbeat" />
          {eyebrow}
        </span>
      )}
      <h2 className={`text-3xl sm:text-4xl md:text-[2.6rem] font-bold leading-tight tracking-tight ${light ? 'text-white' : 'text-secondary dark:text-white'}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-base leading-relaxed ${light ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
          {description}
        </p>
      )}
    </motion.div>
  )
}
