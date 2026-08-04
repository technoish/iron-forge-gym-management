import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FiLock } from 'react-icons/fi'
import PageHero from '../../components/ui/PageHero'
import { PasswordField } from '../../components/ui/FormField'
import Button from '../../components/ui/Button'
import * as authService from '../../services/authService'

export default function ChangePassword() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const newPassword = watch('new_password')

  const onSubmit = async (values) => {
    setFormError('')
    setIsSubmitting(true)
    try {
      await authService.changePassword(values)
      toast.success('Password changed successfully.')
      reset()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHero eyebrow="Account Security" title="Change your password" crumb="Change Password" />
      <section className="py-24 sm:py-28">
        <div className="container-app flex justify-center">
          <div className="card-surface w-full max-w-md p-8">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {formError && (
                <div role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
                  {formError}
                </div>
              )}

              <PasswordField
                label="Current Password *"
                error={errors.old_password}
                inputProps={register('old_password', { required: 'Please enter your current password' })}
                autoComplete="current-password"
              />
              <PasswordField
                label="New Password *"
                error={errors.new_password}
                inputProps={register('new_password', {
                  required: 'Please enter a new password',
                  minLength: { value: 8, message: 'At least 8 characters' },
                })}
                autoComplete="new-password"
              />
              <PasswordField
                label="Confirm New Password *"
                error={errors.new_password_confirm}
                inputProps={register('new_password_confirm', {
                  required: 'Please confirm your new password',
                  validate: (v) => v === newPassword || 'Passwords do not match',
                })}
                autoComplete="new-password"
              />

              <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Updating…' : (
                  <>
                    Update Password <FiLock size={16} />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
