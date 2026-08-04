import api from './api'
import { createResourceApi } from './adminService'

export const serviceAdminApi = createResourceApi('/services/')


function mapService(s) {
  return {
    id: s.id,
    title: s.title,
    short: s.description?.length > 120 ? `${s.description.slice(0, 117)}…` : s.description,
    desc: s.description,
    icon: s.icon,
    image: s.image,
  }
}

export async function getServices() {
  const { data } = await api.get('/services/', { params: { page_size: 100 } })
  return (data.data || []).map(mapService)
}

export async function getServiceById(id) {
  const { data } = await api.get(`/services/${id}/`)
  return mapService(data.data)
}
