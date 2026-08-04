import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiUserPlus } from 'react-icons/fi'
import AuthLayout from '../../components/auth/AuthLayout'
import { FormField, PasswordField } from '../../components/ui/FormField'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { isValidEmail } from '../../utils/helpers'

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (values) => {
    setFormError('')
    setIsSubmitting(true)
    try {
      const user = await registerUser(values)
      toast.success(`Welcome to IronForge, ${user.first_name || user.username}!`)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setFormError(err.message)
      Object.entries(err.fieldErrors || {}).forEach(([field, messages]) => {
        const message = Array.isArray(messages) ? messages[0] : messages
        if (['username', 'email', 'password', 'password_confirm', 'phone'].includes(field)) {
          setError(field, { type: 'server', message })
        }
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Join IronForge"
      title="Create your account"
      description="Sign up as a member to browse plans, track your BMI, and manage your profile."
      footer={
        <>
          Already have an account?{' '}
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="First Name *"
            error={errors.first_name}
            inputProps={register('first_name', { required: 'Required' })}
            autoComplete="given-name"
          />
          <FormField
            label="Last Name *"
            error={errors.last_name}
            inputProps={register('last_name', { required: 'Required' })}
            autoComplete="family-name"
          />
        </div>

        <FormField
          label="Username *"
          error={errors.username}
          inputProps={register('username', { required: 'Please choose a username', minLength: { value: 3, message: 'At least 3 characters' } })}
          autoComplete="username"
        />

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

        <FormField
          label="Phone (optional)"
          type="tel"
          error={errors.phone}
          inputProps={register('phone')}
          autoComplete="tel"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <PasswordField
            label="Password *"
            error={errors.password}
            inputProps={register('password', {
              required: 'Please create a password',
              minLength: { value: 8, message: 'At least 8 characters' },
            })}
            autoComplete="new-password"
          />
          <PasswordField
            label="Confirm Password *"
            error={errors.password_confirm}
            inputProps={register('password_confirm', {
              required: 'Please confirm your password',
              validate: (v) => v === password || 'Passwords do not match',
            })}
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : (
            <>
              Create Account <FiUserPlus size={16} />
            </>
          )}
        </Button>

        <p className="text-center text-xs text-slate-400">
          By creating an account you agree to our terms and privacy policy.
        </p>
      </form>
    </AuthLayout>
  )
}
