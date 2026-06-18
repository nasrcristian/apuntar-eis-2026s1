import { useEffect, useState } from 'react'
import { getUserProfile } from '../service/api'

/**
 * Resuelve el nombre visible de un usuario a partir de su email (el `ownerMail`
 * del material). Devuelve `null` mientras carga o si falla, para que la UI pueda
 * caer al email como fallback.
 */
export function useAuthorName(mail: string): string | null {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    if (!mail) return
    let cancelled = false

    getUserProfile(mail)
      .then((res) => {
        if (cancelled) return
        const { name, surname } = res.data
        const full = `${name ?? ''} ${surname ?? ''}`.trim()
        setName(full || null)
      })
      .catch(() => {
        if (!cancelled) setName(null)
      })

    return () => {
      cancelled = true
    }
  }, [mail])

  return name
}
