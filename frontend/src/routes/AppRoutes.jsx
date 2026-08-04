import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { PageLoader } from '../components/ui/Loader'
import ProtectedRoute, { PublicOnlyRoute } from './ProtectedRoute'

const Home = lazy(() => import('../pages/Home'))
const About = lazy(() => import('../pages/About'))
const Services = lazy(() => import('../pages/Services'))
const Membership = lazy(() => import('../pages/Membership'))
const Trainers = lazy(() => import('../pages/Trainers'))
const BMICalculator = lazy(() => import('../pages/BMICalculator'))
const Contact = lazy(() => import('../pages/Contact'))
const NotFound = lazy(() => import('../pages/NotFound'))
const Forbidden = lazy(() => import('../pages/Forbidden'))

const Login = lazy(() => import('../pages/auth/Login'))
const Register = lazy(() => import('../pages/auth/Register'))
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'))
const ChangePassword = lazy(() => import('../pages/auth/ChangePassword'))

const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'))

const AdminLayout = lazy(() => import('../pages/admin/AdminLayout'))
const AdminOverview = lazy(() => import('../pages/admin/AdminOverview'))
const AdminTrainers = lazy(() => import('../pages/admin/AdminTrainers'))
const AdminPlans = lazy(() => import('../pages/admin/AdminPlans'))
const AdminServices = lazy(() => import('../pages/admin/AdminServices'))
const AdminGallery = lazy(() => import('../pages/admin/AdminGallery'))
const AdminTestimonials = lazy(() => import('../pages/admin/AdminTestimonials'))
const AdminMessages = lazy(() => import('../pages/admin/AdminMessages'))

/** All app routes, lazily loaded so each page ships its own JS chunk. */
export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public marketing pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/bmi-calculator" element={<BMICalculator />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/403" element={<Forbidden />} />

        {/* Auth pages — hidden from already-logged-in users */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Authenticated — any role */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        {/* Admin-only */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="trainers" element={<AdminTrainers />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
