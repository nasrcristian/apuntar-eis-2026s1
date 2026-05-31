import { Card, CardContent, Typography, Avatar, Grid} from '@mui/material'
import type { User } from '../hooks/useUser'

export default function UserCard({ user }: { user: User }) {

  const displayName = `${user.name ?? ''} ${user.surname ?? ''}`.trim() || 'Sin nombre'
  const email = user.mail ?? 'Sin email'


  return (
    <Card sx={{bgcolor:'#ebddb2'}}>
      <CardContent>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid>
            <Avatar sx={{ width: 80, height: 80 }}>
              {(user.name?.[0] ?? '?').toUpperCase()}
            </Avatar>
          </Grid>
          <Grid size="grow">
            <Typography variant="h6">{displayName}</Typography>
            <Typography variant="body2" color="text.secondary">{email}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}