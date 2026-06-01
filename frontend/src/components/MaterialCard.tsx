import { useState, useEffect } from "react";
import { Card, Typography, IconButton, Box, Stack } from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Delete,
  Edit,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { MaterialDTO } from "../types/material";
import EditMaterialModal from "./EditMaterialModal";
import { getCurrentUserEmail } from '../service/auth';
import { toggleFavorite, getFavoriteStatus } from '../service/api';
import MaterialThumbnail from "./MaterialThumbnail/MaterialThumbnail";

interface MaterialCardProps {
  material: MaterialDTO;
  onDelete: (material: MaterialDTO) => void;
  onEditSuccess?: (updated: MaterialDTO) => void;
}

const MaterialCard = ({ material, onDelete, onEditSuccess }: MaterialCardProps) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFav] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const currentUserEmail = getCurrentUserEmail();
  const isOwner = currentUserEmail === material.ownerMail;
  const isLoggedIn = !!currentUserEmail;
  const [editOpen, setEditOpen] = useState(false);

  const date = new Date(material.createdAt).toLocaleDateString();

  useEffect(() => {
    if (!isLoggedIn) return;
    getFavoriteStatus(material.id)
      .then((res) => setIsFav(res.data.isFavorite))
      .catch(() => {});
  }, [material.id, isLoggedIn]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn || loadingFav) return;
    setLoadingFav(true);
    try {
      const res = await toggleFavorite(material.id);
      setIsFav(res.data.isFavorite);
    } catch {
      // silencioso
    } finally {
      setLoadingFav(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOwner) return;
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
          bgcolor: "#ebddb2",
          borderRadius: 3,
          flexDirection: "column",
          p: 1.5,
          transition: "0.2s",
          "&:hover": { boxShadow: 4 },
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: "bold", ml: 1, mb: 1 }}
        >
          {material.category.toUpperCase()}
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Preview */}
          <Box
            onClick={() => navigate(`/material/${material.id}`)}
            sx={{
              width: 130,
              height: 90,
              borderRadius: 1,
              cursor: "pointer",
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            <MaterialThumbnail
              materialId={material.id}
              files={material.files}
              videos={material.videos}
              width={130}
              height={90}
            />
          </Box>

          {/* Info del material */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              onClick={() => navigate(`/material/${material.id}`)}
              sx={{
                cursor: "pointer",
                fontWeight: "bold",
                lineHeight: 1.2,
                mb: 0.5,
                wordBreak: "break-word",
                overflowWrap: "anywhere",
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

          {/* Acciones */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {isLoggedIn && (
              <IconButton
                size="small"
                onClick={handleToggleFavorite}
                disabled={loadingFav}
                sx={{ color: isFavorite ? "#9d0006" : "default" }}
                aria-label="favorito"
              >
                {isFavorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            )}
            {isOwner && (
              <>
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
              </>
            )}
          </Box>
        </Box>

        {/* Footer */}
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
            por {material.ownerMail || "Usuario"} el {date}
          </Typography>

          {/* <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
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
          </Stack> */}
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
