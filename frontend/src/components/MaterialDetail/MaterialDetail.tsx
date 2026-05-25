import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  Divider,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { useNavigate } from "react-router-dom";
import PdfPreview from "../PdfPreview/PdfPreview";
import MaterialSidebar from "../MaterialSidebar/MaterialSidebar";
import type {
  MaterialDTO,
  ReactionSummaryDTO,
  CommentDTO,
  AddCommentDTO,
  CurrentUser,
} from "../../types/material";
import { useMaterials } from "../../hooks/useMaterials";
import "./MaterialDetail.css";
import { enqueueSnackbar } from "notistack";

interface MaterialDetailProps {
  material: MaterialDTO;
  reactions: ReactionSummaryDTO;
  fetchReactions: () => void;
  currentUser: CurrentUser;
  initialComments?: CommentDTO[];
  fetchComments: () => void;
}

function formatDate(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name: string): string {
  if (!name) {
    return "";
  } else {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
}

export default function MaterialDetail({
  material,
  reactions,
  fetchReactions,
  currentUser,
  initialComments = [],
  fetchComments,
}: MaterialDetailProps) {
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const { saveComment, delComment } = useMaterials();

  const handlePublish = async () => {
    if (!commentText.trim()) {
      setError("El comentario no puede estar vacío.");
      return;
    }
    const newComment: AddCommentDTO = {
      authorName: currentUser.name + " " + currentUser.surname,
      text: commentText.trim(),
    };
    await saveComment(material.id, newComment);
    fetchComments();
    setCommentText("");
    setError("");
  };

  const handleDelete = async (id: string, authorId: string) => {
    if (currentUser.mail != authorId) {
      enqueueSnackbar("No puede eliminar un comentario ajeno", {
        variant: "error",
      });
    } else {
      await delComment(material.id, id);
    }
    fetchComments();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handlePublish();
    }
  };

  console.log(currentUser);

  return (
    <Box className="material-detail">
      <Box className="material-detail__header">
        <IconButton onClick={() => navigate(-1)} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          component="h1"
          className="material-detail__title"
        >
          {material.title}
        </Typography>
      </Box>

      <Box className="material-detail__body">
        <Box className="material-detail__pdf-panel">
          <PdfPreview files={material.files} materialId={material.id} />

          {/* ── Sección de comentarios ── */}
          <Box className="material-detail__comments">
            <Box className="material-detail__comments-header">
              <ChatBubbleIcon fontSize="small" color="action" />
              <Typography variant="h6" component="h2">
                Comentarios
                {initialComments.length > 0 && (
                  <Typography
                    component="span"
                    className="material-detail__comments-count"
                  >
                    {initialComments.length}
                  </Typography>
                )}
              </Typography>
            </Box>

            <Divider />

            {/* Lista de comentarios */}
            {initialComments.length === 0 ? (
              <Box className="material-detail__comments-empty">
                <Typography variant="body2" color="text.secondary">
                  Aún no hay comentarios. ¡Sé el primero en comentar!
                </Typography>
              </Box>
            ) : (
              <Box className="material-detail__comments-list">
                {initialComments.map((comment) => (
                  <Paper
                    key={comment.id}
                    variant="outlined"
                    className="material-detail__comment-item"
                  >
                    <Box className="material-detail__comment-top">
                      <Box className="material-detail__comment-author">
                        <Avatar className="material-detail__comment-avatar">
                          {getInitials(comment.authorName)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            className="material-detail__comment-name"
                          >
                            {comment.authorName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(comment.createdAt)}
                          </Typography>
                        </Box>
                      </Box>

                      {comment.userId === currentUser.mail && (
                        <IconButton
                          size="small"
                          aria-label="Eliminar comentario"
                          disabled={!currentUser.mail}
                          onClick={() =>
                            handleDelete(comment.id, comment.userId)
                          }
                          className="material-detail__comment-delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      className="material-detail__comment-content"
                    >
                      {comment.text}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}

            {/* Caja de nuevo comentario */}
            <Box className="material-detail__comment-form">
              <Avatar className="material-detail__comment-avatar material-detail__comment-avatar--current">
                {getInitials(currentUser.name)}
              </Avatar>
              <Box className="material-detail__comment-input-wrapper">
                <TextField
                  multiline
                  minRows={2}
                  maxRows={6}
                  fullWidth
                  placeholder={
                    !currentUser.mail
                      ? "Inicia sesion para comentar"
                      : "Escribí tu comentario... (Ctrl+Enter para publicar)"
                  }
                  value={commentText}
                  onChange={(e) => {
                    setCommentText(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyDown={handleKeyDown}
                  error={!!error}
                  helperText={error}
                  size="small"
                />
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handlePublish}
                  disabled={!currentUser.mail}
                  className="material-detail__comment-submit"
                >
                  Publicar comentario
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="material-detail__sidebar">
          <MaterialSidebar
            material={material}
            reactions={reactions}
            fetchReactions={fetchReactions}
            currentUser={currentUser}
          />
        </Box>
      </Box>
    </Box>
  );
}
