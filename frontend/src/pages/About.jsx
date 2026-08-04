import { motion } from 'framer-motion'
import { FiTarget, FiEye, FiClock } from 'react-icons/fi'
import PageHero from '../components/ui/PageHero'
import SectionTitle from '../components/ui/SectionTitle'
import { EQUIPMENT, OPENING_HOURS } from '../constants/data'

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About IronForge"
        title="Built by lifters, for people who actually show up"
        description="IronForge opened in 2013 with one rule: every member gets a real program, not a generic template."
        crumb="About"
      />

      {/* Story */}
      <section className="py-24 sm:py-28">
        <div className="container-app grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000&auto=format&fit=crop"
              alt="Coach spotting a member during a barbell squat at IronForge"
              className="aspect-[4/5] w-full rounded-2xl object-cover shadow-soft"
            />
            <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-primary p-6 text-white shadow-glow sm:block">
              <p className="font-display text-3xl font-extrabold">12+</p>
              <p className="text-xs uppercase tracking-wide text-primary-50">Years of coaching</p>
            </div>
          </motion.div>

          <div>
            <SectionTitle
              align="left"
              eyebrow="Our Story"
              title="A gym that started as a garage, not a franchise plan"
              description="IronForge began as a single squat rack in a converted warehouse, run by a powerlifting coach who was tired of watching people get hurt on bad programming. Twelve years later, the equipment list has grown, but the standard hasn't changed: every plan is built by a certified coach who knows your name."
            />
            <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Today we run four coaching disciplines under one roof — strength, conditioning, functional fitness, and mobility — so members never have to leave the building to train a full, balanced week.
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="bg-white py-24 dark:bg-secondary-900/40 sm:py-28">
        <div className="container-app grid grid-cols-1 gap-6 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="card-surface p-8"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FiTarget size={22} />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold text-secondary dark:text-white">Our Mission</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Give every member — beginner or competitive athlete — a coach-built program, an honest progress log, and equipment that&rsquo;s never a bottleneck to training hard.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-surface p-8"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <FiEye size={22} />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold text-secondary dark:text-white">Our Vision</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              To be the gym Austin trusts first — the one people recommend not for the equipment, but for how much their coach actually knows about their training.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Equipment showcase */}
      <section className="py-24 sm:py-28">
        <div className="container-app">
          <SectionTitle
            eyebrow="The Floor"
            title="Four zones, one membership"
            description="Every plan includes full access to all four training zones — no add-on fees for the rig or the recovery bay."
          />

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {EQUIPMENT.map((zone, i) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative h-64 overflow-hidden rounded-2xl"
              >
                <img
                  src={zone.image}
                  alt={zone.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-950/90 via-secondary-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-lg font-semibold text-white">{zone.name}</h3>
                  <p className="mt-1 text-sm text-slate-300">{zone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Opening hours */}
      <section className="bg-white py-24 dark:bg-secondary-900/40 sm:py-28">
        <div className="container-app grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <SectionTitle
            align="left"
            eyebrow="Opening Hours"
            title="Open before work, open after"
            description="The floor is staffed and open across every listed window below — extended hours mean training never has to compete with your schedule."
          />
          <div className="card-surface divide-y divide-secondary/10 p-2 dark:divide-white/10">
            {OPENING_HOURS.map((item) => (
              <div key={item.day} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="flex items-center gap-3 text-sm font-medium text-secondary dark:text-white">
                  <FiClock className="text-primary" size={16} />
                  {item.day}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{item.hours}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
