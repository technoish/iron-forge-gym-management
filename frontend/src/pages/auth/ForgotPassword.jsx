import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { FiMail, FiCheckCircle } from 'react-icons/fi'
import AuthLayout from '../../components/auth/AuthLayout'
import { FormField } from '../../components/ui/FormField'
import Button from '../../components/ui/Button'
import * as authService from '../../services/authService'
import { isValidEmail } from '../../utils/helpers'

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async ({ email }) => {
    setFormError('')
    setIsSubmitting(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout eyebrow="Check Your Inbox" title="Reset link sent">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <FiCheckCircle size={40} className="text-primary" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            If an account with that email exists, we&apos;ve sent a link to reset your password. It may take a
            minute to arrive — check spam if you don&apos;t see it.
          </p>
          <Link to="/login" className="mt-2 text-sm font-semibold text-primary hover:underline">
            Back to Log In
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      eyebrow="Forgot Password"
      title="Reset your password"
      description="Enter your account email and we'll send you a link to set a new password."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {formError && (
          <div role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
            {formError}
          </div>
        )}

        <FormField
          label="Email *"
          type="email"
          error={errors.email}
          inputProps={register('email', {
            required: 'Please enter your email',
            validate: (v) => isValidEmail(v) || 'Enter a valid email address',
          })}
          autoComplete="email"
        />

        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : (
            <>
              Send Reset Link <FiMail size={16} />
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}
