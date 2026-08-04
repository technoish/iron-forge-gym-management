import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'
import PageHero from '../components/ui/PageHero'
import ServiceCard from '../components/ui/ServiceCard'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonGrid } from '../components/ui/Loader'
import { useFetch } from '../hooks/useFetch'
import { getServices } from '../services/servicesService'


const ICON_CATEGORY = {
  dumbbell: 'Strength',
  fire: 'Strength',
  heartbeat: 'Cardio',
  music: 'Cardio',
  lotus: 'Mind & Body',
  user: 'Coaching',
  apple: 'Coaching',
}

export default function Services() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const { data: services, isLoading, isError, refetch } = useFetch(() => getServices(), [])

  const filters = useMemo(() => {
    if (!services) return ['All']
    const present = new Set(services.map((s) => ICON_CATEGORY[s.icon]).filter(Boolean))
    return ['All', ...present]
  }, [services])

  const filtered = useMemo(() => {
    if (!services) return []
    return services.filter((service) => {
      const matchesFilter = activeFilter === 'All' || ICON_CATEGORY[service.icon] === activeFilter
      const matchesQuery = service.title.toLowerCase().includes(query.toLowerCase())
      return matchesFilter && matchesQuery
    })
  }, [services, query, activeFilter])

  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Programs led by certified coaches"
        description="Every program below is led by a certified coach and scales from first-timer to competitive athlete."
        crumb="Services"
      />

      <section className="py-24 sm:py-28">
        <div className="container-app">
          {/* Search + filter bar */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services…"
                aria-label="Search services"
                className="w-full rounded-full border border-secondary/10 bg-white py-3 pl-11 pr-4 text-sm text-secondary placeholder:text-slate-400 focus:border-primary dark:border-white/10 dark:bg-secondary-900 dark:text-white"
              />
            </div>

            {filters.length > 1 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter services by category">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    aria-pressed={activeFilter === filter}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                      activeFilter === filter
                        ? 'bg-primary text-white'
                        : 'bg-secondary/5 text-slate-600 hover:bg-secondary/10 dark:bg-white/5 dark:text-slate-300'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results */}
          <div className="mt-12">
            {isLoading && <SkeletonGrid count={6} className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3" />}

            {isError && <ErrorState message="We couldn't load our services right now." onRetry={refetch} />}

            {!isLoading && !isError && filtered.length === 0 && (
              services.length === 0 ? (
                <EmptyState title="No services yet" message="Check back soon — new programs are added regularly." />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border border-dashed border-secondary/15 py-16 text-center dark:border-white/15"
                >
                  <p className="font-display text-lg font-semibold text-secondary dark:text-white">No services match that search</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try a different keyword or clear your filter.</p>
                </motion.div>
              )
            )}

            {!isLoading && !isError && filtered.length > 0 && (
              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((service, i) => (
                  <div key={service.id} id={service.id}>
                    <ServiceCard service={service} index={i} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
