import { useState } from 'react'
import { Box, Typography, Divider } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SchoolIcon from '@mui/icons-material/School'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import CategoryIcon from '@mui/icons-material/Category'
import LabelIcon from '@mui/icons-material/Label'
import DescriptionIcon from '@mui/icons-material/Description'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'
import { materias, carreras, categorias } from '../../constants/materialOptions'
import type { MaterialDTO } from '../../types/material'
import './MaterialSidebar.css'

type Reaction = 'like' | 'dislike' | null

interface FieldProps {
  icon: React.ReactNode
  label: string
  value: string
}

function Field({ icon, label, value }: FieldProps) {
  return (
    <Box className="sidebar__field">
      <span className="sidebar__field-icon">{icon}</span>
      <Box>
        <Typography className="sidebar__field-label">{label}</Typography>
        <Typography className="sidebar__field-value">{value}</Typography>
      </Box>
    </Box>
  )
}

interface MaterialSidebarProps {
  material: MaterialDTO
}

export default function MaterialSidebar({ material }: MaterialSidebarProps) {
  const [userReaction, setUserReaction] = useState<Reaction>(null)

  const subjectLabel = materias.find((m) => m.value === material.subject)?.label ?? material.subject
  const careerLabel = carreras.find((c) => c.value === material.career)?.label ?? material.career
  const categoryLabel = categorias.find((c) => c.value === material.category)?.label ?? material.category

  const formattedDate = new Date(material.createdAt).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const displayedLikes = material.reactions.likes + (userReaction === 'like' ? 1 : 0)
  const displayedDislikes = material.reactions.dislikes + (userReaction === 'dislike' ? 1 : 0)

  const handleLike = () => {
    setUserReaction((prev) => (prev === 'like' ? null : 'like'))
  }

  const handleDislike = () => {
    setUserReaction((prev) => (prev === 'dislike' ? null : 'dislike'))
  } 

  return (
    <Box className="sidebar">
      <Field icon={<PersonIcon fontSize="small" />} label="Autor" value={material.author || "Vamian Dillalba"} />

      <Box className="sidebar__reactions">
        <span className="sidebar__reactions-icon">
          <ThumbUpOutlinedIcon fontSize="small" />
        </span>
        <Box>
          <Typography className="sidebar__reactions-label">Reacciones</Typography>
          <Box className="sidebar__reactions-row">
            <Box className="sidebar__reaction-btn" onClick={handleLike}>
              {userReaction === 'like' ? (
                <ThumbUpIcon fontSize="small" color="primary" />
              ) : (
                <ThumbUpOutlinedIcon fontSize="small" />
              )}
              <Typography
                className="sidebar__reaction-count"
                color={userReaction === 'like' ? 'primary' : undefined}
              >
                {displayedLikes}
              </Typography>
            </Box>
            <Box className="sidebar__reaction-btn" onClick={handleDislike}>
              {userReaction === 'dislike' ? (
                <ThumbDownIcon fontSize="small" color="error" />
              ) : (
                <ThumbDownOutlinedIcon fontSize="small" />
              )}
              <Typography
                className="sidebar__reaction-count"
                color={userReaction === 'dislike' ? 'error' : undefined}
              >
                {displayedDislikes}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Field icon={<CalendarTodayIcon fontSize="small" />} label="Fecha de subida" value={formattedDate} />

      <Divider className="sidebar__divider" />

      <Field icon={<SchoolIcon fontSize="small" />} label="Materia" value={subjectLabel} />
      <Field icon={<WorkspacePremiumIcon fontSize="small" />} label="Carrera" value={careerLabel} />
      <Field icon={<CategoryIcon fontSize="small" />} label="Categoría" value={categoryLabel} />
      <Field icon={<LabelIcon fontSize="small" />} label="Tópico" value={material.topic} />

      <Divider className="sidebar__divider" />

      <Box className="sidebar__description">
        <span className="sidebar__description-icon">
          <DescriptionIcon fontSize="small" />
        </span>
        <Box>
          <Typography className="sidebar__description-label">Descripción</Typography>
          <Typography className="sidebar__description-text">{material.description}</Typography>
        </Box>
      </Box>
    </Box>
  )
}
