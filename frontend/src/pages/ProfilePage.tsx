import { useState } from 'react'
import { Container, Button, Stack, Box, CircularProgress, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import FavoriteIcon from '@mui/icons-material/Favorite'
import EditIcon from '@mui/icons-material/Edit'
import UserCard from '../components/UserCard'
import EditProfileModal from '../components/EditProfileModal'
import { useUser } from '../hooks/useUser'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, loading, error, refetch } = useUser()
  const [editOpen, setEditOpen] = useState(false)

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!loading && user && (
        <>
          <Box sx={{ mb: 4 }}>
            <UserCard
              user={user}
              descriptionPlaceholder="Aún no agregaste una descripción. Tocá 'Editar perfil' para contar algo sobre vos."
              action={
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => setEditOpen(true)}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontFamily: 'Lilita One',
                    letterSpacing: 0.5,
                    bgcolor: '#ebddb2',
                    color: 'primary.main',
                    '&:hover': { bgcolor: '#e0cf9a' },
                  }}
                >
                  Editar perfil
                </Button>
              }
            />
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

          <EditProfileModal
            open={editOpen}
            currentDescription={user.description}
            onClose={() => setEditOpen(false)}
            onSuccess={() => {
              setEditOpen(false)
              refetch()
            }}
          />
        </>
      )}
    </Container>
  )
}
