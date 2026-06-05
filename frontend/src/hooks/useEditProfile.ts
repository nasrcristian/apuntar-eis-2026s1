import { useState } from 'react'
import { enqueueSnackbar } from 'notistack'
import { updateMyProfile } from '../service/api'
import type { UserDto } from '../types/dto'

/**
 * Lógica async para editar el perfil del usuario logueado (por ahora, la descripción).
 * Devuelve `save`, que persiste la descripción y retorna el UserDto actualizado
 * (o `null` si falló), más un flag `loading`.
 */
export function useEditProfile() {
  const [loading, setLoading] = useState(false)

  const save = async (description: string): Promise<UserDto | null> => {
    setLoading(true)
    try {
      const trimmed = description.trim()
      const res = await updateMyProfile(trimmed.length > 0 ? trimmed : null)
      enqueueSnackbar('Perfil actualizado', { variant: 'success' })
      return res.data
    } catch {
      enqueueSnackbar('No se pudo actualizar el perfil', { variant: 'error' })
      return null
    } finally {
      setLoading(false)
    }
  }

  return { save, loading }
}
