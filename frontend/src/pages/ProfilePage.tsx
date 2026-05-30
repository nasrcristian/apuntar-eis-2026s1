import { Container, Typography, Button, Stack, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'

export default function ProfilePage() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ letterSpacing: 2, fontFamily: 'Lilita One', mb: 3}}>
        Mi Perfil
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Acá vas a poder ver y gestionar tu información.
        </Typography>
      </Box>

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