import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiChevronDown, FiUser, FiLock, FiShield, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'


export default function UserMenu({ isTransparent }) {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsOpen(false)
    await logout()
    toast.success("You've been logged out.")
    navigate('/')
  }

  const initial = (user?.first_name?.[0] || user?.username?.[0] || '?').toUpperCase()

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-sm font-medium transition-colors ${
          isTransparent
            ? 'border-white/30 text-white hover:bg-white/10'
            : 'border-secondary/10 text-secondary hover:bg-secondary/5 dark:border-white/10 dark:text-white'
        }`}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {initial}
        </span>
        {user?.first_name || user?.username}
        <FiChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl2 border border-secondary/10 bg-white py-2 shadow-soft-lg dark:border-white/10 dark:bg-secondary-900"
          >
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-secondary/5 hover:text-primary dark:text-slate-300 dark:hover:bg-white/5"
            >
              <FiUser size={15} /> Dashboard
            </Link>
            <Link
              to="/change-password"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-secondary/5 hover:text-primary dark:text-slate-300 dark:hover:bg-white/5"
            >
              <FiLock size={15} /> Change Password
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-secondary/5 hover:text-primary dark:text-slate-300 dark:hover:bg-white/5"
              >
                <FiShield size={15} /> Admin Panel
              </Link>
            )}
            <div className="my-1 border-t border-secondary/10 dark:border-white/10" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <FiLogOut size={15} /> Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
