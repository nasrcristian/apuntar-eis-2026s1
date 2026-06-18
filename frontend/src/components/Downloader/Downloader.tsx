import { Box, Button, Chip, Typography, Divider, Tooltip } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import DownloadingIcon from '@mui/icons-material/Downloading'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import VideoFileIcon from '@mui/icons-material/VideoFile'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useDownloader } from '../../hooks/useDownloader'
import type { FileMetadataDTO, VideoMetadataDTO } from '../../types/material'
import './Downloader.css'

interface DownloaderProps {
  files: FileMetadataDTO[]
  videos?: VideoMetadataDTO[]
  materialId: number
  /** storedFileName del archivo que se está previsualizando. */
  selectedFileName?: string
  /** Selecciona un archivo para previsualizar (solo aplica a `files`, no a videos). */
  onSelectFile?: (storedFileName: string) => void
}

function FileIcon({ contentType }: { contentType: string }) {
  if (contentType === 'application/pdf') return <PictureAsPdfIcon color="error" />
  if (contentType.startsWith('video/')) return <VideoFileIcon color="primary" />
  return <InsertDriveFileIcon color="action" />
}

export default function Downloader({
  files,
  videos = [],
  materialId,
  selectedFileName,
  onSelectFile,
}: DownloaderProps) {
  const { downloadFile, downloadAll, formatSize } = useDownloader()

  const items = [...files, ...videos].filter(
    (item, i, arr) =>
      arr.findIndex((x) => x.storedFileName === item.storedFileName) === i
  )
  const totalFiles = items.length
  // Solo tiene sentido elegir cuál previsualizar si hay más de un documento (no video).
  const selectableCount = items.filter(
    (f) => !f.contentType.startsWith('video/')
  ).length
  const canSelect = !!onSelectFile && selectableCount > 1

  if (totalFiles === 0) {
    return (
      <Box className="pdf-preview">
        <InsertDriveFileIcon className="pdf-preview__icon--empty" />
        <Typography variant="body2" className="pdf-preview__text">
          No hay archivos disponibles
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="pdf-preview pdf-preview--has-file">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, gap: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Archivos ({totalFiles})
        </Typography>
        {totalFiles > 1 && (
          <Tooltip title="Descarga todos los archivos">
            <Button
              size="small"
              variant="outlined"
              startIcon={<DownloadingIcon />}
              onClick={() => downloadAll(materialId, files, videos)}
            >
              Descargar todos
            </Button>
          </Tooltip>
        )}
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map((file) => {
          const isVideo = file.contentType.startsWith('video/')
          const selectable = canSelect && !isVideo
          const isActive = !isVideo && file.storedFileName === selectedFileName

          return (
            <Box
              key={file.storedFileName}
              onClick={selectable ? () => onSelectFile?.(file.storedFileName) : undefined}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                border: '1px solid',
                borderColor: isActive ? 'primary.main' : 'divider',
                bgcolor: isActive ? 'action.selected' : 'transparent',
                borderRadius: 1,
                cursor: selectable ? 'pointer' : 'default',
                '&:hover': { bgcolor: selectable || isActive ? 'action.hover' : 'transparent' },
              }}
            >
              <FileIcon contentType={file.contentType} />
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap title={file.originalFileName}>
                    {file.originalFileName}
                  </Typography>
                  {isActive && canSelect && (
                    <Chip
                      size="small"
                      color="primary"
                      variant="outlined"
                      icon={<VisibilityIcon />}
                      label="Viendo"
                    />
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {formatSize(file.size)}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={(e) => {
                  e.stopPropagation()
                  downloadFile(materialId, file.storedFileName, file.originalFileName)
                }}
              >
                Descargar
              </Button>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}