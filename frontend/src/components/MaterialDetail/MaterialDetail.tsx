import { Box, Typography, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import PdfPreview from '../PdfPreview/PdfPreview'
import MaterialSidebar from '../MaterialSidebar/MaterialSidebar'
import type { MaterialDTO } from '../../types/material'
import './MaterialDetail.css'

interface MaterialDetailProps {
  material: MaterialDTO
}

export default function MaterialDetail({ material }: MaterialDetailProps) {
  const navigate = useNavigate()

  return (
    <Box className="material-detail">
      <Box className="material-detail__header">
        <IconButton onClick={() => navigate(-1)} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" className="material-detail__title">
          {material.title}
        </Typography>
      </Box>

      <Box className="material-detail__body">
        <Box className="material-detail__pdf-panel">
          <PdfPreview files={material.files} materialId={material.id} />
        </Box>
        <Box className="material-detail__sidebar">
          <MaterialSidebar material={material} />
        </Box>
      </Box>
    </Box>
  )
}
