import { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CategoryIcon from "@mui/icons-material/Category";
import LabelIcon from "@mui/icons-material/Label";
import DescriptionIcon from "@mui/icons-material/Description";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import {
  materias,
  carreras,
  categorias,
} from "../../constants/materialOptions";
import type { Reaction, MaterialSidebarProps } from "../../types/material";
import { useMaterials } from "../../hooks/useMaterials";
import { useAuthorName } from "../../hooks/useAuthorName";
import "./MaterialSidebar.css";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { encodeMail } from "../../utils/mailToken";

interface FieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick?: () => void;
}

function Field({ icon, label, value, onClick }: FieldProps) {
  return (
    <Box
      className="sidebar__field"
      onClick={onClick}
      sx={onClick ? { cursor: "pointer", "&:hover": { opacity: 0.75 } } : undefined}
    >
      <span className="sidebar__field-icon">{icon}</span>
      <Box>
        <Typography className="sidebar__field-label">{label}</Typography>
        <Typography className="sidebar__field-value">{value}</Typography>
      </Box>
    </Box>
  );
}

export default function MaterialSidebar({
  material,
  reactions,
  fetchReactions,
  currentUser,
}: MaterialSidebarProps) {
  const [localLikes, setLocalLikes] = useState(reactions.likes);
  const [localDislikes, setLocalDislikes] = useState(reactions.dislikes);
  const [userReaction, setUserReaction] = useState<Reaction>(
    reactions.userReaction,
  );
  const { valueMaterial, unvalueMaterial } = useMaterials();
  const navigate = useNavigate();
  const authorName = useAuthorName(material.ownerMail);

  const subjectLabel =
    materias.find((m) => m.value === material.subject)?.label ??
    material.subject;
  const careerLabel =
    carreras.find((c) => c.value === material.career)?.label ?? material.career;
  const categoryLabel =
    categorias.find((c) => c.value === material.category)?.label ??
    material.category;

  const formattedDate = new Date(material.createdAt).toLocaleDateString(
    "es-AR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const displayedLikes = localLikes;
  const displayedDislikes = localDislikes;

  const handleLike = async () => {
    if (!currentUser.mail) {
      enqueueSnackbar("Debes iniciar sesion para valorar", {
        variant: "error",
        autoHideDuration: 2000
      });
    } else if (userReaction === "LIKE") {
      setUserReaction(null);
      setLocalLikes((prev) => prev - 1);
      await unvalueMaterial(material.id);
    } else {
      if (userReaction === "DISLIKE") setLocalDislikes((prev) => prev - 1);
      setUserReaction("LIKE");
      setLocalLikes((prev) => prev + 1);
      await valueMaterial("LIKE", material.id);
    }
    fetchReactions();
  };

  const handleDislike = async () => {
    if (!currentUser.mail) {
      enqueueSnackbar("Debes iniciar sesion para valorar", {
        variant: "error",
        autoHideDuration: 2000
      });
    } else if (userReaction === "DISLIKE") {
      setUserReaction(null);
      setLocalDislikes((prev) => prev - 1);
      await unvalueMaterial(material.id);
    } else {
      if (userReaction === "LIKE") setLocalLikes((prev) => prev - 1);
      setUserReaction("DISLIKE");
      setLocalDislikes((prev) => prev + 1);
      await valueMaterial("DISLIKE", material.id);
    }
    fetchReactions();
  };

  useEffect(() => {
    setUserReaction(reactions.userReaction);
    setLocalLikes(reactions.likes);
    setLocalDislikes(reactions.dislikes);
  }, [reactions]);

  return (
    <Box className="sidebar">
      <Field
        icon={<PersonIcon fontSize="small" />}
        label="Autor"
        value={authorName ?? material.ownerMail}
        onClick={() => navigate(`/usuario/${encodeMail(material.ownerMail)}`)}
      />

      <Box className="sidebar__reactions">
        <span className="sidebar__reactions-icon">
          <ThumbUpOutlinedIcon fontSize="small" />
        </span>
        <Box>
          <Typography className="sidebar__reactions-label">
            Reacciones
          </Typography>
          <Box className="sidebar__reactions-row">
            <Box
              className="sidebar__reaction-btn sidebar__reaction-btn_up"
              onClick={handleLike}
            >
              {userReaction === "LIKE" ? (
                <ThumbUpIcon fontSize="small" />
              ) : (
                <ThumbUpOutlinedIcon fontSize="small" />
              )}
              <Typography
                className="sidebar__reaction-count"
              >
                {displayedLikes}
              </Typography>
            </Box>
            <Box
              className="sidebar__reaction-btn sidebar__reaction-btn_dwn"
              onClick={handleDislike}
            >
              {userReaction === "DISLIKE" ? (
                <ThumbDownIcon fontSize="small"/>
              ) : (
                <ThumbDownOutlinedIcon fontSize="small" />
              )}
              <Typography
                className="sidebar__reaction-count"
              >
                {displayedDislikes}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Field
        icon={<CalendarTodayIcon fontSize="small" />}
        label="Fecha de subida"
        value={formattedDate}
      />

      <Divider className="sidebar__divider" />

      <Field
        icon={<SchoolIcon fontSize="small" />}
        label="Materia"
        value={subjectLabel}
      />
      <Field
        icon={<WorkspacePremiumIcon fontSize="small" />}
        label="Carrera"
        value={careerLabel}
      />
      <Field
        icon={<CategoryIcon fontSize="small" />}
        label="Categoría"
        value={categoryLabel}
      />
      <Field
        icon={<LabelIcon fontSize="small" />}
        label="Tópico"
        value={material.topic}
      />

      <Divider className="sidebar__divider" />

      <Box className="sidebar__description">
        <span className="sidebar__description-icon">
          <DescriptionIcon fontSize="small" />
        </span>
        <Box>
          <Typography className="sidebar__description-label">
            Descripción
          </Typography>
          <Typography className="sidebar__description-text">
            {material.description}
          </Typography>
        </Box>
      </Box>
      <Divider className="sidebar__divider" />
    </Box>
  );
}
