import { Box, Button, Alert, Stack, CircularProgress, Divider, Typography } from '@mui/material'
import React from 'react'
import MaterialFormFields from './MaterialFormFields'
import FileDropzone from './FileDropzone'

interface UploadFormProps {
  titulo: string
  descripcion: string
  materia: string
  carrera: string
  tema: string
  categoria: string
  files: File[]
  loading: boolean
  success: string | null
  error: string | null
  onTituloChange: (value: string) => void
  onDescripcionChange: (value: string) => void
  onMateriaChange: (value: string) => void
  oncarreraChange: (value: string) => void
  ontemaChange: (value: string) => void
  onCategoriaChange: (value: string) => void
  onFilesChange: (files: File[]) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function UploadForm({
  titulo,
  descripcion,
  materia,
  carrera,
  tema,
  categoria,
  files,
  loading,
  success,
  error,
  onTituloChange,
  onDescripcionChange,
  onMateriaChange,
  oncarreraChange,
  ontemaChange,
  onCategoriaChange,
  onFilesChange,
  onSubmit,
}: UploadFormProps) {
  const isValid =
    titulo.trim().length > 0 &&
    descripcion.trim().length >= 10 &&
    materia.length > 0 &&
    carrera.length > 0 &&
    tema.trim().length > 0 &&
    categoria.length > 0 &&
    files.length > 0

  return (
    <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 2 }}>
      <Stack spacing={3}>
        {success && (
          <Alert severity="success" onClose={() => {}}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" onClose={() => {}}>
            {error}
          </Alert>
        )}

        <MaterialFormFields
          titulo={titulo}
          descripcion={descripcion}
          materia={materia}
          carrera={carrera}
          tema={tema}
          categoria={categoria}
          onTituloChange={onTituloChange}
          onDescripcionChange={onDescripcionChange}
          onMateriaChange={onMateriaChange}
          oncarreraChange={oncarreraChange}
          ontemaChange={ontemaChange}
          onCategoriaChange={onCategoriaChange}
        />

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Archivos
          </Typography>
          <FileDropzone files={files} onFilesChange={onFilesChange} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!isValid || loading}
            sx={{ minWidth: 160 }}
          >
            {loading ? (
              <>
                <CircularProgress size={18} sx={{ mr: 1, color: 'inherit' }} />
                Subiendo...
              </>
            ) : (
              'Subir material'
            )}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}