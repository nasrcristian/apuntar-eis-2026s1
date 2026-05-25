import { useState, useEffect } from "react";
import type {
  CommentDTO,
  MaterialDTO,
  ReactionSummaryDTO,
} from "../types/material";
import { enqueueSnackbar } from "notistack";
import { getMaterial, getReactionSummary, getComments } from "../service/api";

interface UseMaterialDetailReturn {
  data: MaterialDTO | null;
  loading: boolean;
  refetch: () => void;
  reactions: ReactionSummaryDTO;
  fetchReactions: () => void;
  comments: CommentDTO[];
  fetchComments: () => void;
}

export function useMaterialDetail(id: number): UseMaterialDetailReturn {
  const [data, setData] = useState<MaterialDTO | null>(null);
  const [reactions, setReactions] = useState<ReactionSummaryDTO>({
    likes: 0,
    dislikes: 0,
    userReaction: null,
  });
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getMaterial(id);
      setData(res.data);
    } catch (err) {
      enqueueSnackbar("Error al cargar el material", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchReactions = async () => {
    setLoading(true);
    try {
      const res = await getReactionSummary(id);
      setReactions(res.data);
    } catch (error) {
      enqueueSnackbar(`Error al cargar las reacciones`, { variant: "error" });
    }
    setLoading(false);
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await getComments(id);
      setComments(res.data);
    } catch (error) {
      enqueueSnackbar(`Error al cargar los comentarios`, { variant: "error" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchReactions();
    fetchComments();
  }, [id]);

  return {
    data,
    loading,
    refetch: fetchData,
    reactions,
    fetchReactions,
    comments,
    fetchComments,
  };
}
