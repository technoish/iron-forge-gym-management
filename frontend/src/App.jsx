import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollProgress from './components/layout/ScrollProgress'
import BackToTop from './components/layout/BackToTop'
import ScrollToTopRoute from './components/layout/ScrollToTopRoute'
import AppRoutes from './routes/AppRoutes'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { sessionExpiredNotice, dismissSessionExpiredNotice } = useAuth()
  const { pathname } = useLocation()
  
  const isAdminRoute = pathname.startsWith('/admin')

 
  useEffect(() => {
    if (sessionExpiredNotice) {
      toast.error('Your session expired — please log in again.')
      dismissSessionExpiredNotice()
    }
  }, [sessionExpiredNotice, dismissSessionExpiredNotice])

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-surface dark:bg-secondary-950">
      <ScrollToTopRoute />
      {!isAdminRoute && <ScrollProgress />}
      {!isAdminRoute && <Navbar />}

      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <main id="main-content" className="flex-1">
        <AppRoutes />
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <BackToTop />}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
    </div>
  )
}
