import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  CircularProgress,
  Link,
} from '@mui/material'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()


  const validate = (): boolean => {
    if (!email.trim() || !password.trim()) {
      setError('Los datos ingresados son incorrectos')
      return false
    }
    return true
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validate()) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail: email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        login(data.token)
        navigate('/home')
      } else {
        setError(data.error ?? 'El usuario ingresado no existe')
      }
    } catch {
      setError('Los datos ingresados son incorrectos')
    } finally {
      setLoading(false)
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
        px: 2,
        backgroundColor: 'grey.50',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }} gutterBottom>
            Iniciar sesión
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ingresá tus credenciales para acceder a tu cuenta
          </Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <Box component="form" onSubmit={handleLogin} noValidate>
              <Stack spacing={3}>
                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                  id="email"
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  fullWidth
                  required
                />

                <TextField
                  id="password"
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                  fullWidth
                  required
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Link component={RouterLink} to="/forgot-password" variant="body2">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ minWidth: 160 }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={18} sx={{ mr: 1, color: 'inherit' }} />
                        Ingresando...
                      </>
                    ) : (
                      'Iniciar sesión'
                    )}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            ¿No tenés cuenta?{' '}
            <Link component="button" variant="body2" onClick={() => navigate('/register')}>
              Registrate
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
