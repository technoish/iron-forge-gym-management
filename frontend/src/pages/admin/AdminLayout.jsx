import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  FiGrid, FiUsers, FiCreditCard, FiLayers, FiImage, FiStar, FiMail, FiExternalLink, FiArrowLeft,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/admin', label: 'Overview', icon: FiGrid, end: true },
  { to: '/admin/trainers', label: 'Trainers', icon: FiUsers },
  { to: '/admin/plans', label: 'Membership Plans', icon: FiCreditCard },
  { to: '/admin/services', label: 'Services', icon: FiLayers },
  { to: '/admin/gallery', label: 'Gallery', icon: FiImage },
  { to: '/admin/testimonials', label: 'Testimonials', icon: FiStar },
  { to: '/admin/messages', label: 'Messages', icon: FiMail },
]

export default function AdminLayout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-secondary-950">
      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-secondary/10 bg-white dark:border-white/10 dark:bg-secondary-900 lg:flex">
          <Link to="/" className="flex items-center gap-2 px-6 py-6 font-display text-lg font-extrabold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm text-white">IF</span>
            <span className="text-secondary dark:text-white">
              Admin<span className="text-primary">Panel</span>
            </span>
          </Link>

          <nav className="flex-1 space-y-1 px-3">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-slate-600 hover:bg-secondary/5 dark:text-slate-300 dark:hover:bg-white/5'
                  }`
                }
              >
                <item.icon size={16} /> {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-secondary/10 p-4 dark:border-white/10">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-secondary/5 dark:text-slate-400 dark:hover:bg-white/5"
            >
              <FiArrowLeft size={15} /> Back to site
            </Link>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-secondary/10 bg-white/90 px-6 py-4 backdrop-blur dark:border-white/10 dark:bg-secondary-900/90 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">IronForge</p>
              <p className="font-display text-sm font-bold text-secondary dark:text-white">Admin Console</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary sm:flex"
              >
                View site <FiExternalLink size={13} />
              </a>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {(user?.first_name?.[0] || user?.username?.[0] || '?').toUpperCase()}
                </span>
                <span className="hidden text-sm font-medium text-secondary dark:text-white sm:inline">
                  {user?.first_name || user?.username}
                </span>
              </div>
            </div>
          </header>

          {/* Mobile/tablet nav — sidebar above is lg-only */}
          <nav className="scrollbar-none flex gap-1 overflow-x-auto border-b border-secondary/10 bg-white px-4 py-2 dark:border-white/10 dark:bg-secondary-900 lg:hidden">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-slate-600 hover:bg-secondary/5 dark:text-slate-300 dark:hover:bg-white/5'
                  }`
                }
              >
                <item.icon size={13} /> {item.label}
              </NavLink>
            ))}
          </nav>

          <main className="p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
