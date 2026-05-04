import { useState, useEffect } from 'react'
import type { MaterialDTO } from '../types/material'

const BASE_URL = 'http://localhost:8080'

interface UseMaterialDetailReturn {
  data: MaterialDTO | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useMaterialDetail(id: number): UseMaterialDetailReturn {
  const [data, setData] = useState<MaterialDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BASE_URL}/materiales/${id}`)
      if (!res.ok) {
        throw new Error('Material no encontrado')
      }
      const result: MaterialDTO = await res.json()
      result.reactions = {likes: 0, dislikes: 0}
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el material')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  return { data, loading, error, refetch: fetchData }
}
