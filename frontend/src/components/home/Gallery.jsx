import { motion } from 'framer-motion'
import SectionTitle from '../ui/SectionTitle'
import ErrorState from '../ui/ErrorState'
import { useFetch } from '../../hooks/useFetch'
import { getGalleryImages } from '../../services/galleryService'

export default function Gallery() {
  const { data: images, isLoading, isError, refetch } = useFetch(() => getGalleryImages(), [])
  const preview = images?.slice(0, 8) ?? []

  if (!isLoading && !isError && preview.length === 0) return null

  return (
    <section className="bg-white py-24 dark:bg-secondary-900/40 sm:py-28">
      <div className="container-app">
        <SectionTitle eyebrow="Inside the Gym" title="A floor built for focus" />

        {isLoading && (
          <div
            className="mt-14 grid auto-rows-[160px] grid-cols-2 gap-4 sm:grid-cols-4 sm:auto-rows-[200px]"
            aria-hidden="true"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10 ${
                  i === 0 ? 'col-span-2 row-span-2' : i === 5 ? 'sm:col-span-2' : ''
                }`}
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="mt-14">
            <ErrorState compact message="We couldn't load the gallery right now." onRetry={refetch} />
          </div>
        )}

        {!isLoading && !isError && (
          <div className="mt-14 grid auto-rows-[160px] grid-cols-2 gap-4 sm:grid-cols-4 sm:auto-rows-[200px]">
            {preview.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                className={`group relative overflow-hidden rounded-2xl ${
                  i === 0 ? 'col-span-2 row-span-2' : i === 5 ? 'sm:col-span-2' : ''
                }`}
              >
                <img
                  src={img.src}
                  alt={img.title || ''}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-secondary-950/0 transition-colors duration-300 group-hover:bg-secondary-950/20" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
