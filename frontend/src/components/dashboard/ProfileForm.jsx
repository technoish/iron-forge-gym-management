import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FiSave } from 'react-icons/fi'
import { FormField } from '../ui/FormField'
import Button from '../ui/Button'
import { useAuth } from '../../context/AuthContext'

export default function ProfileForm() {
  const { user, updateProfile } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
    },
  })

  const onSubmit = async (values) => {
    setFormError('')
    setIsSubmitting(true)
    try {
      await updateProfile(values)
      toast.success('Profile updated.')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card-surface p-7">
      <h2 className="font-display text-xl font-bold text-secondary dark:text-white">Edit Profile</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Username, email, and role can&apos;t be changed here.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
        {formError && (
          <div role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="First Name"
            error={errors.first_name}
            inputProps={register('first_name', { required: 'Required' })}
          />
          <FormField
            label="Last Name"
            error={errors.last_name}
            inputProps={register('last_name', { required: 'Required' })}
          />
        </div>

        <FormField label="Phone" type="tel" error={errors.phone} inputProps={register('phone')} />

        <Button type="submit" variant="primary" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? 'Saving…' : (
            <>
              Save Changes <FiSave size={16} />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
