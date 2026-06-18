import { useState } from 'react'
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box, Card, CardContent, Typography, TextField, Button, Alert,
  Stack, CircularProgress, Link,
} from '@mui/material'
import { postResetPassword } from '../../service/api'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (!token) {
      setError('Token inválido o ausente')
      return
    }
    setLoading(true)
    try {
      await postResetPassword(token, password)
      navigate('/login')
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      setError(err?.response?.data?.message ?? 'El link expiró o no es válido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center',
              pt: { xs: 3, sm: 6 }, pb: 4, px: 2, backgroundColor: 'grey.50' }}>
      <Box sx={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }} gutterBottom>
            Nueva contraseña
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Elegí una nueva contraseña para tu cuenta
          </Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={3}>
                {!token && <Alert severity="warning">No se detectó un token válido en el link</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                  label="Nueva contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Confirmar contraseña"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  fullWidth
                  required
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="contained" size="large" disabled={loading || !token} sx={{ minWidth: 160 }}>
                    {loading ? (
                      <><CircularProgress size={18} sx={{ mr: 1, color: 'inherit' }} /> Guardando...</>
                    ) : 'Guardar nueva contraseña'}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link component={RouterLink} to="/login" variant="body2">Volver al login</Link>
        </Box>
      </Box>
    </Box>
  )
}