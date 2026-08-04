import { motion } from 'framer-motion'
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'


export default function ErrorState({
  title = 'Something went wrong',
  message = "We couldn't load this content. Please try again.",
  onRetry,
  compact = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="alert"
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-red-300/60 bg-red-50/60 text-center dark:border-red-500/30 dark:bg-red-500/5 ${
        compact ? 'py-10' : 'py-20'
      }`}
    >
      <FiAlertTriangle size={28} className="text-red-500" />
      <div>
        <p className="font-display text-base font-semibold text-secondary dark:text-white">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary-800 dark:bg-white dark:text-secondary dark:hover:bg-slate-200"
        >
          <FiRefreshCw size={14} /> Retry
        </button>
      )}
    </motion.div>
  )
}
