import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Stack,
    Alert,
    Divider,
    Typography,
    CircularProgress,
    FormControlLabel,
    Switch,
} from '@mui/material'
import { useEffect, useState } from 'react'
import MaterialFormFields from './MaterialFormFields'
import FileDropzone from './FileDropzone'
import type { MaterialDTO } from '../types/material'
import type { MaterialFormData } from '../hooks/useUploadMaterial'
import { useEditMaterial } from '../hooks/useEditMaterial'

interface Props {
    open: boolean
    material: MaterialDTO
    onClose: () => void
    onSuccess: (updated: MaterialDTO) => void
}

export default function EditMaterialModal({ open, material, onClose, onSuccess }: Props) {
    const buildInitialForm = (m: MaterialDTO): MaterialFormData => ({
        titulo: m.title,
        descripcion: m.description,
        materia: m.subject,
        carrera: m.career,
        tema: m.topic,
        categoria: m.category,
        files: [],
    })

    const [form, setForm] = useState<MaterialFormData>(buildInitialForm(material))
    const [replaceFiles, setReplaceFiles] = useState(false)

    const { loading, success, error, editMaterial, resetMessages } = useEditMaterial()

    useEffect(() => {
        if (open) {
            setForm(buildInitialForm(material))
            setReplaceFiles(false)
            resetMessages()
        }
    }, [open, material.id])

    const update = <K extends keyof MaterialFormData>(key: K, value: MaterialFormData[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }))

    const handleSubmit = async () => {
        const updated = await editMaterial(material.id, form, replaceFiles)
        if (updated) {
            onSuccess(updated)
        }
    }

    const isValid =
        form.titulo.trim().length > 0 &&
        form.titulo.trim().length <= 120 &&
        form.descripcion.trim().length > 0 &&
        form.materia.length > 0 &&
        form.carrera.length > 0 &&
        form.tema.trim().length > 0 &&
        form.tema.trim().length <= 80 &&
        form.categoria.length > 0 &&
        (!replaceFiles || form.files.length > 0)

    const archivosActuales = [...material.files, ...material.videos]

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
          <DialogTitle>Editar publicación</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ pt: 1 }}>
              <Stack spacing={3}>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

                <MaterialFormFields
                  titulo={form.titulo}
                  descripcion={form.descripcion}
                  materia={form.materia}
                  carrera={form.carrera}
                  tema={form.tema}
                  categoria={form.categoria}
                  onTituloChange={(v) => update('titulo', v)}
                  onDescripcionChange={(v) => update('descripcion', v)}
                  onMateriaChange={(v) => update('materia', v)}
                  oncarreraChange={(v) => update('carrera', v)}
                  ontemaChange={(v) => update('tema', v)}
                  onCategoriaChange={(v) => update('categoria', v)}
                />

                <Divider />

                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Archivos adjuntos
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={replaceFiles}
                          onChange={(e) => {
                            setReplaceFiles(e.target.checked)
                            if (!e.target.checked) update('files', [])
                          }}
                        />
                      }
                      label="Reemplazar archivos"
                    />
                  </Box>

                  {replaceFiles ? (
                    <FileDropzone files={form.files} onFilesChange={(v) => update('files', v)} />
                  ) : (
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Se mantendrán los archivos actuales:
                      </Typography>
                      {archivosActuales.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          (Sin archivos)
                        </Typography>
                      ) : (
                        archivosActuales.map((f) => (
                          <Typography key={f.storedFileName} variant="body2">
                            • {f.originalFileName}
                          </Typography>
                        ))
                      )}
                    </Box>
                  )}
                </Box>
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" disabled={!isValid || loading}>
              {loading ? (
                <>
                  <CircularProgress size={18} sx={{ mr: 1, color: 'inherit' }} />
                  Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      )
  }



