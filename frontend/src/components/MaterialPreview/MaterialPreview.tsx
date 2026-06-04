import { Box, Skeleton, Typography } from '@mui/material'
import BrokenImageIcon from '@mui/icons-material/BrokenImage'
import { useDocumentPreview } from '../../hooks/useDocumentPreview'
import type { FileMetadataDTO } from '../../types/material'
import './MaterialPreview.css'

interface MaterialPreviewProps {
  materialId: number
  /** Archivo a previsualizar (lo elige el contenedor). */
  file?: FileMetadataDTO
}

export default function MaterialPreview({ materialId, file }: MaterialPreviewProps) {
  const { status, kind, pdfPages, docxContainerRef } = useDocumentPreview(materialId, file)

  if (!file) return null

  if (status === 'unsupported' || status === 'error') {
    return (
      <Box className="material-preview__fallback">
        <BrokenImageIcon sx={{ fontSize: 64, opacity: 0.5 }} />
        <Typography variant="body1" color="text.secondary" align="center">
          No es posible previsualizar este archivo.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Usá el botón <strong>Descargar</strong> de abajo para verlo.
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="material-preview__scroll">
      {status === 'loading' && (
        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 1 }} />
      )}

      {kind === 'pdf'
        ? pdfPages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Página ${i + 1}`}
              className="material-preview__page"
            />
          ))
        : // El contenedor del DOCX debe estar montado durante 'loading' para que
          // el ref exista cuando el hook inyecta el render.
          <div ref={docxContainerRef} className="material-preview__docx" />}
    </Box>
  )
}
