import type { ReactNode } from 'react'
import { Card, Typography, Avatar, Box, Divider } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import type { User } from '../hooks/useUser'

interface UserCardProps {
  user: User
  /** Slot opcional (ej. botón "Editar perfil"); se muestra arriba a la derecha. */
  action?: ReactNode
  /** Texto a mostrar cuando el usuario no tiene descripción. */
  descriptionPlaceholder?: string
}

export default function UserCard({
  user,
  action,
  descriptionPlaceholder = 'Este usuario aún no agregó una descripción.',
}: UserCardProps) {
  const displayName = `${user.name ?? ''} ${user.surname ?? ''}`.trim() || 'Sin nombre'
  const email = user.mail ?? 'Sin email'
  const initial = (user.name?.[0] ?? '?').toUpperCase()
  const description = user.description?.trim()

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        bgcolor: '#ebddb2',
        border: '2px solid',
        borderColor: '#ab4516',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      {/* Banner */}
      <Box sx={{ position: 'relative', height: { xs: 120, sm: 150 }, bgcolor: 'primary.main' }}>
        {action && (
          <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>{action}</Box>
        )}
      </Box>

      {/* Cabecera: avatar superpuesto + nombre/mail */}
      <Box
        sx={{
          px: { xs: 2.5, sm: 4 },
          pb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-end' },
          textAlign: { xs: 'center', sm: 'left' },
          gap: 2.5,
          mt: { xs: -6, sm: -5 },
        }}
      >
        <Avatar
          sx={{
            width: { xs: 110, sm: 128 },
            height: { xs: 110, sm: 128 },
            bgcolor: '#ebddb2',
            color: 'primary.main',
            fontSize: 52,
            fontFamily: 'Lilita One',
            border: '4px solid',
            borderColor: '#ab4516',
          }}
        >
          {initial}
        </Avatar>
        <Box sx={{ pb: { sm: 1 } }}>
          <Typography
            variant="h4"
            sx={{ fontFamily: 'Lilita One', letterSpacing: 0.5, color: 'primary.main', lineHeight: 1.15 }}
          >
            {displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {email}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(171,69,22,0.25)' }} />

      {/* Sección "Sobre mí" */}
      <Box sx={{ px: { xs: 2.5, sm: 4 }, py: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <PersonIcon fontSize="small" sx={{ color: 'primary.main' }} />
          <Typography
            variant="subtitle1"
            sx={{ fontFamily: 'Lilita One', letterSpacing: 0.5, color: 'primary.main' }}
          >
            Sobre mí
          </Typography>
        </Box>
        <Typography
          variant="body1"
          color={description ? 'text.primary' : 'text.secondary'}
          sx={{ whiteSpace: 'pre-wrap', fontStyle: description ? 'normal' : 'italic' }}
        >
          {description || descriptionPlaceholder}
        </Typography>
      </Box>
    </Card>
  )
}
