import { useCallback, useEffect, useRef, useState } from 'react'


export function usePaginatedResource(resourceApi, initialParams = {}) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({})
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const requestId = useRef(0)
 
  const initialParamsRef = useRef(initialParams)
  initialParamsRef.current = initialParams

  const setFilter = useCallback((key, value) => {
    setPage(1)
    setFilters((prev) => {
      const next = { ...prev }
      if (value === '' || value === undefined || value === null) delete next[key]
      else next[key] = value
      return next
    })
  }, [])

  const load = useCallback(() => {
    const id = ++requestId.current
    setIsLoading(true)
    setError(null)
    return resourceApi
      .list({ ...initialParamsRef.current, ...filters, search: search || undefined, page })
      .then(({ items: newItems, meta: newMeta }) => {
        if (id !== requestId.current) return
        setItems(newItems)
        setMeta(newMeta)
        setIsLoading(false)
      })
      .catch((err) => {
        if (id !== requestId.current) return
        setError(err)
        setIsLoading(false)
      })
  }, [resourceApi, page, search, filters])

  // Reset to page 1 whenever the search term changes.
  useEffect(() => {
    setPage(1)
  }, [search])

  useEffect(() => {
    load()
  }, [load])

  return {
    items,
    meta,
    isLoading,
    isError: Boolean(error),
    error,
    page,
    setPage,
    search,
    setSearch,
    filters,
    setFilter,
    refetch: load,
  }
}
