import { useMemo, useState } from 'react'
import PageHero from '../components/ui/PageHero'
import SectionTitle from '../components/ui/SectionTitle'
import PricingCard from '../components/ui/PricingCard'
import FAQAccordion from '../components/ui/FAQAccordion'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonGrid } from '../components/ui/Loader'
import { useFetch } from '../hooks/useFetch'
import { getPlans } from '../services/membershipService'
import { FAQS } from '../constants/data'

const DURATION_TABS = [
  { key: 'monthly', label: 'Monthly' },
  { key: 'quarterly', label: 'Quarterly' },
  { key: 'yearly', label: 'Yearly' },
]

export default function Membership() {
  const { data: plans, isLoading, isError, refetch } = useFetch(() => getPlans(), [])


  const availableDurations = useMemo(() => {
    if (!plans) return []
    return DURATION_TABS.filter((tab) => plans.some((p) => p.durationKey === tab.key))
  }, [plans])

  const [activeDuration, setActiveDuration] = useState(null)
  const effectiveDuration = activeDuration || availableDurations[0]?.key

  const visiblePlans = useMemo(() => {
    if (!plans) return []
    if (availableDurations.length <= 1) return plans
    return plans.filter((p) => p.durationKey === effectiveDuration)
  }, [plans, availableDurations, effectiveDuration])

  return (
    <>
      <PageHero
        eyebrow="Membership Plans"
        title="A plan for every stage of training"
        description="Switch plans any time from your account — no fees, no phone calls required."
        crumb="Membership"
      />

      <section className="py-24 sm:py-28">
        <div className="container-app">
          <SectionTitle eyebrow="Pricing" title="Simple, transparent membership tiers" />

          {availableDurations.length > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {availableDurations.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveDuration(tab.key)}
                  aria-pressed={effectiveDuration === tab.key}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                    effectiveDuration === tab.key
                      ? 'bg-primary text-white'
                      : 'bg-secondary/5 text-slate-600 hover:bg-secondary/10 dark:bg-white/5 dark:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="mt-14">
            {isLoading && <SkeletonGrid count={3} className="grid grid-cols-1 gap-7 md:grid-cols-3" />}

            {isError && <ErrorState message="We couldn't load membership plans right now." onRetry={refetch} />}

            {!isLoading && !isError && visiblePlans.length === 0 && (
              <EmptyState title="No plans available yet" message="Check back soon, or contact us for current pricing." />
            )}

            {!isLoading && !isError && visiblePlans.length > 0 && (
              <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
                {visiblePlans.map((plan, i) => (
                  <PricingCard key={plan.id} plan={plan} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 dark:bg-secondary-900/40 sm:py-28">
        <div className="container-app grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
          <SectionTitle
            align="left"
            eyebrow="Membership FAQ"
            title="Questions members ask before signing up"
          />
          <FAQAccordion items={FAQS} />
        </div>
      </section>
    </>
  )
}
