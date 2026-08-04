import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi'
import AuthLayout from '../../components/auth/AuthLayout'
import { PasswordField } from '../../components/ui/FormField'
import Button from '../../components/ui/Button'
import * as authService from '../../services/authService'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const uid = searchParams.get('uid')
  const token = searchParams.get('token')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const newPassword = watch('new_password')

  if (!uid || !token) {
    return (
      <AuthLayout eyebrow="Reset Password" title="Invalid reset link">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <FiAlertTriangle size={40} className="text-amber-500" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            This password reset link is missing or malformed. Please request a new one.
          </p>
          <Link to="/forgot-password" className="mt-2 text-sm font-semibold text-primary hover:underline">
            Request a new link
          </Link>
        </div>
      </AuthLayout>
    )
  }

  const onSubmit = async (values) => {
    setFormError('')
    setIsSubmitting(true)
    try {
      await authService.resetPassword({ uid, token, ...values })
      toast.success('Password reset — you can now log in.')
      navigate('/login', { replace: true })
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout eyebrow="Reset Password" title="Choose a new password" description="Make it something you haven't used here before.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {formError && (
          <div role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
            {formError}
          </div>
        )}

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
          {isSubmitting ? 'Resetting…' : (
            <>
              Reset Password <FiCheckCircle size={16} />
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}
