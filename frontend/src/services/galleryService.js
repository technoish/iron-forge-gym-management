import api from './api'
import { createResourceApi } from './adminService'

export const galleryAdminApi = createResourceApi('/gallery/')

function mapImage(g) {
  return { id: g.id, src: g.image, title: g.title, category: g.category }
}

export async function getGalleryImages() {
  const { data } = await api.get('/gallery/', { params: { page_size: 100 } })
  return (data.data || []).map(mapImage)
}
