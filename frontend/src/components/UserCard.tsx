import { Card, CardContent, Typography, Avatar, Stack, Box } from '@mui/material'
import type { User } from '../hooks/useUser'

export default function UserCard({ user }: { user: User }) {
  const displayName = `${user.name ?? ''} ${user.surname ?? ''}`.trim() || 'Sin nombre'
  const email = user.mail ?? 'Sin email'
  const initial = (user.name?.[0] ?? '?').toUpperCase()

  return (
    <Card
      elevation={0}
      sx={{ bgcolor: '#ebddb2', border: '2px solid', borderColor: '#ab4516', borderRadius: 4 }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2.5}
          sx={{ alignItems: 'center', textAlign: { xs: 'center', sm: 'left' } }}
        >
          <Avatar
            sx={{
              width: 88, height: 88,
              bgcolor: 'primary.main', color: 'primary.contrastText',
              fontSize: 36, fontFamily: 'Lilita One',
              border: '3px solid', borderColor: '#ab4516',
            }}
          >
            {initial}
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontFamily: 'Lilita One', letterSpacing: 0.5, color: 'primary.main', lineHeight: 1.2 }}
            >
              {displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {email}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}