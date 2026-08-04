import { useCallback, useEffect, useRef, useState } from 'react'


export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const requestId = useRef(0)

  const load = useCallback(() => {
    const id = ++requestId.current
    setIsLoading(true)
    setError(null)
    return fetcher()
      .then((result) => {
        if (id === requestId.current) {
          setData(result)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (id === requestId.current) {
          setError(err)
          setIsLoading(false)
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    load()
  }, [load])

  return { data, isLoading, isError: Boolean(error), error, refetch: load }
}
