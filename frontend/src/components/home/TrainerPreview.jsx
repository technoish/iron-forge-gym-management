import SectionTitle from '../ui/SectionTitle'
import TrainerCard from '../ui/TrainerCard'
import ErrorState from '../ui/ErrorState'
import { SkeletonGrid } from '../ui/Loader'
import Button from '../ui/Button'
import { useFetch } from '../../hooks/useFetch'
import { getTrainers } from '../../services/trainerService'

export default function TrainerPreview() {
  const { data: trainers, isLoading, isError, refetch } = useFetch(() => getTrainers(), [])
  const preview = trainers?.slice(0, 4) ?? []

  if (!isLoading && !isError && preview.length === 0) return null

  return (
    <section className="bg-white py-24 dark:bg-secondary-900/40 sm:py-28">
      <div className="container-app">
        <SectionTitle
          eyebrow="Our Coaches"
          title="Certified trainers, not enthusiastic amateurs"
          description="Every coach on our floor holds a national certification and carries their own training philosophy."
        />

        <div className="mt-14">
          {isLoading && <SkeletonGrid count={4} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" />}
          {isError && <ErrorState compact message="We couldn't load our trainers right now." onRetry={refetch} />}
          {!isLoading && !isError && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {preview.map((trainer, i) => (
                <TrainerCard key={trainer.id} trainer={trainer} index={i} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Button to="/trainers" variant="secondary">
            Meet the Full Team
          </Button>
        </div>
      </div>
    </section>
  )
}
