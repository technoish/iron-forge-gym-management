

function storageKey(userId) {
  return `ironforge-bmi-history-${userId}`
}

export function getBmiHistory(userId) {
  if (!userId) return []
  try {
    const raw = window.localStorage.getItem(storageKey(userId))
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function addBmiEntry(userId, entry) {
  if (!userId) return []
  const history = getBmiHistory(userId)
  const next = [{ ...entry, id: crypto.randomUUID(), recordedAt: new Date().toISOString() }, ...history].slice(0, 50)
  window.localStorage.setItem(storageKey(userId), JSON.stringify(next))
  return next
}

export function removeBmiEntry(userId, entryId) {
  if (!userId) return []
  const next = getBmiHistory(userId).filter((e) => e.id !== entryId)
  window.localStorage.setItem(storageKey(userId), JSON.stringify(next))
  return next
}

export function clearBmiHistory(userId) {
  if (!userId) return
  window.localStorage.removeItem(storageKey(userId))
}
