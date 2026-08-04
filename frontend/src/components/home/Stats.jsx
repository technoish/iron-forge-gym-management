import { STATS } from '../../constants/data'
import { useCountUp } from '../../hooks/useCountUp'

function StatItem({ stat }) {
  const { ref, value } = useCountUp(stat.value)
  return (
    <div ref={ref} className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
      <span className="font-display text-4xl font-extrabold text-white sm:text-5xl">
        {value.toLocaleString()}
        <span className="text-primary">{stat.suffix}</span>
      </span>
      <span className="text-sm font-medium text-slate-400">{stat.label}</span>
    </div>
  )
}

export default function Stats() {
  return (
    <section id="stats" className="bg-secondary-950 pb-16 pt-2 sm:pb-20">
      <div className="container-app grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
        {STATS.map((stat) => (
          <StatItem key={stat.id} stat={stat} />
        ))}
      </div>
    </section>
  )
}
