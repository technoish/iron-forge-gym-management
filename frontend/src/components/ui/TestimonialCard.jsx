import { memo } from 'react'
import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import { BsQuote } from 'react-icons/bs'

function TestimonialCard({ testimonial, index = 0 }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="card-surface flex h-full flex-col p-7"
    >
      <BsQuote className="mb-3 text-3xl text-primary/30" aria-hidden="true" />
      <blockquote className="flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        “{testimonial.quote}”
      </blockquote>
      <div className="mt-5 flex items-center gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar
            key={i}
            size={14}
            className={i < testimonial.rating ? 'fill-accent text-accent' : 'text-slate-300 dark:text-slate-600'}
          />
        ))}
      </div>
      <figcaption className="mt-4 flex items-center gap-3">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt=""
            loading="lazy"
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
            {testimonial.name?.[0]?.toUpperCase() || '?'}
          </span>
        )}
        <div>
          <p className="font-display text-sm font-semibold text-secondary dark:text-white">{testimonial.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role}</p>
        </div>
      </figcaption>
    </motion.figure>
  )
}

export default memo(TestimonialCard)
