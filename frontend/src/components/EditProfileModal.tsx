import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useEditProfile } from '../hooks/useEditProfile'
import type { UserDto } from '../types/dto'

const MAX_LENGTH = 500

interface Props {
  open: boolean
  currentDescription?: string
  onClose: () => void
  onSuccess: (updated: UserDto) => void
}

export default function EditProfileModal({
  open,
  currentDescription,
  onClose,
  onSuccess,
}: Props) {
  const [description, setDescription] = useState(currentDescription ?? '')
  const { save, loading } = useEditProfile()

  // Sincroniza el textarea con la descripción actual cada vez que se abre.
  useEffect(() => {
    if (open) setDescription(currentDescription ?? '')
  }, [open, currentDescription])

  const handleSubmit = async () => {
    const updated = await save(description)
    if (updated) onSuccess(updated)
  }

  const tooLong = description.length > MAX_LENGTH

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar perfil</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Descripción"
          placeholder="Contá algo sobre vos: qué estudiás, qué materiales compartís…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          minRows={4}
          maxRows={10}
          fullWidth
          autoFocus
          error={tooLong}
          helperText={`${description.length}/${MAX_LENGTH}`}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={tooLong || loading}>
          {loading ? (
            <>
              <CircularProgress size={18} sx={{ mr: 1, color: 'inherit' }} />
              Guardando...
            </>
          ) : (
            'Guardar'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
