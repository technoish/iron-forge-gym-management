import { useState } from 'react'
import { FormField } from '../../ui/FormField'
import TextareaField from '../TextareaField'
import ImageUploadField from '../ImageUploadField'
import StarRatingInput from '../StarRatingInput'
import Toggle from '../Toggle'
import Button from '../../ui/Button'

const BLANK = { customer_name: '', image: null, rating: 5, review: '', is_active: true }

export default function TestimonialForm({ initialValues, onSubmit, isSubmitting, formError, fieldErrors = {} }) {
  const [values, setValues] = useState({ ...BLANK, ...initialValues })
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!values.customer_name.trim()) nextErrors.customer_name = 'Required'
    if (!values.review.trim()) nextErrors.review = 'Required'
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

      <ImageUploadField label="Photo (optional)" value={values.image} onChange={(file) => setValues((v) => ({ ...v, image: file }))} />

      <FormField label="Customer Name *" error={err('customer_name')} inputProps={{ value: values.customer_name, onChange: set('customer_name') }} />

      <StarRatingInput label="Rating" value={values.rating} onChange={(rating) => setValues((v) => ({ ...v, rating }))} />

      <TextareaField label="Review *" error={err('review')} inputProps={{ value: values.review, onChange: set('review') }} />

      <Toggle label="Active" hint="Inactive testimonials are hidden from the public site" checked={values.is_active} onChange={(v) => setValues((s) => ({ ...s, is_active: v }))} />

      <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save Testimonial'}
      </Button>
    </form>
  )
}
