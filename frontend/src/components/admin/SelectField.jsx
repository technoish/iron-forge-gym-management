export default function SelectField({ label, error, inputProps, options, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <select
        {...inputProps}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-secondary outline-none transition-colors dark:bg-secondary-900 dark:text-white ${
          error ? 'border-red-400' : 'border-secondary/10 focus:border-primary dark:border-white/10'
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && !error && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-500">{error.message}</span>}
    </label>
  )
}
