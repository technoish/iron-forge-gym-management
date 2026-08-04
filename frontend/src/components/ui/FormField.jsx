import { forwardRef, useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'


export const FormField = forwardRef(function FormField(
  { label, type = 'text', error, inputProps, hint, ...rest },
  ref,
) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <input
        ref={ref}
        type={type}
        {...inputProps}
        {...rest}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-secondary outline-none transition-colors dark:bg-secondary-900 dark:text-white ${
          error ? 'border-red-400' : 'border-secondary/10 focus:border-primary dark:border-white/10'
        }`}
      />
      {hint && !error && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-500">{error.message}</span>}
    </label>
  )
})


export const PasswordField = forwardRef(function PasswordField({ label, error, inputProps, ...rest }, ref) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <div className="relative">
        <input
          ref={ref}
          type={visible ? 'text' : 'password'}
          {...inputProps}
          {...rest}
          className={`w-full rounded-xl border bg-white px-4 py-3 pr-11 text-sm text-secondary outline-none transition-colors dark:bg-secondary-900 dark:text-white ${
            error ? 'border-red-400' : 'border-secondary/10 focus:border-primary dark:border-white/10'
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
        >
          {visible ? <FiEyeOff size={17} /> : <FiEye size={17} />}
        </button>
      </div>
      {error && <span className="mt-1 block text-xs text-red-500">{error.message}</span>}
    </label>
  )
})
