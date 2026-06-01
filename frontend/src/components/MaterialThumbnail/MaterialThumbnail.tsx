import { useEffect, useMemo, useState } from 'react'
import { Box, Skeleton } from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import VideoFileIcon from '@mui/icons-material/VideoFile'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
// Import del worker para Vite
// eslint-disable-next-line import/no-unresolved
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import type { FileMetadataDTO, VideoMetadataDTO } from '../../types/material'

GlobalWorkerOptions.workerSrc = pdfWorker

const API_BASE = 'http://localhost:8080'

function fileUrl(materialId: number, storedFileName: string) {
  return `${API_BASE}/materiales/${materialId}/archivos/${storedFileName}`
}

interface MaterialThumbnailProps {
  materialId: number
  files: FileMetadataDTO[]
  videos?: VideoMetadataDTO[]
  width?: number
  height?: number
}

export default function MaterialThumbnail({
  materialId,
  files,
  videos = [],
  width = 130,
  height = 90,
}: MaterialThumbnailProps) {
  const primary = useMemo(() => {
    const firstFile = files?.[0]
    if (firstFile) return { kind: 'file' as const, file: firstFile }
    const firstVideo = videos?.[0]
    if (firstVideo) return { kind: 'video' as const, file: firstVideo }
    return null
  }, [files, videos])

  const [thumb, setThumb] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setThumb(null)
      if (!primary || primary.kind !== 'file') return
      if (primary.file.contentType !== 'application/pdf') return

      setLoading(true)
      try {
        const url = fileUrl(materialId, primary.file.storedFileName)
        const pdf = await getDocument({ url }).promise
        const page = await pdf.getPage(1)

        // Render escalado al tamaño del thumbnail
        const viewport = page.getViewport({ scale: 1 })
        const scale = Math.min(width / viewport.width, height / viewport.height)
        const scaledViewport = page.getViewport({ scale })

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (!context) return

        canvas.width = Math.floor(scaledViewport.width)
        canvas.height = Math.floor(scaledViewport.height)

        const renderTask = page.render({ canvas, viewport: scaledViewport })
        await renderTask.promise

        if (!cancelled) {
          setThumb(canvas.toDataURL('image/png'))
        }
      } catch {
        // fallback a placeholder
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [materialId, primary, width, height])

  // Placeholder / preview
  return (
    <Box
      sx={{
        width,
        height,
        borderRadius: 1,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.12)',
        bgcolor: '#ebddb2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {loading ? (
        <Skeleton variant="rectangular" width={width} height={height} />
      ) : thumb ? (
        <img
          src={thumb}
          alt="preview"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : primary?.kind === 'file' ? (
        primary.file.contentType === 'application/pdf' ? (
          <PictureAsPdfIcon sx={{ fontSize: 42, color: 'rgba(0,0,0,0.45)' }} />
        ) : (
          <InsertDriveFileIcon sx={{ fontSize: 42, color: 'rgba(0,0,0,0.45)' }} />
        )
      ) : (
        <VideoFileIcon sx={{ fontSize: 42, color: 'rgba(0,0,0,0.45)' }} />
      )}
    </Box>
  )
}
