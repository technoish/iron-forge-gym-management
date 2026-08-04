import { useState } from 'react'
import { FormField } from '../../ui/FormField'
import TextareaField from '../TextareaField'
import SelectField from '../SelectField'
import TagListEditor from '../TagListEditor'
import Toggle from '../Toggle'
import Button from '../../ui/Button'

const BLANK = {
  plan_name: '',
  duration: 'monthly',
  price: '',
  description: '',
  features: [],
  is_popular: false,
  is_active: true,
}

const DURATION_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
]

export default function PlanForm({ initialValues, onSubmit, isSubmitting, formError, fieldErrors = {} }) {
  const [values, setValues] = useState({ ...BLANK, ...initialValues })
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!values.plan_name.trim()) nextErrors.plan_name = 'Required'
    if (values.price === '' || Number(values.price) < 0) nextErrors.price = 'Enter a valid price'
    if (values.features.length === 0) nextErrors.features = 'Add at least one feature'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({ ...values, price: Number(values.price) })
  }

  const err = (key) => (errors[key] ? { message: errors[key] } : fieldErrors[key] ? { message: fieldErrors[key][0] || fieldErrors[key] } : null)

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && (
        <div role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
          {formError}
        </div>
      )}

      <FormField label="Plan Name *" error={err('plan_name')} inputProps={{ value: values.plan_name, onChange: set('plan_name') }} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          label="Duration"
          options={DURATION_OPTIONS}
          inputProps={{ value: values.duration, onChange: set('duration') }}
        />
        <FormField
          label="Price (USD) *"
          type="number"
          error={err('price')}
          inputProps={{ value: values.price, onChange: set('price'), step: '0.01', min: 0 }}
        />
      </div>

      <TextareaField label="Description" error={err('description')} inputProps={{ value: values.description, onChange: set('description') }} rows={2} />

      <TagListEditor label="Features *" value={values.features} onChange={(features) => setValues((v) => ({ ...v, features }))} />
      {err('features') && <p className="text-xs text-red-500">{err('features').message}</p>}

      <Toggle label="Featured / Most Popular" checked={values.is_popular} onChange={(v) => setValues((s) => ({ ...s, is_popular: v }))} />
      <Toggle label="Active" hint="Inactive plans are hidden from the public site" checked={values.is_active} onChange={(v) => setValues((s) => ({ ...s, is_active: v }))} />

      <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save Plan'}
      </Button>
    </form>
  )
}
