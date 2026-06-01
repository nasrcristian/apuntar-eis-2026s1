import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box, Card, CardContent, Typography, TextField, Button, Alert,
  Stack, CircularProgress, Link,
} from '@mui/material'
import { postForgotPassword } from '../../service/api'

export default function ForgotPasswordPage() {
  const [mail, setMail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [resetToken, setResetToken] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mail.trim()) {
      setError('Ingresá tu correo')
      return
    }
    setError(null)
    // TODO: implementar el envío real del mail. Por ahora solo mostramos el éxito.
    setSubmitted(true)
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center',
              pt: { xs: 3, sm: 6 }, pb: 4, px: 2}}>
      <Box sx={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{letterSpacing: 2,fontFamily: 'Lilita One' }} 
            gutterBottom
            >
            Recuperar contraseña
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ingresa tu correo y te enviaremos instrucciones para crear una nueva contrseña.
          </Typography>
        </Box>

        <Card elevation={0} sx={{ 
            border: '1px solid', 
            borderColor: 'divider', 
            background: "#ebddb2",
            borderRadius: 5
          }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            {submitted ? (
              <Stack spacing={2}>
                <Alert severity="success">
                  El correo ha sido enviado.
                </Alert>
                {resetToken && (
                  <>
                    <Link component={RouterLink} to={`/reset-password?token=${resetToken}`}>
                      Restablecer mi contraseña
                    </Link>
                  </>
                )}
              </Stack>
            ) : (
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={3}>
                  {error && <Alert severity="error">{error}</Alert>}
                  <TextField
                    label="Correo electrónico"
                    type="email"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    fullWidth
                    required
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ minWidth: 160 }}>
                      {loading ? (
                        <><CircularProgress size={18} sx={{ mr: 1, color: 'inherit' }} /> Enviando...</>
                      ) : 'Enviar instrucciones'}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link component={RouterLink} to="/login" variant="body2">Volver al login</Link>
        </Box>
      </Box>
    </Box>
  )
}