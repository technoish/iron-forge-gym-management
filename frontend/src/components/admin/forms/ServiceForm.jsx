import { useState } from 'react'
import { FormField } from '../../ui/FormField'
import TextareaField from '../TextareaField'
import SelectField from '../SelectField'
import ImageUploadField from '../ImageUploadField'
import Toggle from '../Toggle'
import Button from '../../ui/Button'

const BLANK = { title: '', image: null, description: '', icon: 'dumbbell', is_active: true }

const ICON_OPTIONS = [
  { value: 'dumbbell', label: 'Dumbbell (Strength)' },
  { value: 'fire', label: 'Fire (Strength/HIIT)' },
  { value: 'heartbeat', label: 'Heartbeat (Cardio)' },
  { value: 'music', label: 'Music (Cardio/Dance)' },
  { value: 'lotus', label: 'Lotus (Mind & Body)' },
  { value: 'user', label: 'User (Personal Coaching)' },
  { value: 'apple', label: 'Apple (Nutrition)' },
]

export default function ServiceForm({ initialValues, onSubmit, isSubmitting, formError, fieldErrors = {} }) {
  const [values, setValues] = useState({ ...BLANK, ...initialValues })
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!values.title.trim()) nextErrors.title = 'Required'
    if (!values.description.trim()) nextErrors.description = 'Required'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const payload = { ...values }
    if (typeof payload.image === 'string') delete payload.image
    onSubmit(payload)
  }

  const err = (key) => (errors[key] ? { message: errors[key] } : fieldErrors[key] ? { message: fieldErrors[key][0] || fieldErrors[key] } : null)

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && (
        <div role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
          {formError}
        </div>
      )}

      <ImageUploadField label="Image" value={values.image} onChange={(file) => setValues((v) => ({ ...v, image: file }))} />

      <FormField label="Title *" error={err('title')} inputProps={{ value: values.title, onChange: set('title') }} />

      <SelectField label="Icon" options={ICON_OPTIONS} inputProps={{ value: values.icon, onChange: set('icon') }} />

      <TextareaField label="Description *" error={err('description')} inputProps={{ value: values.description, onChange: set('description') }} />

      <Toggle label="Active" hint="Inactive services are hidden from the public site" checked={values.is_active} onChange={(v) => setValues((s) => ({ ...s, is_active: v }))} />

      <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save Service'}
      </Button>
    </form>
  )
}
