import { forwardRef, useState } from 'react'
import { Link } from 'react-router-dom'

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghostLight: 'btn-ghost-light',
}


const Button = forwardRef(function Button(
  { children, variant = 'primary', to, href, className = '', onClick, type = 'button', ...rest },
  ref,
) {
  const [ripples, setRipples] = useState([])

  const spawnRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const id = Date.now()
    setRipples((prev) => [
      ...prev,
      { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size },
    ])
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)
  }

  const handleClick = (e) => {
    spawnRipple(e)
    onClick?.(e)
  }

  const classes = `ripple ${VARIANTS[variant]} ${className}`

  const rippleNodes = ripples.map((r) => (
    <span
      key={r.id}
      aria-hidden="true"
      className="pointer-events-none absolute rounded-full bg-white/40 animate-ping"
      style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
    />
  ))

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} onClick={handleClick} {...rest}>
        {children}
        {rippleNodes}
      </Link>
    )
  }

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} onClick={handleClick} {...rest}>
        {children}
        {rippleNodes}
      </a>
    )
  }

  return (
    <button ref={ref} type={type} className={classes} onClick={handleClick} {...rest}>
      {children}
      {rippleNodes}
    </button>
  )
})

export default Button
