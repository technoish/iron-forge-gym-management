import { Suspense, lazy, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiUser, FiActivity, FiCreditCard, FiLock, FiShield, FiCalendar, FiClock } from 'react-icons/fi'
import PageHero from '../../components/ui/PageHero'
import { PageLoader } from '../../components/ui/Loader'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/helpers'

const ProfileForm = lazy(() => import('../../components/dashboard/ProfileForm'))
const BMITracker = lazy(() => import('../../components/dashboard/BMITracker'))
const MembershipPanel = lazy(() => import('../../components/dashboard/MembershipPanel'))

const TABS = [
  { key: 'profile', label: 'Profile', icon: FiUser },
  { key: 'bmi', label: 'BMI Tracker', icon: FiActivity },
  { key: 'membership', label: 'Membership', icon: FiCreditCard },
]

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <>
      <PageHero
        eyebrow="Your Account"
        title={`Welcome back, ${user?.first_name || user?.username}`}
        description="Manage your profile, track your BMI, and browse membership plans."
        crumb="Dashboard"
      />

      <section className="py-24 sm:py-28">
        <div className="container-app grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <div className="h-fit space-y-6 lg:sticky lg:top-28">
            <div className="card-surface p-7">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 font-display text-xl font-bold text-primary">
                  {(user?.first_name?.[0] || user?.username?.[0] || '?').toUpperCase()}
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-secondary dark:text-white">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-primary">
                    <FiShield size={11} /> {user?.role}
                  </span>
                </div>
              </div>

              <dl className="mt-6 space-y-3 border-t border-secondary/10 pt-5 text-sm dark:border-white/10">
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Username</dt>
                  <dd className="font-medium text-secondary dark:text-white">{user?.username}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Email</dt>
                  <dd className="max-w-[160px] truncate font-medium text-secondary dark:text-white">{user?.email}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <FiCalendar size={13} /> Member since
                  </dt>
                  <dd className="font-medium text-secondary dark:text-white">{formatDate(user?.created_at)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <FiClock size={13} /> Profile updated
                  </dt>
                  <dd className="font-medium text-secondary dark:text-white">{formatDate(user?.updated_at)}</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-col gap-2 border-t border-secondary/10 pt-5 dark:border-white/10">
                <Link
                  to="/change-password"
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300"
                >
                  <FiLock size={15} /> Change password
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300"
                  >
                    <FiShield size={15} /> Go to admin panel
                  </Link>
                )}
              </div>
            </div>

            {/* Tab nav */}
            <nav className="card-surface flex flex-row gap-1 p-2 lg:flex-col" aria-label="Dashboard sections">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  aria-current={activeTab === tab.key ? 'page' : undefined}
                  className={`flex flex-1 items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-colors lg:flex-none ${
                    activeTab === tab.key
                      ? 'bg-primary text-white'
                      : 'text-slate-600 hover:bg-secondary/5 dark:text-slate-300 dark:hover:bg-white/5'
                  }`}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab content */}
          <div>
            <Suspense fallback={<PageLoader />}>
              {activeTab === 'profile' && <ProfileForm />}
              {activeTab === 'bmi' && <BMITracker />}
              {activeTab === 'membership' && <MembershipPanel />}
            </Suspense>
          </div>
        </div>
      </section>
    </>
  )
}
