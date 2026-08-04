export default function Toggle({ label, checked, onChange, hint }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-secondary/10 px-4 py-3 dark:border-white/10">
      <span>
        <span className="block text-sm font-semibold text-secondary dark:text-white">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-slate-400">{hint}</span>}
      </span>
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-secondary/15 transition-colors peer-checked:bg-primary dark:bg-white/15" />
        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  )
}
