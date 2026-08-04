import { FiCheck, FiInfo } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import ErrorState from '../ui/ErrorState'
import EmptyState from '../ui/EmptyState'
import { SkeletonGrid } from '../ui/Loader'
import Button from '../ui/Button'
import { useFetch } from '../../hooks/useFetch'
import { getPlans } from '../../services/membershipService'

export default function MembershipPanel() {
  const { data: plans, isLoading, isError, refetch } = useFetch(() => getPlans(), [])

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2 rounded-xl bg-primary/5 p-4 text-sm text-slate-600 dark:bg-primary/10 dark:text-slate-300">
        <FiInfo size={16} className="mt-0.5 shrink-0 text-primary" />
        <p>
          Plan sign-ups are handled by our front-desk team for now, so this shows the plans available to join or
          switch to rather than a live subscription status. Reach out from the Contact page to enroll or change
          plans.
        </p>
      </div>

      {isLoading && <SkeletonGrid count={3} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" />}

      {isError && <ErrorState message="We couldn't load membership plans right now." onRetry={refetch} />}

      {!isLoading && !isError && plans.length === 0 && (
        <EmptyState title="No plans available" message="Check back soon, or contact us for current pricing." />
      )}

      {!isLoading && !isError && plans.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-xl2 p-6 ${
                plan.highlighted
                  ? 'bg-secondary text-white ring-1 ring-primary/40'
                  : 'card-surface text-secondary dark:text-white'
              }`}
            >
              {plan.tag && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {plan.tag}
                </span>
              )}
              <h4 className="font-display text-base font-semibold">{plan.name}</h4>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-2xl font-extrabold">${plan.price}</span>
                <span className={`text-xs ${plan.highlighted ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                  /{plan.duration.replace('per ', '')}
                </span>
              </div>
              <ul className="mt-4 flex-1 space-y-2">
                {plan.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs">
                    <FiCheck className={`mt-0.5 shrink-0 ${plan.highlighted ? 'text-primary-400' : 'text-primary'}`} size={13} />
                    <span className={plan.highlighted ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button to="/contact" variant={plan.highlighted ? 'primary' : 'secondary'} className="mt-5 w-full !py-2.5 text-xs">
                Enroll in {plan.name}
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <Link to="/membership" className="text-sm font-semibold text-primary hover:underline">
          Compare all plan details →
        </Link>
      </div>
    </div>
  )
}
