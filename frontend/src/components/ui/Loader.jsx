
export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-14 w-14">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <span className="h-3 w-3 rounded-full bg-white" />
          </span>
        </div>
        <p className="font-display text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400">
          Loading…
        </p>
      </div>
    </div>
  )
}


export function SkeletonCard() {
  return (
    <div className="card-surface animate-pulse overflow-hidden rounded-xl2 p-4">
      <div className="mb-4 h-48 w-full rounded-lg bg-slate-200 dark:bg-white/10" />
      <div className="mb-2 h-4 w-2/3 rounded bg-slate-200 dark:bg-white/10" />
      <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-white/10" />
    </div>
  )
}


export function SkeletonGrid({ count = 3, className = 'grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3' }) {
  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
