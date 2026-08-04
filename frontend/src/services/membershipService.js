import api from './api'
import { createResourceApi } from './adminService'

export const planAdminApi = createResourceApi('/memberships/')

const DURATION_LABELS = {
  monthly: 'per month',
  quarterly: 'per quarter',
  yearly: 'per year',
}


function mapPlan(p) {
  return {
    id: p.id,
    name: p.plan_name,
    price: Number(p.price),
    duration: DURATION_LABELS[p.duration] || p.duration,
    durationKey: p.duration,
    description: p.description,
    features: Array.isArray(p.features) ? p.features : [],
    highlighted: p.is_popular,
    tag: p.is_popular ? 'Most Popular' : undefined,
  }
}

export async function getPlans() {
  const { data } = await api.get('/memberships/', { params: { page_size: 100 } })
  return (data.data || []).map(mapPlan)
}
