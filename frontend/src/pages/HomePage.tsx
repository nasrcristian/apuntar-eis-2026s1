'use client'

import {
  Box, Typography, Tooltip, IconButton, Snackbar,
  Collapse, Button
} from '@mui/material'
import YouTubeIcon from '@mui/icons-material/YouTube'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import EmailIcon from '@mui/icons-material/Email'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Vamian from '../../assets/Vamian Dillalba final.png'
import './HomePage.css'
import { useState } from 'react'

const SUPPORT_EMAIL = 'soporteApuntarAR@gmail.com'
const YOUTUBE_URL = 'https://www.youtube.com/@ApuntAR'
const LINKEDIN_URL = 'https://www.linkedin.com/company/apuntar'

type AccordionKey = 'proposito' | 'comoFormar' | null

export default function HomePage() {
  const [copied, setCopied] = useState(false)
  const [openSection, setOpenSection] = useState<AccordionKey>('proposito')

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL)
      setCopied(true)
    } catch {
      const el = document.createElement('textarea')
      el.value = SUPPORT_EMAIL
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
    }
  }

  const toggleSection = (key: AccordionKey) => {
    setOpenSection(prev => (prev === key ? null : key))
  }

  const [saltando, setSaltando] = useState(false);
  const handleJumpscareVami = () => {
    if (saltando) return;
    setSaltando(true);
    setTimeout(() => {
      setSaltando(false);
    }, 600); 
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      pt: { xs: 3, sm: 6 },
      pb: 4,
      px: 2,
      overflowY: 'auto',
    }}>
      <Box sx={{ width: '100%', maxWidth: 1000 }}>

        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ letterSpacing: 5, fontFamily: 'Lilita One', fontWeight: 500 }}
            gutterBottom
          >
            Bienvenido a ApuntAR
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize:20, letterSpacing: 1, fontFamily: 'Lilita One'}}>
            Compartí y descubrí material académico con tu comunidad
          </Typography>
        </Box>

        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 5,
            p: 2.5,
            mb: 2,
            bgcolor:'#ebddb2'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 1}}>
            <Button
              variant={openSection === 'proposito' ? 'contained' : 'outlined'}
              endIcon={
                <ExpandMoreIcon
                  sx={{
                    transform: openSection === 'proposito' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s',
                  }}
                />
              }
              onClick={() => toggleSection('proposito')}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
            >
              Nuestro propósito
            </Button>

            <Button
              variant={openSection === 'comoFormar' ? 'contained' : 'outlined'}
              endIcon={
                <ExpandMoreIcon
                  sx={{
                    transform: openSection === 'comoFormar' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s',
                  }}
                />
              }
              onClick={() => toggleSection('comoFormar')}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
            >
              Cómo formar parte
            </Button>
          </Box>

          <Collapse in={openSection === 'proposito'} timeout={300} unmountOnExit>
            <Box
              sx={{
                border: '3px solid',
                borderColor: '#ab4516',
                borderRadius: 10,
                p: 2.5,
                mb: openSection === 'comoFormar' ? 2 : 0,
                backgroundColor: '#ebddb2',
              }}
            >
              <Typography variant="h6" sx={{ letterSpacing: 1, fontFamily: 'Lilita One', fontWeight: 500, mb: 1 }}>
                ¿Qué es ApuntAR?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                ApuntAR es una plataforma colaborativa pensada para estudiantes argentinos.
                Su objetivo es facilitar el acceso y la distribución de material académico, apuntes,
                resúmenes, parciales y más, dentro de la comunidad estudiantil.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Beneficios principales
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, mt: 0, mb: 2 }}>
                {[
                  'Accedé a material académico subido por otros estudiantes de tu carrera.',
                  'Compartí tus propios apuntes y ayudá a la comunidad.',
                  'Encontrá recursos organizados por materia, carrera e institución.',
                  'Ahorrá tiempo buscando en un solo lugar todo lo que necesitás.',
                ].map((item, i) => (
                  <Typography component="li" variant="body2" color="text.secondary" key={i} sx={{ mb: 0.5 }}>
                    {item}
                  </Typography>
                ))}
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Acciones disponibles
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, mt: 0, mb: 0 }}>
                {[
                  'Explorar publicaciones de material académico.',
                  'Subir y compartir tus propios apuntes.',
                  'Buscar contenido por materia o carrera.',
                  'Guardar publicaciones para acceder más tarde.',
                ].map((item, i) => (
                  <Typography component="li" variant="body2" color="text.secondary" key={i} sx={{ mb: 0.5 }}>
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Collapse>

          <Collapse in={openSection === 'comoFormar'} timeout={300} unmountOnExit>
            <Box
              sx={{
                border: '3px solid',
                borderColor: '#ab4516',
                borderRadius: 10,
                p: 2.5,
                backgroundColor: '#ebddb2',
              }}
            >
              <Typography variant="h6" sx={{letterSpacing:1,fontFamily:'Lilita One', fontWeight: 500, mb: 1.5 }}>
                ¿Cómo empezar a participar?
              </Typography>

              {[
                {
                  step: '1',
                  title: 'Registrarse',
                  desc: 'Si todavía no estás logueado, hace click en el botón de "Iniciar sesión", que se encuentra en el extremo superior izquierdo. También vas a tener la opción de registrarte en caso de no tener una cuenta creada.',
                },
                {
                  step: '2',
                  title: 'Crear una publicación',
                  desc: 'Una vez registrado, accedé a la sección de "Quiero Colaborar". Subí tu archivo, completa datos necesarios, y tu aporte ya estará disponible para la comunidad.',
                },
                {
                  step: '3',
                  title: 'Buscar publicaciones',
                  desc: 'Usá el buscador para encontrar material por palabras clave. Tambien podés filtrar los resultados por categoría para encontrar lo que necesitás más rápido.',
                },
              ].map(({ step, title, desc }) => (
                <Box key={step} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      minWidth: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 14,
                      flexShrink: 0,
                      mt: 0.25,
                    }}
                  >
                    {step}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.25 }}>
                      {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>
      <Box
        sx={{
            display: 'flex'
          , justifyContent: 'center'
        }}>
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            maxWidth: "45%",
            m: 0, 
            borderRadius: 5,
            px: 2,
            py: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: "#ebddb2",
            gap: 0,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{fontSize: 16,letterSpacing:1, mb: 0.5, fontFamily:'Lilita One'}}>
            Contacto y redes sociales
          </Typography>

          <Box
            sx={{
              px: 2,
              py: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Tooltip title="Canal de YouTube de ApuntAR" arrow>
              <IconButton
                aria-label="YouTube de ApuntAR"
                onClick={() => window.open(YOUTUBE_URL, '_blank', 'noopener,noreferrer')}
                sx={{ color: '#FF0000', '&:hover': { backgroundColor: 'rgba(255,0,0,0.08)' } }}
              >
                <YouTubeIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="LinkedIn de ApuntAR" arrow>
              <IconButton
                aria-label="LinkedIn de ApuntAR"
                onClick={() => window.open(LINKEDIN_URL, '_blank', 'noopener,noreferrer')}
                sx={{ color: '#0A66C2', '&:hover': { backgroundColor: 'rgba(10,102,194,0.08)' } }}
              >
                <LinkedInIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Box sx={{ width: '1px', height: 24, backgroundColor: 'divider', mx: 0.5 }} />

            <Tooltip title={`Enviar correo a ${SUPPORT_EMAIL}`} arrow>
              <IconButton
                aria-label="Enviar correo de soporte"
                onClick={() => { window.location.href = `mailto:${SUPPORT_EMAIL}` }}
                sx={{ color: '#EA4335', '&:hover': { backgroundColor: 'rgba(234,67,53,0.08)' } }}
              >
                <EmailIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title={copied ? '¡Copiado!' : 'Copiar dirección de correo'} arrow>
              <IconButton
                aria-label="Copiar dirección de correo de soporte"
                onClick={handleCopyEmail}
                sx={{
                  color: copied ? 'success.main' : 'text.secondary',
                  transition: 'color 0.2s',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <ContentCopyIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box>
          <img src={Vamian} alt="Vamian Dillalba, el Mesías" 
          className={`image-box-container ${saltando ? 'Vamian-Jumpscare' : 'Vamian'}`} 
          onClick={handleJumpscareVami}/>
        </Box>
      </Box>

      <Snackbar
        open={copied}
        autoHideDuration={2500}
        onClose={() => setCopied(false)}
        message={`✓ Correo copiado: ${SUPPORT_EMAIL}`}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  )
}