import { Container, Typography, Button, Stack, Box, CircularProgress, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import FavoriteIcon from '@mui/icons-material/Favorite'
import UserCard from '../components/UserCard'
import { useUser } from '../hooks/useUser'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, loading, error } = useUser()

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ letterSpacing: 2, fontFamily: 'Lilita One', color: 'primary.main', mb: 1 }}>
          Mi Perfil
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Acá vas a poder ver y gestionar tu información.
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!loading && user && (
        <>
          <Box sx={{ mb: 4 }}>
            <UserCard user={user} />
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
            <Button
              variant="contained" size="large" fullWidth
              startIcon={<LibraryBooksIcon />}
              onClick={() => navigate('/mis-publicaciones')}
              sx={{
                py: 1.75, borderRadius: 3, fontFamily: 'Lilita One', letterSpacing: 1,
                textTransform: 'none', boxShadow: 2, maxWidth: { sm: 280 },
                '&:hover': { boxShadow: 5 },
              }}
            >
              Mis publicaciones
            </Button>
            <Button
              variant="outlined" size="large" fullWidth color="error"
              startIcon={<FavoriteIcon />}
              onClick={() => navigate('/favoritos')}
              sx={{
                py: 1.75, borderRadius: 3, fontFamily: 'Lilita One', letterSpacing: 1,
                textTransform: 'none', borderWidth: 2, maxWidth: { sm: 280 },
                '&:hover': { borderWidth: 2, bgcolor: 'rgba(157,0,6,0.06)' },
              }}
            >
              Favoritos
            </Button>
          </Stack>
        </>
      )}
    </Container>
  )
}