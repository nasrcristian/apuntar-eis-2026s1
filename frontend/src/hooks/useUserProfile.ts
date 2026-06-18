import { useEffect, useState } from 'react'
import { getUserProfile, getMaterialsByOwner } from '../service/api'
import type { UserDto } from '../types/dto'
import type { MaterialDTO } from '../types/material'

/**
 * Carga el perfil público de otro usuario y los materiales que subió.
 * Hace ambos requests en paralelo. Un perfil inexistente (404) se refleja en `error`.
 */
export function useUserProfile(mail: string | null) {
  const [user, setUser] = useState<UserDto | null>(null)
  const [materials, setMaterials] = useState<MaterialDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mail) {
      setLoading(false)
      setError('Usuario no especificado')
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([getUserProfile(mail), getMaterialsByOwner(mail)])
      .then(([profileRes, materialsRes]) => {
        if (cancelled) return
        setUser(profileRes.data)
        setMaterials(materialsRes.data)
      })
      .catch((err) => {
        if (cancelled) return
        const status = err?.response?.status
        setError(
          status === 404
            ? 'No encontramos a este usuario.'
            : 'No pudimos cargar el perfil. Intentá de nuevo.',
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [mail])

  return { user, materials, loading, error }
}
