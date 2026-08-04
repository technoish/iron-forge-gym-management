import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiSend } from 'react-icons/fi'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'
import { OPENING_HOURS } from '../constants/data'
import { sendContactMessage } from '../services/contactService'
import { isValidEmail } from '../utils/helpers'

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm()

  const onSubmit = async (values) => {
    setFormError('')
    setIsSubmitting(true)
    try {
      await sendContactMessage(values)
      toast.success("Message sent — we'll reply within one business day.")
      reset()
    } catch (err) {
      setFormError(err.message)
      Object.entries(err.fieldErrors || {}).forEach(([field, messages]) => {
        const message = Array.isArray(messages) ? messages[0] : messages
        if (['name', 'email', 'phone', 'message'].includes(field)) {
          setError(field, { type: 'server', message })
        }
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Get In Touch"
        title="Come see the floor for yourself"
        description="Book a tour, ask about a plan, or just come say hi at the front desk — we're easy to reach."
        crumb="Contact"
      />

      <section className="py-24 sm:py-28">
        <div className="container-app grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.85fr]">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="card-surface p-8"
          >
            <h2 className="font-display text-2xl font-bold text-secondary dark:text-white">Send a message</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Fields marked with * are required.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
              {formError && (
                <div role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <TextField
                  label="Full Name *"
                  error={errors.name}
                  inputProps={register('name', { required: 'Please enter your name' })}
                />
                <TextField
                  label="Email *"
                  type="email"
                  error={errors.email}
                  inputProps={register('email', {
                    required: 'Please enter your email',
                    validate: (v) => isValidEmail(v) || 'Enter a valid email address',
                  })}
                />
              </div>

              <TextField
                label="Phone (optional)"
                type="tel"
                error={errors.phone}
                inputProps={register('phone')}
              />

              <div>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  What are you interested in?
                </span>
                <select
                  {...register('subject')}
                  className="w-full rounded-xl border border-secondary/10 bg-white px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary dark:border-white/10 dark:bg-secondary-900 dark:text-white"
                >
                  <option>General Inquiry</option>
                  <option>Membership Plans</option>
                  <option>Personal Training</option>
                  <option>Class Schedule</option>
                  <option>Facility Tour</option>
                </select>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Message *
                </span>
                <textarea
                  rows={5}
                  {...register('message', { required: 'Please add a short message', minLength: { value: 10, message: 'Message should be at least 10 characters' } })}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-secondary outline-none transition-colors dark:bg-secondary-900 dark:text-white ${
                    errors.message ? 'border-red-400' : 'border-secondary/10 focus:border-primary dark:border-white/10'
                  }`}
                  placeholder="Tell us what you're looking for…"
                />
                {errors.message && <span className="mt-1 block text-xs text-red-500">{errors.message.message}</span>}
              </label>

              <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : (
                  <>
                    Send Message <FiSend size={16} />
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div className="card-surface p-7">
              <h3 className="font-display text-lg font-semibold text-secondary dark:text-white">Contact Information</h3>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <FiMapPin className="mt-0.5 shrink-0 text-primary" size={18} />
                  <span className="text-slate-600 dark:text-slate-300">482 Foundry Street, Unit 3, Austin, TX 78701</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiPhone className="shrink-0 text-primary" size={18} />
                  <a href="tel:+15125550148" className="text-slate-600 hover:text-primary dark:text-slate-300">(512) 555-0148</a>
                </li>
                <li className="flex items-center gap-3">
                  <FiMail className="shrink-0 text-primary" size={18} />
                  <a href="mailto:hello@ironforge.gym" className="text-slate-600 hover:text-primary dark:text-slate-300">hello@ironforge.gym</a>
                </li>
              </ul>
              <div className="mt-5 flex gap-2 border-t border-secondary/10 pt-5 dark:border-white/10">
                {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="Social profile"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/5 text-secondary transition-colors hover:bg-primary hover:text-white dark:bg-white/10 dark:text-white"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            <div className="card-surface p-7">
              <h3 className="font-display text-lg font-semibold text-secondary dark:text-white">Business Hours</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {OPENING_HOURS.map((item) => (
                  <li key={item.day} className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>{item.day}</span>
                    <span className="font-medium text-secondary dark:text-white">{item.hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map */}
            <div className="card-surface overflow-hidden">
              <iframe
                title="IronForge Gym location map"
                src="https://www.google.com/maps?q=Austin,TX&output=embed"
                width="100%"
                height="240"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

function TextField({ label, type = 'text', error, inputProps }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <input
        type={type}
        {...inputProps}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-secondary outline-none transition-colors dark:bg-secondary-900 dark:text-white ${
          error ? 'border-red-400' : 'border-secondary/10 focus:border-primary dark:border-white/10'
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error.message}</span>}
    </label>
  )
}
