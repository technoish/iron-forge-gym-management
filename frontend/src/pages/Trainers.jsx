import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiInstagram, FiFacebook, FiLinkedin, FiMail, FiPhone } from 'react-icons/fi'
import PageHero from '../components/ui/PageHero'
import SectionTitle from '../components/ui/SectionTitle'
import TrainerCard from '../components/ui/TrainerCard'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonGrid } from '../components/ui/Loader'
import Button from '../components/ui/Button'
import { useFetch } from '../hooks/useFetch'
import { getTrainers } from '../services/trainerService'

export default function Trainers() {
  const [selected, setSelected] = useState(null)
  const { data: trainers, isLoading, isError, refetch } = useFetch(() => getTrainers(), [])

  const socialLinks = selected
    ? [
        selected.social?.instagram && { Icon: FiInstagram, href: selected.social.instagram, label: 'Instagram' },
        selected.social?.facebook && { Icon: FiFacebook, href: selected.social.facebook, label: 'Facebook' },
        selected.social?.linkedin && { Icon: FiLinkedin, href: selected.social.linkedin, label: 'LinkedIn' },
      ].filter(Boolean)
    : []

  return (
    <>
      <PageHero
        eyebrow="Our Coaches"
        title="Meet the team behind every program"
        description="Certified, hands-on, and genuinely invested in your numbers going up."
        crumb="Trainers"
      />

      <section className="py-24 sm:py-28">
        <div className="container-app">
          <SectionTitle eyebrow="The Team" title="Certified coaches across every discipline" />

          <div className="mt-14">
            {isLoading && (
              <SkeletonGrid count={8} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" />
            )}

            {isError && <ErrorState message="We couldn't load our trainers right now." onRetry={refetch} />}

            {!isLoading && !isError && trainers.length === 0 && (
              <EmptyState title="No trainers listed yet" message="Check back soon — our coaching roster is growing." />
            )}

            {!isLoading && !isError && trainers.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {trainers.map((trainer, i) => (
                  <TrainerCard key={trainer.id} trainer={trainer} index={i} onViewProfile={setSelected} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-secondary-950/70 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.name} profile`}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-soft dark:bg-secondary-900 sm:grid-cols-2"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close profile"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-secondary shadow-soft"
              >
                <FiX size={18} />
              </button>
              <img src={selected.image} alt={selected.name} className="h-64 w-full object-cover sm:h-full" />
              <div className="p-7">
                <h3 className="font-display text-2xl font-bold text-secondary dark:text-white">{selected.name}</h3>
                <p className="mt-1 text-sm font-semibold text-primary">{selected.specialization}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selected.experience}</p>
                {selected.bio && (
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selected.bio}</p>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-2">
                    {socialLinks.map(({ Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${selected.name} on ${label}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/5 text-secondary transition-colors hover:bg-primary hover:text-white dark:bg-white/10 dark:text-white"
                      >
                        <Icon size={15} />
                      </a>
                    ))}
                  </div>

                  {(selected.email || selected.phone) && (
                    <Button
                      href={selected.email ? `mailto:${selected.email}` : `tel:${selected.phone}`}
                      variant="primary"
                      className="!py-2.5 !px-4 text-xs"
                    >
                      {selected.email ? <FiMail size={14} /> : <FiPhone size={14} />} Contact
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
