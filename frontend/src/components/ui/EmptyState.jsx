import { motion } from 'framer-motion'
import { FiInbox } from 'react-icons/fi'


export default function EmptyState({ title = 'Nothing here yet', message = 'Check back soon.' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-secondary/15 py-20 text-center dark:border-white/15"
    >
      <FiInbox size={28} className="text-slate-400" />
      <div>
        <p className="font-display text-base font-semibold text-secondary dark:text-white">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{message}</p>
      </div>
    </motion.div>
  )
}
