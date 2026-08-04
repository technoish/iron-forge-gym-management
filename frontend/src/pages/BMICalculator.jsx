import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'
import { calculateBMI } from '../services/bmiService'

const BMI_MIN = 12
const BMI_MAX = 42

const CATEGORY_STYLE = {
  Underweight: { color: '#3B82F6' },
  Normal: { color: '#10B981', label: 'Healthy Weight' },
  Overweight: { color: '#F59E0B' },
  Obese: { color: '#EF4444' },
}

export default function BMICalculator() {
  const [unit, setUnit] = useState('metric')
  const [result, setResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (values) => {
    let heightCm, weightKg

    if (unit === 'metric') {
      heightCm = Number(values.height)
      weightKg = Number(values.weight)
    } else {
      const feet = Number(values.feet || 0)
      const inches = Number(values.inches || 0)
      heightCm = (feet * 12 + inches) * 2.54
      weightKg = Number(values.weightLb) * 0.453592
    }

    setFormError('')
    setIsSubmitting(true)
    try {
      const { bmi, category, health_tip } = await calculateBMI({ height: heightCm, weight: weightKg })
      setResult({ bmi, category, tip: health_tip })
    } catch (err) {
      setFormError(err.message)
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const gaugeAngle = useMemo(() => {
    if (!result) return -90
    const clamped = Math.min(Math.max(result.bmi, BMI_MIN), BMI_MAX)
    const ratio = (clamped - BMI_MIN) / (BMI_MAX - BMI_MIN)
    return -90 + ratio * 180
  }, [result])

  const style = result ? CATEGORY_STYLE[result.category] || { color: '#64748B' } : null

  return (
    <>
      <PageHero
        eyebrow="Health Tool"
        title="Know your BMI, and what to do about it"
        description="A quick baseline reading — not a diagnosis. Pair it with a coach assessment for the full picture."
        crumb="BMI Calculator"
      />

      <section className="py-24 sm:py-28">
        <div className="container-app grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="card-surface p-8"
          >
            <div className="mb-6 flex rounded-full bg-secondary/5 p-1 dark:bg-white/5">
              {['metric', 'imperial'].map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`flex-1 rounded-full py-2.5 text-sm font-semibold capitalize transition-colors ${
                    unit === u ? 'bg-primary text-white' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {u === 'metric' ? 'cm / kg' : 'ft-in / lb'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {formError && (
                <div role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
                  {formError}
                </div>
              )}
              {unit === 'metric' ? (
                <>
                  <Field
                    label="Height (cm)"
                    error={errors.height}
                    inputProps={register('height', {
                      required: 'Enter your height',
                      min: { value: 90, message: 'Enter a height above 90 cm' },
                      max: { value: 250, message: 'Enter a height under 250 cm' },
                    })}
                  />
                  <Field
                    label="Weight (kg)"
                    error={errors.weight}
                    inputProps={register('weight', {
                      required: 'Enter your weight',
                      min: { value: 25, message: 'Enter a weight above 25 kg' },
                      max: { value: 300, message: 'Enter a weight under 300 kg' },
                    })}
                  />
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Height (ft)"
                      error={errors.feet}
                      inputProps={register('feet', { required: 'Required', min: 3, max: 8 })}
                    />
                    <Field
                      label="Height (in)"
                      error={errors.inches}
                      inputProps={register('inches', { min: 0, max: 11 })}
                    />
                  </div>
                  <Field
                    label="Weight (lb)"
                    error={errors.weightLb}
                    inputProps={register('weightLb', {
                      required: 'Enter your weight',
                      min: { value: 60, message: 'Enter a weight above 60 lb' },
                      max: { value: 660, message: 'Enter a weight under 660 lb' },
                    })}
                  />
                </>
              )}

              <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Calculating…' : 'Calculate BMI'}
              </Button>
            </form>
          </motion.div>

          {/* Result card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-surface flex flex-col items-center justify-center p-8 text-center"
          >
            {!result ? (
              <div className="flex flex-col items-center gap-4 py-10">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-display text-2xl font-bold">
                  ?
                </span>
                <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
                  Fill in your details to see your BMI, category, and a next step.
                </p>
              </div>
            ) : (
              <>
                <Gauge angle={gaugeAngle} color={style.color} />
                <p className="mt-2 font-display text-5xl font-extrabold text-secondary dark:text-white">
                  {result.bmi ? result.bmi.toFixed(1) : '—'}
                </p>
                <p
                  className="mt-1 inline-flex rounded-full px-4 py-1 text-sm font-semibold text-white"
                  style={{ backgroundColor: style.color }}
                >
                  {style.label || result.category}
                </p>
                <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {result.tip}
                </p>
                <Button to="/contact" variant="secondary" className="mt-6">
                  Talk to a Coach
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}

function Field({ label, error, inputProps }) {
  return (
    <label className="block text-left">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <input
        type="number"
        step="any"
        {...inputProps}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-secondary outline-none transition-colors dark:bg-secondary-900 dark:text-white ${
          error ? 'border-red-400' : 'border-secondary/10 focus:border-primary dark:border-white/10'
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error.message}</span>}
    </label>
  )
}


function Gauge({ angle, color = '#EF4444' }) {
  return (
    <svg viewBox="0 0 200 110" className="w-56">
      <path d="M10 100 A90 90 0 0 1 62 22" fill="none" stroke="#3B82F6" strokeWidth="14" strokeLinecap="round" />
      <path d="M62 22 A90 90 0 0 1 138 22" fill="none" stroke="#10B981" strokeWidth="14" strokeLinecap="round" />
      <path d="M138 22 A90 90 0 0 1 172 55" fill="none" stroke="#F59E0B" strokeWidth="14" strokeLinecap="round" />
      <path d="M172 55 A90 90 0 0 1 190 100" fill="none" stroke="#EF4444" strokeWidth="14" strokeLinecap="round" />
      <motion.g
        initial={{ rotate: -90 }}
        animate={{ rotate: angle }}
        transition={{ type: 'spring', stiffness: 60, damping: 12 }}
        style={{ originX: '100px', originY: '100px' }}
      >
        <line x1="100" y1="100" x2="100" y2="30" stroke={color} strokeWidth="4" strokeLinecap="round" />
      </motion.g>
      <circle cx="100" cy="100" r="8" fill={color} />
    </svg>
  )
}
