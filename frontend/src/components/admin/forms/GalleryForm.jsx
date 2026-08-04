import { useState } from 'react'
import { FormField } from '../../ui/FormField'
import SelectField from '../SelectField'
import ImageUploadField from '../ImageUploadField'
import Button from '../../ui/Button'

const BLANK = { image: null, title: '', category: 'floor' }

const CATEGORY_OPTIONS = [
  { value: 'floor', label: 'Gym Floor' },
  { value: 'classes', label: 'Classes' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'events', label: 'Events' },
  { value: 'facility', label: 'Facility' },
]

export default function GalleryForm({ initialValues, isEditing, onSubmit, isSubmitting, formError, fieldErrors = {} }) {
  const [values, setValues] = useState({ ...BLANK, ...initialValues })
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!isEditing && !(values.image instanceof File)) nextErrors.image = 'Please choose an image'
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

      <ImageUploadField
        label="Image"
        required={!isEditing}
        value={values.image}
        onChange={(file) => setValues((v) => ({ ...v, image: file }))}
        error={err('image')}
      />

      <FormField label="Title (optional)" error={err('title')} inputProps={{ value: values.title, onChange: set('title') }} />

      <SelectField label="Category" options={CATEGORY_OPTIONS} inputProps={{ value: values.category, onChange: set('category') }} />

      <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save Image'}
      </Button>
    </form>
  )
}
