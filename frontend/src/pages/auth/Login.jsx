import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiLogIn } from 'react-icons/fi'
import AuthLayout from '../../components/auth/AuthLayout'
import { FormField, PasswordField } from '../../components/ui/FormField'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { remember: true } })

  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const onSubmit = async ({ username, password, remember }) => {
    setFormError('')
    setIsSubmitting(true)
    try {
      const user = await login({ username, password, remember })
      toast.success(`Welcome back, ${user.first_name || user.username}!`)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome Back"
      title="Log in to your account"
      description="Access your membership, training plans, and profile."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create one
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
          label="Username or Email *"
          error={errors.username}
          inputProps={register('username', { required: 'Please enter your username or email' })}
          autoComplete="username"
        />

        <PasswordField
          label="Password *"
          error={errors.password}
          inputProps={register('password', { required: 'Please enter your password' })}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              {...register('remember')}
              className="h-4 w-4 rounded border-secondary/20 text-primary focus:ring-primary"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in…' : (
            <>
              Log In <FiLogIn size={16} />
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}
