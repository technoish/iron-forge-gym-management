import { memo } from 'react'
import { motion } from 'framer-motion'
import { FiInstagram, FiFacebook, FiLinkedin } from 'react-icons/fi'

function TrainerCard({ trainer, index = 0, onViewProfile }) {
  const socialLinks = [
    trainer.social?.instagram && { Icon: FiInstagram, href: trainer.social.instagram, label: 'Instagram' },
    trainer.social?.facebook && { Icon: FiFacebook, href: trainer.social.facebook, label: 'Facebook' },
    trainer.social?.linkedin && { Icon: FiLinkedin, href: trainer.social.linkedin, label: 'LinkedIn' },
  ].filter(Boolean)

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group relative overflow-hidden rounded-xl2 shadow-card"
    >
      <div className="relative h-80 overflow-hidden">
        <img
          src={trainer.image}
          alt={trainer.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-950 via-secondary-950/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="font-display text-lg font-semibold">{trainer.name}</p>
          <p className="text-sm text-primary-400">{trainer.specialization}</p>
          <p className="text-xs text-slate-300">{trainer.experience}</p>

          <div className="mt-3 flex items-center justify-between opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <div className="flex gap-2">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${trainer.name} on ${label}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-primary"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onViewProfile?.(trainer)}
              className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-secondary transition-colors hover:bg-primary hover:text-white"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default memo(TrainerCard)
