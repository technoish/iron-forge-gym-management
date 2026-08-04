import { memo } from 'react'
import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import Button from './Button'

function PricingCard({ plan, index = 0 }) {
  const isHighlighted = plan.highlighted

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className={`relative flex flex-col rounded-xl2 p-8 transition-shadow duration-300 ${
        isHighlighted
          ? 'bg-secondary text-white shadow-glow ring-1 ring-primary/40'
          : 'card-surface text-secondary dark:text-white'
      }`}
    >
      {plan.tag && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-soft">
          {plan.tag}
        </span>
      )}

      <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-display text-4xl font-extrabold">${plan.price}</span>
        <span className={`text-sm ${isHighlighted ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
          /{plan.duration.replace('per ', '')}
        </span>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <FiCheck
              className={`mt-0.5 shrink-0 ${isHighlighted ? 'text-primary-400' : 'text-primary'}`}
              size={16}
            />
            <span className={isHighlighted ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'}>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        to="/contact"
        variant={isHighlighted ? 'primary' : 'secondary'}
        className={`mt-8 w-full ${!isHighlighted ? '' : ''}`}
      >
        Join Now
      </Button>
    </motion.div>
  )
}

export default memo(PricingCard)
