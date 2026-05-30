import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material'


export default function HomePage() {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      pt: { xs: 3, sm: 6 },
      pb: 4,
      px: 2
    }}>
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" sx={{ letterSpacing: 5,fontFamily: 'Lilita One', fontWeight: 500 }} gutterBottom>
            Bienvenido a ApuntAr
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Compartí y descubrí material académico con tu comunidad
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}