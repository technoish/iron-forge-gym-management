import SectionTitle from '../ui/SectionTitle'
import ServiceCard from '../ui/ServiceCard'
import ErrorState from '../ui/ErrorState'
import { SkeletonGrid } from '../ui/Loader'
import Button from '../ui/Button'
import { useFetch } from '../../hooks/useFetch'
import { getServices } from '../../services/servicesService'

export default function FeaturedServices() {
  const { data: services, isLoading, isError, refetch } = useFetch(() => getServices(), [])
  const featured = services?.slice(0, 3) ?? []


  if (!isLoading && !isError && featured.length === 0) return null

  return (
    <section className="bg-white py-24 dark:bg-secondary-900/40 sm:py-28">
      <div className="container-app">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionTitle
            align="left"
            eyebrow="What We Offer"
            title="Programs built around real outcomes"
            description="A cross-section of our most-booked programs — see the full catalog for everything we offer."
          />
          <Button to="/services" variant="secondary" className="shrink-0">
            View All Services
          </Button>
        </div>

        <div className="mt-14">
          {isLoading && <SkeletonGrid count={3} />}
          {isError && <ErrorState compact message="We couldn't load our services right now." onRetry={refetch} />}
          {!isLoading && !isError && (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
