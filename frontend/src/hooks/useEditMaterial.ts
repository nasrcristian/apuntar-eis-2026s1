import { useState } from 'react'
import { isValidFile } from '../constants/materialOptions'
import type { MaterialDTO } from '../types/material'
import type { MaterialFormData } from './useUploadMaterial'

function validateForm(data: MaterialFormData, replaceFiles: boolean): string | null {
    if (!data.titulo.trim()) return 'El titulo es obligatorio'
    if (data.titulo.trim().length > 120) return 'El titulo no puede tener mas de 120 caracteres'
    if (!data.descripcion.trim()) return 'La descripcion es obligatoria'
    if (!data.materia.trim()) return 'Seleccioná una materia'
    if (!data.carrera.trim()) return 'Seleccioná una carrera'
    if (!data.tema.trim()) return 'Ingresá un topico'
    if (data.tema.trim().length > 80) return 'El tema no puede tener mas de 80 caracteres'
    if (!data.categoria) return 'Seleccioná una categoria'

    if (replaceFiles) {
        if (data.files.length === 0) return 'Adjuntá al menos un archivo'
        for (const file of data.files) {
            const result = isValidFile(file)
            if (!result.valid) return result.error!
        }
    }
    return null
}

interface UseEditMaterialReturn {
    loading: boolean
    success: string | null
    error: string | null
    editMaterial: (id: number, data: MaterialFormData, replaceFiles: boolean) => Promise<MaterialDTO | null>
    resetMessages: () => void
}

export const useEditMaterial = (): UseEditMaterialReturn => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const editMaterial = async (
        id: number,
        data: MaterialFormData,
        replaceFiles: boolean,
    ): Promise<MaterialDTO | null> => {
        setSuccess(null)
        setError(null)

        const validationError = validateForm(data, replaceFiles)
        if (validationError) {
            setError(validationError)
            return null
        }

        setLoading(true)
        const token = localStorage.getItem('jwt')

        try {
            const form = new FormData()
            form.append('title', data.titulo)
            form.append('description', data.descripcion)
            form.append('subject', data.materia)
            form.append('career', data.carrera)
            form.append('topic', data.tema)
            form.append('category', data.categoria.toUpperCase())
            if (replaceFiles) {
                data.files.forEach((file) => form.append('files', file))
            }

            const res = await fetch(`http://localhost:8080/materiales/${id}`, {
                method: 'PUT',
                body: form,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                const errorBody = await res.text().catch(() => '')
                console.error('[useEditMaterial] backend rechazó:', res.status, errorBody)
                throw new Error('update_failed')
            }

            const updated = (await res.json()) as MaterialDTO
            setSuccess('Cambios guardados correctamente')
            return updated
        } catch (err) {
            console.error('[useEditMaterial] error en editMaterial:', err)
            setError('No se pudieron guardar los cambios, intente nuevamente')
            return null
        } finally {
            setLoading(false)
        }
    }

    const resetMessages = () => {
        setSuccess(null)
        setError(null)
    }

    return { loading, success, error, editMaterial, resetMessages }
}