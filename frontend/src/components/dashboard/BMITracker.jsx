import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { FiActivity, FiTrash2, FiInfo } from 'react-icons/fi'
import { FormField } from '../ui/FormField'
import Button from '../ui/Button'
import { calculateBMI } from '../../services/bmiService'
import { useAuth } from '../../context/AuthContext'
import { getBmiHistory, addBmiEntry, removeBmiEntry } from '../../utils/bmiHistory'
import { formatDate } from '../../utils/helpers'

const CATEGORY_COLOR = {
  Underweight: '#3B82F6',
  Normal: '#10B981',
  Overweight: '#F59E0B',
  Obese: '#EF4444',
}

export default function BMITracker() {
  const { user } = useAuth()
  const [history, setHistory] = useState(() => getBmiHistory(user?.id))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async ({ height, weight }) => {
    setFormError('')
    setIsSubmitting(true)
    try {
      const result = await calculateBMI({ height: Number(height), weight: Number(weight) })
      const next = addBmiEntry(user.id, {
        height: Number(height),
        weight: Number(weight),
        bmi: result.bmi,
        category: result.category,
      })
      setHistory(next)
      reset()
      toast.success(`BMI logged: ${result.bmi.toFixed(1)} (${result.category})`)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemove = (id) => setHistory(removeBmiEntry(user.id, id))

  const chartData = [...history].reverse().map((entry) => ({
    date: formatDate(entry.recordedAt),
    bmi: entry.bmi,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2 rounded-xl bg-primary/5 p-4 text-sm text-slate-600 dark:bg-primary/10 dark:text-slate-300">
        <FiInfo size={16} className="mt-0.5 shrink-0 text-primary" />
        <p>
          Your BMI history is saved on this device only — it isn&apos;t synced to your account, so it won&apos;t
          appear if you log in elsewhere.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Log a new reading */}
        <div className="card-surface p-6">
          <h3 className="font-display text-lg font-bold text-secondary dark:text-white">Log a new reading</h3>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4">
            {formError && (
              <div role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
                {formError}
              </div>
            )}
            <FormField
              label="Height (cm)"
              type="number"
              error={errors.height}
              inputProps={register('height', {
                required: 'Enter your height',
                min: { value: 50, message: 'Must be at least 50 cm' },
                max: { value: 272, message: 'Must be under 272 cm' },
              })}
            />
            <FormField
              label="Weight (kg)"
              type="number"
              error={errors.weight}
              inputProps={register('weight', {
                required: 'Enter your weight',
                min: { value: 10, message: 'Must be at least 10 kg' },
                max: { value: 500, message: 'Must be under 500 kg' },
              })}
            />
            <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Calculating…' : (
                <>
                  Log Reading <FiActivity size={16} />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Trend + history */}
        <div className="card-surface p-6">
          <h3 className="font-display text-lg font-bold text-secondary dark:text-white">Trend</h3>
          {history.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              No readings logged yet — add one to start tracking your trend.
            </p>
          ) : (
            <>
              {history.length > 1 && (
                <div className="mt-4 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                      <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip />
                      <Line type="monotone" dataKey="bmi" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <ul className="mt-5 max-h-64 space-y-2 overflow-y-auto pr-1">
                {history.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between rounded-lg border border-secondary/10 px-3 py-2.5 text-sm dark:border-white/10"
                  >
                    <div>
                      <span className="font-semibold text-secondary dark:text-white">{entry.bmi.toFixed(1)}</span>
                      <span
                        className="ml-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                        style={{ backgroundColor: CATEGORY_COLOR[entry.category] || '#64748B' }}
                      >
                        {entry.category}
                      </span>
                      <p className="mt-0.5 text-xs text-slate-400">{formatDate(entry.recordedAt)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(entry.id)}
                      aria-label="Delete this reading"
                      className="text-slate-400 hover:text-red-500"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
