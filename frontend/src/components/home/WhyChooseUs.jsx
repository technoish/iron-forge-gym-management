import { motion } from 'framer-motion'
import { WHY_CHOOSE_US } from '../../constants/data'
import SectionTitle from '../ui/SectionTitle'
import Icon from '../ui/IconMap'

export default function WhyChooseUs() {
  return (
    <section className="py-24 sm:py-28">
      <div className="container-app">
        <SectionTitle
          eyebrow="Why IronForge"
          title="Coaching that actually adapts to you"
          description="Most gyms sell you a floor and a locker. We build a system around your progress — here's what that looks like day to day."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="card-surface group p-7"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                <Icon name={item.icon} size={22} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-secondary dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
