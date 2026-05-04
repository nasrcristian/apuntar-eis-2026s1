import { Box, Typography } from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import type { FileMetadataDTO } from '../../types/material'
import './PdfPreview.css'

interface PdfPreviewProps {
  files: FileMetadataDTO[]
  materialId: number
}

export default function PdfPreview({ files }: PdfPreviewProps) {
  const pdfFile = files.find((f) => f.contentType === 'application/pdf')

  if (!pdfFile) {
    return (
      <Box className="pdf-preview">
        <PictureAsPdfIcon className="pdf-preview__icon--empty" />
        <Typography variant="body2" className="pdf-preview__text">
          No hay archivo PDF disponible
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="pdf-preview pdf-preview--has-file">
      <PictureAsPdfIcon className="pdf-preview__icon--file" />
      <Typography variant="body1" className="pdf-preview__text">
        Vista previa del PDF
      </Typography>
      <Typography variant="caption" className="pdf-preview__filename">
        {pdfFile.originalFileName}
      </Typography>
    </Box>
  )
}
