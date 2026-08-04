import { Link } from 'react-router-dom'
import { FiUsers, FiCreditCard, FiLayers, FiImage, FiStar, FiMail, FiUserCheck, FiArrowRight } from 'react-icons/fi'
import ErrorState from '../../components/ui/ErrorState'
import { useFetch } from '../../hooks/useFetch'
import { getDashboardStats } from '../../services/dashboardStatsService'

const CARDS = [
  { key: 'total_members', label: 'Members', icon: FiUserCheck, to: null },
  { key: 'active_trainers', label: 'Active Trainers', sub: (s) => `of ${s.total_trainers} total`, icon: FiUsers, to: '/admin/trainers' },
  { key: 'total_membership_plans', label: 'Membership Plans', icon: FiCreditCard, to: '/admin/plans' },
  { key: 'total_services', label: 'Services', icon: FiLayers, to: '/admin/services' },
  { key: 'total_gallery_images', label: 'Gallery Images', icon: FiImage, to: '/admin/gallery' },
  { key: 'total_testimonials', label: 'Testimonials', icon: FiStar, to: '/admin/testimonials' },
  { key: 'unread_contact_messages', label: 'Unread Messages', sub: (s) => `of ${s.total_contact_messages} total`, icon: FiMail, to: '/admin/messages', highlight: true },
]

export default function AdminOverview() {
  const { data: stats, isLoading, isError, refetch } = useFetch(() => getDashboardStats(), [])

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-secondary dark:text-white">Overview</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">A snapshot of everything on the site right now.</p>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="card-surface h-28 animate-pulse" />
          ))}
        </div>
      )}

      {isError && <ErrorState message="We couldn't load dashboard stats right now." onRetry={refetch} />}

      {!isLoading && !isError && stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card) => {
            const value = stats[card.key]
            const content = (
              <div
                className={`card-surface flex flex-col justify-between p-5 transition-transform ${card.to ? 'hover:-translate-y-0.5' : ''} ${
                  card.highlight && value > 0 ? 'ring-1 ring-primary/40' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.highlight && value > 0 ? 'bg-primary/15 text-primary' : 'bg-secondary/5 text-secondary dark:bg-white/10 dark:text-white'}`}>
                    <card.icon size={18} />
                  </span>
                  {card.to && <FiArrowRight size={14} className="text-slate-300" />}
                </div>
                <div className="mt-4">
                  <p className="font-display text-3xl font-extrabold text-secondary dark:text-white">{value}</p>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
                  {card.sub && <p className="mt-0.5 text-xs text-slate-400">{card.sub(stats)}</p>}
                </div>
              </div>
            )
            return card.to ? (
              <Link key={card.key} to={card.to}>
                {content}
              </Link>
            ) : (
              <div key={card.key}>{content}</div>
            )
          })}
        </div>
      )}
    </div>
  )
}
