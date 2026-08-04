import { useState } from 'react'
import { FormField } from '../../ui/FormField'
import TextareaField from '../TextareaField'
import ImageUploadField from '../ImageUploadField'
import Toggle from '../Toggle'
import Button from '../../ui/Button'

const BLANK = {
  name: '',
  image: null,
  specialization: '',
  experience: '',
  certifications: '',
  description: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  email: '',
  phone: '',
  is_active: true,
}

export default function TrainerForm({ initialValues, onSubmit, isSubmitting, formError, fieldErrors = {} }) {
  const [values, setValues] = useState({ ...BLANK, ...initialValues })
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target ? e.target.value : e }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!values.name.trim()) nextErrors.name = 'Required'
    if (!values.specialization.trim()) nextErrors.specialization = 'Required'
    if (!values.experience.trim()) nextErrors.experience = 'Required'
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

      <ImageUploadField label="Photo" value={values.image} onChange={(file) => setValues((v) => ({ ...v, image: file }))} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Name *" error={err('name')} inputProps={{ value: values.name, onChange: set('name') }} />
        <FormField label="Specialization *" error={err('specialization')} inputProps={{ value: values.specialization, onChange: set('specialization') }} />
      </div>

      <FormField
        label="Experience *"
        hint='e.g. "9 yrs experience"'
        error={err('experience')}
        inputProps={{ value: values.experience, onChange: set('experience') }}
      />

      <TextareaField
        label="Certifications"
        hint="Comma-separated or free text"
        error={err('certifications')}
        inputProps={{ value: values.certifications, onChange: set('certifications') }}
        rows={2}
      />

      <TextareaField label="Bio" error={err('description')} inputProps={{ value: values.description, onChange: set('description') }} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Email" type="email" error={err('email')} inputProps={{ value: values.email, onChange: set('email') }} />
        <FormField label="Phone" type="tel" error={err('phone')} inputProps={{ value: values.phone, onChange: set('phone') }} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField label="Instagram URL" error={err('instagram')} inputProps={{ value: values.instagram, onChange: set('instagram') }} />
        <FormField label="Facebook URL" error={err('facebook')} inputProps={{ value: values.facebook, onChange: set('facebook') }} />
        <FormField label="LinkedIn URL" error={err('linkedin')} inputProps={{ value: values.linkedin, onChange: set('linkedin') }} />
      </div>

      <Toggle label="Active" hint="Inactive trainers are hidden from the public site" checked={values.is_active} onChange={(v) => setValues((s) => ({ ...s, is_active: v }))} />

      <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save Trainer'}
      </Button>
    </form>
  )
}
