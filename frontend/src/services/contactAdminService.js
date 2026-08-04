import api from './api'

export async function listContactMessages(params = {}) {
  const { data } = await api.get('/contact/', { params })
  return { items: data.data || [], meta: data.meta || null }
}

export async function getContactMessage(id) {
  const { data } = await api.get(`/contact/${id}/`)
  return data.data
}
