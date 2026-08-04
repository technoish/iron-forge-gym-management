import api from './api'
import { createResourceApi } from './adminService'


export const trainerAdminApi = createResourceApi('/trainers/', { forceMultipart: true })


function mapTrainer(t) {
  return {
    id: t.id,
    name: t.name,
    specialization: t.specialization,
    experience: t.experience,
    bio: t.description,
    image: t.image,
    social: {
      facebook: t.facebook || '',
      instagram: t.instagram || '',
      linkedin: t.linkedin || '',
    },
    email: t.email || '',
    phone: t.phone || '',
  }
}

export async function getTrainers() {
  const { data } = await api.get('/trainers/', { params: { page_size: 100 } })
  return (data.data || []).map(mapTrainer)
}

export async function getTrainerById(id) {
  const { data } = await api.get(`/trainers/${id}/`)
  return mapTrainer(data.data)
}
