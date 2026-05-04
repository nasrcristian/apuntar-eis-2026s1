import { TextField, MenuItem, Stack } from '@mui/material'
import { materias, carreras, categorias } from '../constants/materialOptions'

interface MaterialFormFieldsProps {
  titulo: string
  descripcion: string
  materia: string
  carrera: string
  tema: string
  categoria: string
  onTituloChange: (value: string) => void
  onDescripcionChange: (value: string) => void
  onMateriaChange: (value: string) => void
  oncarreraChange: (value: string) => void
  ontemaChange: (value: string) => void
  onCategoriaChange: (value: string) => void
}

export default function MaterialFormFields({
  titulo,
  descripcion,
  materia,
  carrera,
  tema,
  categoria,
  onTituloChange,
  onDescripcionChange,
  onMateriaChange,
  oncarreraChange,
  ontemaChange,
  onCategoriaChange,
}: MaterialFormFieldsProps) {
  return (
    <Stack spacing={2.5}>
      <TextField
        label="Título"
        value={titulo}
        onChange={(e) => onTituloChange(e.target.value)}
        required
        fullWidth
        placeholder="Ej: Resumen Unidad 3 - Termodinámica"
        {...({ inputProps: { maxLength: 120 } } as any)}
        helperText={titulo.length > 80 ? `${titulo.length}/120 caracteres` : undefined}
      />

      <TextField
        label="Descripción"
        value={descripcion}
        onChange={(e) => onDescripcionChange(e.target.value)}
        required
        fullWidth
        multiline
        minRows={3}
        maxRows={6}
        placeholder="Describí brevemente el contenido del material..."
        helperText={descripcion.length > 0 && descripcion.length < 10 ? 'Mínimo 10 caracteres' : undefined}
        error={descripcion.length > 0 && descripcion.length < 10}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          select
          label="Materia"
          value={materia}
          onChange={(e) => onMateriaChange(e.target.value)}
          required
          fullWidth
        >
          {materias.map((m) => (
            <MenuItem key={m.value} value={m.value}>
              {m.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Carrera"
          value={carrera}
          onChange={(e) => oncarreraChange(e.target.value)}
          required
          fullWidth
        >
          {carreras.map((f) => (
            <MenuItem key={f.value} value={f.value}>
              {f.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <TextField
        label="Tópico"
        value={tema}
        onChange={(e) => ontemaChange(e.target.value)}
        required
        fullWidth
        placeholder="Ej: Unidad 3 o Termodinámica"
        {...({ inputProps: { maxLength: 80 } } as any)}
        helperText={tema.length > 60 ? `${tema.length}/80 caracteres` : undefined}
      />

      <TextField
        select
        label="Categoría"
        value={categoria}
        onChange={(e) => onCategoriaChange(e.target.value)}
        required
        fullWidth
      >
        {categorias.map((c) => (
          <MenuItem key={c.value} value={c.value}>
            {c.label}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  )
}