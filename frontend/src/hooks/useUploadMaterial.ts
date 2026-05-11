import { useState } from 'react'
import { isValidFile } from '../constants/materialOptions'

export interface MaterialFormData {
  titulo: string
  descripcion: string
  materia: string
  carrera: string
  tema: string
  categoria: string
  files: File[]
}

interface UseUploadMaterialReturn {
  loading: boolean
  success: string | null
  error: string | null
  uploadMaterial: (data: MaterialFormData) => Promise<boolean>
  resetMessages: () => void
}

function validateForm(data: MaterialFormData): string | null {
  if (!data.titulo.trim()) return 'El título es obligatorio'
  if (!data.descripcion.trim()) return 'La descripción es obligatoria'
  if (data.descripcion.trim().length < 10) return 'La descripción es demasiado corta'
  if (!data.materia) return 'Seleccioná una materia'
  if (!data.carrera) return 'Seleccioná una carrera'
  if (!data.tema) return 'Ingresá un tópico'
  if (!data.categoria) return 'Seleccioná una categoría'
  if (data.files.length === 0) return 'Adjuntá al menos un archivo'

  for (const file of data.files) {
    const result = isValidFile(file)
    if (!result.valid) return result.error!
  }

  return null
}

export const useUploadMaterial = (): UseUploadMaterialReturn => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const token = localStorage.getItem('jwt')

  const uploadMaterial = async (data: MaterialFormData): Promise<boolean> => {
    setSuccess(null)
    setError(null)

    const validationError = validateForm(data)
    if (validationError) {
      setError(validationError)
      return false
    }

    setLoading(true)

    try {
      const form = new FormData()
      form.append('title', data.titulo)
      form.append('description', data.descripcion)
      form.append('subject', data.materia)
      form.append('career', data.carrera)
      form.append('topic', data.tema)
      form.append('category', data.categoria.toUpperCase())
      data.files.forEach((file) => form.append('files', file))

      const res = await fetch('http://localhost:8080/materiales', {
        method: 'POST',
        body: form,
        headers: {
            'Authorization': `Bearer ${token}`,
        }
      })

      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(body || 'Error al subir el material')
      }

      setSuccess(`Material subido correctamente con ${data.files.length} archivo${data.files.length > 1 ? 's' : ''}`)
      return true
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setError(msg === 'Error al subir el material' ? 'No se pudo subir el archivo, reintentá más tarde' : msg)
      return false
    } finally {
      setLoading(false)
    }
  }

  const resetMessages = () => {
    setSuccess(null)
    setError(null)
  }

  return { loading, success, error, uploadMaterial, resetMessages }
}