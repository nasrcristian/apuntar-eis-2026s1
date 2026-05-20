import { useState } from "react";
import { Card, Typography, IconButton, Box, Stack } from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ThumbUp,
  ThumbUpOutlined,
  ThumbDown,
  ThumbDownAltOutlined,
  Delete,
  Edit,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { MaterialDTO } from "../types/material";
import EditMaterialModal from "./EditMaterialModal";

interface MaterialCardProps {
  material: MaterialDTO;
  onDelete: (material: MaterialDTO) => void;
  onEditSuccess?: (updated: MaterialDTO) => void;
}

const MaterialCard = ({ material, onDelete, onEditSuccess }: MaterialCardProps) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFav] = useState(false);
  const [vote, setVote] = useState<null | "like" | "dislike">(null);
  const [editOpen, setEditOpen] = useState(false);
  const baseLikes = material.likes ?? 0;
  const baseDislikes = material.dislikes ?? 0;
  const likesCount =
    baseLikes + (vote === "like" ? 1 : 0) - (vote == null ? 0 : 0);
  const dislikesCount =
    baseDislikes + (vote === "dislike" ? 1 : 0) - (vote == null ? 0 : 0);

  const date = new Date(material.createdAt).toLocaleDateString();

  const handleToggleLike = () => {
    setVote((prev) => (prev === "like" ? null : "like"));
  };

  const handleToggleDislike = () => {
    setVote((prev) => (prev === "dislike" ? null : "dislike"));
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditOpen(true);
  };

  const handleEditSuccess = (updated: MaterialDTO) => {
    setEditOpen(false);
    onEditSuccess?.(updated);
  };

  return (
      <>
        <Card
            sx={{
            mb: 2,
            display: "flex",
            flexDirection: "column",
            p: 1.5,
            transition: "0.2s",
            "&:hover": { boxShadow: 4 },
            }}
        >
        {/* 1. Categoría superior (Resumen, Apunte, etc) */}
        <Typography
            variant="caption"
            sx={{ fontWeight: "bold", color: "text.secondary", ml: 1, mb: 1 }}
        >
            {material.category.toUpperCase()}
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
            {/* 2. Miniatura a la izquierda */}
            <Box onClick={() => navigate(`/material/${material.id}`)}
                sx={{
                    width: 130,
                    height: 90,
                    bgcolor: "#f0f0f0",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    border: "1px solid #e0e0e0",
                }}
            >
            <img
                src="https://via.placeholder.com/130x90?text=PDF"
                alt="preview"
                style={{ borderRadius: "4px" }}
            />
        </Box>

        {/* 3. Contenido central */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            onClick={() => navigate(`/material/${material.id}`)}
            sx={{
              cursor: "pointer",
              fontWeight: "bold",
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            {material.title}
          </Typography>
          <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
            {material.subject}
          </Typography>

          <Stack spacing={0.2} sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Descripción:</strong>{" "}
              {material.description || "Sin descripción adicional"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              <strong>Tópico:</strong> {material.topic || "No aclarado"}
            </Typography>
          </Stack>
        </Box>

        {/* 4. Botones de acción laterales (Favorito y Borrado) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <IconButton
            size="small"
            onClick={() => setIsFav(!isFavorite)}
            color={isFavorite ? "error" : "default"}
            aria-label="favorito"
          >
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <IconButton
              size="small"
              color="primary"
              onClick={handleEditClick}
              aria-label="editar"
            >
              <Edit />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(material)}
            aria-label="eliminar"
          >
            <Delete />
          </IconButton>
        </Box>
      </Box>

      {/* 5. Footer: Autor y Estadísticas (Like/Dislike/Views) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1.5,
          px: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          por {material.author || "Usuario"} el {date}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton size="small" onClick={handleToggleLike}>
              {vote === "like" ? (
                <ThumbUp fontSize="small" color="primary" />
              ) : (
                <ThumbUpOutlined fontSize="small" />
              )}
            </IconButton>
            <Typography variant="caption">{likesCount}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton size="small" onClick={handleToggleDislike}>
              {vote === "dislike" ? (
                <ThumbDown fontSize="small" color="error" />
              ) : (
                <ThumbDownAltOutlined fontSize="small" />
              )}
            </IconButton>
            <Typography variant="caption">{dislikesCount}</Typography>
          </Box>
        </Stack>
      </Box>
    </Card>

    {editOpen && (
        <EditMaterialModal
            open={editOpen}
            material={material}
            onClose={() => setEditOpen(false)}
            onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};

export default MaterialCard;
