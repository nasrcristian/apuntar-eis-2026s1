import { Box, Button, Typography, Divider, Tooltip } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import DownloadingIcon from '@mui/icons-material/Downloading'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import VideoFileIcon from '@mui/icons-material/VideoFile'
import { useDownloader } from '../../hooks/useDownloader'
import type { FileMetadataDTO, VideoMetadataDTO } from '../../types/material'
import './Downloader.css'

interface DownloaderProps {
  files: FileMetadataDTO[]
  videos?: VideoMetadataDTO[]
  materialId: number
}

function FileIcon({ contentType }: { contentType: string }) {
  if (contentType === 'application/pdf') return <PictureAsPdfIcon color="error" />
  if (contentType.startsWith('video/')) return <VideoFileIcon color="primary" />
  return <InsertDriveFileIcon color="action" />
}

export default function Downloader({ files, videos = [], materialId }: DownloaderProps) {
  const { downloadFile, downloadAll, formatSize } = useDownloader()
  const totalFiles = files.length + videos.length

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
        {[...files, ...videos].map((file) => (
          <Box
            key={file.storedFileName}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <FileIcon contentType={file.contentType} />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap title={file.originalFileName}>
                {file.originalFileName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatSize(file.size)}
              </Typography>
            </Box>
            <Button
              size="small"
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => downloadFile(materialId, file.storedFileName, file.originalFileName)}
            >
              Descargar
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  )
}