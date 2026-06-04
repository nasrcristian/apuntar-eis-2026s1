import { useCallback } from 'react'
import { enqueueSnackbar } from 'notistack'
import type { FileMetadataDTO, VideoMetadataDTO } from '../types/material'
import { fileUrl } from '../utils/filePreview'

function triggerBrowserDownload(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export function useDownloader() {
  const downloadUrl = useCallback((materialId: number, storedFileName: string) => {
    return fileUrl(materialId, storedFileName)
  }, [])

  const formatSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }, [])

  const downloadFile = useCallback(
    async (materialId: number, storedFileName: string, originalFileName: string) => {
      try {
        triggerBrowserDownload(downloadUrl(materialId, storedFileName), originalFileName)
      } catch {
        enqueueSnackbar('Error al iniciar la descarga', { variant: 'error' })
      }
    },
    [downloadUrl]
  )

  const downloadAll = useCallback(
    async (materialId: number, files: FileMetadataDTO[], videos: VideoMetadataDTO[]) => {
      try {
        const allFiles = [
          ...files.map((f) => ({ storedFileName: f.storedFileName, originalFileName: f.originalFileName })),
          ...videos.map((v) => ({ storedFileName: v.storedFileName, originalFileName: v.originalFileName })),
        ].filter(
          (item, i, arr) =>
            arr.findIndex((x) => x.storedFileName === item.storedFileName) === i
        )

        if (allFiles.length === 0) {
          enqueueSnackbar('No hay archivos para descargar', { variant: 'warning' })
          return
        }

        // Nota: Varios navegadores bloquean múltiples descargas simultáneas si se disparan "de golpe".
        // Con un pequeño delay entre cada una suele funcionar mejor.
        for (let i = 0; i < allFiles.length; i++) {
          const { storedFileName, originalFileName } = allFiles[i]
          triggerBrowserDownload(downloadUrl(materialId, storedFileName), originalFileName)
          // delay corto para evitar que el browser ignore clicks programáticos consecutivos
          await new Promise((r) => setTimeout(r, 250))
        }

        enqueueSnackbar(`Descarga iniciada (${allFiles.length} archivo(s))`, { variant: 'success' })
      } catch {
        enqueueSnackbar('Error al descargar los archivos', { variant: 'error' })
      }
    },
    [downloadUrl]
  )

  return { downloadUrl, formatSize, downloadFile, downloadAll }
}
