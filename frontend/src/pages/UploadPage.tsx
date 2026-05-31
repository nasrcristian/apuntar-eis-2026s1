import { Box, Card, CardContent, Typography } from '@mui/material'
import { useState } from 'react'
import UploadForm from '../components/UploadForm'
import { useUploadMaterial } from '../hooks/useUploadMaterial'
import type { MaterialFormData } from '../hooks/useUploadMaterial'

const EMPTY_FORM = {
  titulo: '',
  descripcion: '',
  materia: '',
  carrera: '',
  tema: '',
  categoria: '',
  files: [] as File[],
}

export default function UploadPage() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitCount, setSubmitCount] = useState(0)
  const { loading, success, error, uploadMaterial, resetMessages } = useUploadMaterial()

  const update = <K extends keyof typeof EMPTY_FORM>(key: K, value: (typeof EMPTY_FORM)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    resetMessages()

    const formData: MaterialFormData = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      materia: form.materia,
      carrera: form.carrera,
      tema: form.tema,
      categoria: form.categoria,
      files: form.files,
    }

    const ok = await uploadMaterial(formData)

    if (ok) {
      setForm(EMPTY_FORM)
      setSubmitCount((c) => c + 1)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pt: { xs: 3, sm: 6 },
        pb: 4,
        px: 2
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 760 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontFamily: "Lilita One",letterSpacing: 2}} gutterBottom>
            Subir material teórico
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Compartí apuntes, resúmenes y material académico con tu comunidad
          </Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', bgcolor:'#ebddb2' }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <UploadForm
              key={submitCount}
              titulo={form.titulo}
              descripcion={form.descripcion}
              materia={form.materia}
              carrera={form.carrera}
              tema={form.tema}
              categoria={form.categoria}
              files={form.files}
              loading={loading}
              success={success}
              error={error}
              onTituloChange={(v) => update('titulo', v)}
              onDescripcionChange={(v) => update('descripcion', v)}
              onMateriaChange={(v) => update('materia', v)}
              oncarreraChange={(v) => update('carrera', v)}
              ontemaChange={(v) => update('tema', v)}
              onCategoriaChange={(v) => update('categoria', v)}
              onFilesChange={(v) => update('files', v)}
              onSubmit={handleSubmit}
              onCloseSuccess={resetMessages}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}