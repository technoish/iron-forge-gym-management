import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi'
import { NAV_LINKS } from '../../constants/data'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import UserMenu from './UserMenu'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isScrolled } = useScrollPosition(60)
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const { isAuthenticated } = useAuth()

 
  const isTransparent = pathname === '/' && !isScrolled && !isOpen

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent py-5'
          : 'bg-white/90 py-3 shadow-soft backdrop-blur-md dark:bg-secondary-950/90'
      }`}
    >
      <nav className="container-app flex items-center justify-between" aria-label="Primary">
        <NavLink to="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight" onClick={() => setIsOpen(false)}>
          <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white`}>
            IF
          </span>
          <span className={isTransparent ? 'text-white' : 'text-secondary dark:text-white'}>
            Iron<span className="text-primary">Forge</span>
          </span>
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-primary'
                      : isTransparent
                      ? 'text-white/85 hover:text-white'
                      : 'text-slate-600 hover:text-primary dark:text-slate-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
              isTransparent ? 'border-white/30 text-white hover:bg-white/10' : 'border-secondary/10 text-secondary hover:bg-secondary/5 dark:border-white/10 dark:text-white'
            }`}
          >
            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {isAuthenticated ? (
            <UserMenu isTransparent={isTransparent} />
          ) : (
            <>
              <NavLink
                to="/login"
                className={`text-sm font-medium ${isTransparent ? 'text-white/85 hover:text-white' : 'text-slate-600 hover:text-primary dark:text-slate-300'}`}
              >
                Log In
              </NavLink>
              <Button to="/membership" variant="primary" className="!py-3 !px-6 text-xs">
                Join Now
              </Button>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`flex h-10 w-10 items-center justify-center rounded-full border ${
              isTransparent ? 'border-white/30 text-white' : 'border-secondary/10 text-secondary dark:border-white/10 dark:text-white'
            }`}
          >
            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <button
            type="button"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border ${
              isTransparent ? 'border-white/30 text-white' : 'border-secondary/10 text-secondary dark:border-white/10 dark:text-white'
            }`}
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden bg-white shadow-soft dark:bg-secondary-950 lg:hidden"
          >
            <ul className="container-app flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    end={link.path === '/'}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-3 text-base font-medium ${
                        isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li className="border-t border-secondary/10 pt-3 dark:border-white/10">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-1">
                    <NavLink
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-slate-600 dark:text-slate-300"
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/change-password"
                      onClick={() => setIsOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-slate-600 dark:text-slate-300"
                    >
                      Change Password
                    </NavLink>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <NavLink
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-slate-600 dark:text-slate-300"
                    >
                      Log In
                    </NavLink>
                    <NavLink
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-slate-600 dark:text-slate-300"
                    >
                      Create Account
                    </NavLink>
                  </div>
                )}
              </li>
              <li className="pt-2">
                <Button to="/membership" variant="primary" className="w-full" onClick={() => setIsOpen(false)}>
                  Join Now
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
