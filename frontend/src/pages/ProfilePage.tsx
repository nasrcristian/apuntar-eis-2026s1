import { Container, Typography, Button, Stack, Box, CircularProgress, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import UserCard from '../components/UserCard'
import { useUser } from '../hooks/useUser'

export default function ProfilePage() {
  
  const navigate = useNavigate()
  const { user, loading, error } = useUser()


  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#1976d2' }}>
        Mi Perfil
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Acá vas a poder ver y gestionar tu información.
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!loading && user && (
        <Box sx={{ mb: 3 }}>
          <UserCard user={user} />
        </Box>
      )}

      <Stack spacing={2} sx={{ maxWidth: 360 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<LibraryBooksIcon />}
          onClick={() => navigate('/mis-publicaciones')}
        >
          Mis publicaciones
        </Button>
      </Stack>
    </Container>
  )
}