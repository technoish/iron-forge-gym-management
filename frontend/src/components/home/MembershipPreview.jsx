import SectionTitle from '../ui/SectionTitle'
import PricingCard from '../ui/PricingCard'
import ErrorState from '../ui/ErrorState'
import { SkeletonGrid } from '../ui/Loader'
import Button from '../ui/Button'
import { useFetch } from '../../hooks/useFetch'
import { getPlans } from '../../services/membershipService'

export default function MembershipPreview() {
  const { data: plans, isLoading, isError, refetch } = useFetch(() => getPlans(), [])
  const preview = plans?.slice(0, 3) ?? []

  if (!isLoading && !isError && preview.length === 0) return null

  return (
    <section className="py-24 sm:py-28">
      <div className="container-app">
        <SectionTitle
          eyebrow="Membership"
          title="Plans that scale with your commitment"
          description="No contracts, no joining fee. Upgrade, downgrade, or freeze whenever your life changes."
        />

        <div className="mt-14">
          {isLoading && <SkeletonGrid count={3} className="grid grid-cols-1 gap-7 md:grid-cols-3" />}
          {isError && <ErrorState compact message="We couldn't load membership plans right now." onRetry={refetch} />}
          {!isLoading && !isError && (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
              {preview.map((plan, i) => (
                <PricingCard key={plan.id} plan={plan} index={i} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Button to="/membership" variant="secondary">
            Compare All Plans
          </Button>
        </div>
      </div>
    </section>
  )
}
