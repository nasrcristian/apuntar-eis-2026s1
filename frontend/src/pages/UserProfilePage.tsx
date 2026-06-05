import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material'
import UserCard from '../components/UserCard'
import MaterialCard from '../components/MaterialCard'
import { useUserProfile } from '../hooks/useUserProfile'
import { getCurrentUserEmail } from '../service/auth'
import { decodeMail } from '../utils/mailToken'

export default function UserProfilePage() {
  const { mail: rawMail } = useParams<{ mail: string }>()
  const navigate = useNavigate()
  const mail = rawMail ? decodeMail(rawMail) : null

  // Si el perfil es el del usuario logueado, lo mandamos a "Mi Perfil".
  // Esta lógica vive solo acá, así todos los puntos de entrada la heredan.
  const isSelf = !!mail && getCurrentUserEmail() === mail
  useEffect(() => {
    if (isSelf) navigate('/profile', { replace: true })
  }, [isSelf, navigate])

  const { user, materials, loading, error } = useUserProfile(isSelf ? null : mail)

  if (isSelf) return null

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      {!loading && !error && user && (
        <>
          <Box sx={{ mb: 4 }}>
            <UserCard
              user={user}
              descriptionPlaceholder="Este usuario aún no agregó una descripción."
            />
          </Box>

          <Typography
            variant="h6"
            sx={{ fontFamily: 'Lilita One', color: 'primary.main', mb: 2 }}
          >
            Sus materiales
          </Typography>

          {materials.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Este usuario aún no publicó materiales.
            </Typography>
          ) : (
            materials.map((material) => (
              <MaterialCard key={material.id} material={material} onDelete={() => {}} />
            ))
          )}
        </>
      )}
    </Container>
  )
}
