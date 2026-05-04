import React, { useCallback, useRef, useState } from 'react'
import {
  Box, Typography, Paper, IconButton, List,
  ListItem, ListItemIcon, ListItemText, Chip, Tooltip,
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DeleteIcon from '@mui/icons-material/Delete'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { ALLOWED_EXTENSIONS, MAX_FILES, formatFileSize, isValidFile } from '../constants/materialOptions'

interface Props {
  files: File[]
  onFilesChange: (files: File[]) => void
}

function FileIcon({ name }: { name: string }) {
  return name.endsWith('.pdf')
    ? <PictureAsPdfIcon color="error" fontSize="small" />
    : <InsertDriveFileIcon color="primary" fontSize="small" />
}

export default function FileDropzone({ files, onFilesChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [fileErrors, setFileErrors] = useState<string[]>([])

  const openFileDialog = () => inputRef.current?.click()

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming || incoming.length === 0) return
      const errors: string[] = []
      const valid: File[] = []

      Array.from(incoming).forEach((f) => {
        const result = isValidFile(f)
        if (!result.valid) {
          errors.push(result.error!)
        } else if (files.some((existing) => existing.name === f.name && existing.size === f.size)) {
          errors.push(`${f.name} ya fue agregado`)
        } else {
          valid.push(f)
        }
      })

      setFileErrors(errors)
      const combined = [...files, ...valid].slice(0, MAX_FILES)
      if (combined.length > files.length) onFilesChange(combined)
    },
    [files, onFilesChange],
  )

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
    setFileErrors([])
  }

  const handleDrop: React.DragEventHandler = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  const handleDragOver: React.DragEventHandler = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave: React.DragEventHandler = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const canAddMore = files.length < MAX_FILES

  return (
    <Box>
      <Paper
        variant="outlined"
        onClick={canAddMore ? openFileDialog : undefined}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        sx={{
          p: 3,
          textAlign: 'center',
          borderStyle: 'dashed',
          borderColor: isDragOver ? 'primary.main' : fileErrors.length ? 'error.main' : 'grey.400',
          backgroundColor: isDragOver ? 'action.hover' : 'background.paper',
          cursor: canAddMore ? 'pointer' : 'default',
          transition: 'border-color 0.2s, background-color 0.2s',
          '&:hover': canAddMore ? { borderColor: 'primary.main', backgroundColor: 'action.hover' } : {},
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS}
          multiple
          style={{ display: 'none' }}
          onChange={(e) => addFiles(e.target.files)}
        />
        <UploadFileIcon sx={{ fontSize: 40, color: isDragOver ? 'primary.main' : 'text.secondary', mb: 1 }} />
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {canAddMore ? 'Arrastrá archivos o hacé click para seleccionar' : `Límite de ${MAX_FILES} archivos alcanzado`}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          PDF, DOC, DOCX · Máx 20 MB por archivo · Hasta {MAX_FILES} archivos
        </Typography>
      </Paper>

      {fileErrors.length > 0 && (
        <Box sx={{ mt: 1 }}>
          {fileErrors.map((err, i) => (
            <Typography key={i} variant="caption" color="error" sx={{ display: 'block' }}>
              {err}
            </Typography>
          ))}
        </Box>
      )}

      {files.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {files.length} archivo{files.length > 1 ? 's' : ''} seleccionado{files.length > 1 ? 's' : ''}
            </Typography>
            <Chip
              label={`${files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024 < 1
                ? `${(files.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(0)} KB`
                : `${(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(1)} MB`} total`}
              size="small"
              variant="outlined"
            />
          </Box>
          <List dense disablePadding>
            {files.map((file, index) => (
              <ListItem
                key={`${file.name}-${index}`}
                disableGutters
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  mb: 0.5,
                  backgroundColor: 'background.paper',
                }}
                secondaryAction={
                  <Tooltip title="Quitar archivo">
                    <IconButton edge="end" size="small" onClick={() => removeFile(index)} aria-label={`Quitar ${file.name}`}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FileIcon name={file.name} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" noWrap sx={{ maxWidth: 320 }}>
                      {file.name}
                    </Typography>
                  }
                  secondary={formatFileSize(file.size)}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  )
}