import SectionTitle from '../ui/SectionTitle'
import TestimonialCard from '../ui/TestimonialCard'
import ErrorState from '../ui/ErrorState'
import { SkeletonGrid } from '../ui/Loader'
import { useFetch } from '../../hooks/useFetch'
import { getTestimonials } from '../../services/testimonialService'

export default function Testimonials() {
  const { data: testimonials, isLoading, isError, refetch } = useFetch(() => getTestimonials(), [])
  const preview = testimonials?.slice(0, 4) ?? []

  if (!isLoading && !isError && preview.length === 0) return null

  return (
    <section className="py-24 sm:py-28">
      <div className="container-app">
        <SectionTitle
          eyebrow="Member Results"
          title="Real progress, in members&rsquo; own words"
        />

        <div className="mt-14">
          {isLoading && <SkeletonGrid count={4} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" />}
          {isError && <ErrorState compact message="We couldn't load member reviews right now." onRetry={refetch} />}
          {!isLoading && !isError && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {preview.map((t, i) => (
                <TestimonialCard key={t.id} testimonial={t} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
