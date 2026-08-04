import api from './api'
import { createResourceApi } from './adminService'

export const testimonialAdminApi = createResourceApi('/testimonials/')


function mapTestimonial(t) {
  return {
    id: t.id,
    name: t.customer_name,
    role: 'IronForge Member',
    quote: t.review,
    avatar: t.image || null,
    rating: t.rating,
  }
}

export async function getTestimonials() {
  const { data } = await api.get('/testimonials/', { params: { page_size: 100 } })
  return (data.data || []).map(mapTestimonial)
}
