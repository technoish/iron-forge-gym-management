import { NavLink } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMapPin, FiPhone, FiMail } from 'react-icons/fi'
import { NAV_LINKS, OPENING_HOURS } from '../../constants/data'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-secondary-950 text-slate-300">
      <div className="container-app grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <NavLink to="/" className="flex items-center gap-2 font-display text-xl font-extrabold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">IF</span>
            Iron<span className="text-primary">Forge</span>
          </NavLink>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            A strength and conditioning gym built around real coaching, honest programming, and a floor that never feels crowded.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { icon: FiInstagram, label: 'Instagram' },
              { icon: FiTwitter, label: 'Twitter' },
              { icon: FiFacebook, label: 'Facebook' },
              { icon: FiYoutube, label: 'YouTube' },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition-colors hover:border-primary hover:text-primary"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} className="text-slate-400 transition-colors hover:text-primary">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Hours</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {OPENING_HOURS.map((item) => (
              <li key={item.day} className="flex justify-between gap-4 text-slate-400">
                <span>{item.day}</span>
                <span className="text-slate-300">{item.hours}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Visit Us</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <FiMapPin className="mt-0.5 shrink-0 text-primary" size={16} />
              482 Foundry Street, Unit 3, Austin, TX 78701
            </li>
            <li className="flex items-center gap-3">
              <FiPhone className="shrink-0 text-primary" size={16} />
              (512) 555-0148
            </li>
            <li className="flex items-center gap-3">
              <FiMail className="shrink-0 text-primary" size={16} />
              hello@ironforge.gym
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-app flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-500 sm:flex-row">
          <p>© {year} IronForge Gym. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
